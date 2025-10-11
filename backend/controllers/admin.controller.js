import mongoose from "mongoose";
import USER from "../models/users.model.js";
import createError from "../utils/createError.js";
import crypto from 'crypto';
import { sendEmail } from "../utils/sendEmail.js";
import { adminCreationMailContent, verificationApprovedMailContent, verificationRejectedMailContent } from "../assets/mails.js";
import LAWYER from "../models/lawyers.model.js";
import { deleteFileByUrl } from "../utils/deleteFile.js";
import CONTACT from "../models/contact.model.js";
import moment from "moment-timezone";

export const getDashboardData = async (req,res,next) => {
    try {
        const startOfWeek = moment().startOf('week').toDate();
        const startOfMonth = moment().startOf('month').toDate();

        const [ totalUsers, usersThisWeek, totalLawyers, lawyersThisMonth, totalLawyerRequests, requestsThisWeek,
        totalContactSubmissions, submissionsThisMonth, recentLawyerRequests, recentContactSubmissions ] = await Promise.all([
            USER.countDocuments(),
            USER.countDocuments({ createdAt: { $gte: startOfWeek } }),
            LAWYER.countDocuments({ verificationStatus: 'approved' }),
            LAWYER.countDocuments({ verificationStatus: 'approved', createdAt: { $gte: startOfMonth } }),
            LAWYER.countDocuments({ verificationStatus: 'pending' }),
            LAWYER.countDocuments({ verificationStatus: 'pending', createdAt: { $gte: startOfWeek } }),
            CONTACT.countDocuments(),
            CONTACT.countDocuments({ createdAt: { $gte: startOfMonth } }),
            LAWYER.find({ verificationStatus: 'pending' }).sort({ createdAt: -1 }).limit(2).populate({ path: 'userId', select: 'name email profileImage -_id' }).select("userId specialization"),
            CONTACT.find().sort({ status: 1,createdAt: -1 }).limit(4)
        ]);

        res.status(200).json({ success: true, lawyers: recentLawyerRequests, submissions: recentContactSubmissions, stats: {
            totalUsers, usersThisWeek, totalLawyers, lawyersThisMonth, totalLawyerRequests, requestsThisWeek, totalContactSubmissions, submissionsThisMonth
        } })
    } catch (error) {
        next(error);
    }
}

export const getUserData = async (req,res,next) => {
    try {
        const { role = "", page = 1, limit = 10, search = "" } = req.query;
        const userId = req.userId;

        const query = { _id: { $ne: new mongoose.Types.ObjectId(userId) } };

        if (role){
            query.role = role;
        }

        if (search){
            const searchTerm = new RegExp(search, "i");
            query.$or = [
                { name: { $regex: searchTerm } },
                { email: { $regex: searchTerm  } }
            ];
        }

        const result = await USER.paginate(query, { page: parseInt(page), limit: parseInt(limit), sort: { createdAt: -1 }, select: 'name email profileImage role status createdAt' });
        res.status(200).json({ success: true, data: result.docs, pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            resultsOnPage: result.docs.length,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage }
        });

    } catch (error) {
        next(error);
    }
}

export const updateUserStatus = async (req,res,next) => {
    try {
        const { status, userId } = req.body;

        if (!['active', 'suspended'].includes(status)){
            throw createError("Invalid status provided.", 400);
        }

        const userToUpdate = await USER.findById(userId);

        if (!userToUpdate) {
            throw createError("User not found.", 404);
        }

        if (userToUpdate.role === 'admin') {
            throw createError("Admin accounts cannot be suspended.", 403);
        }

        userToUpdate.status = status;
        await userToUpdate.save();

        res.status(200).json({ success: true, message: `User status successfully updated to ${status}!!`});
    } catch (error) {
        next(error);
    }
}

export const createNewAdmin = async (req,res,next) => {
    try {
        const { name, email } = req.body;
        const randomPassword = crypto.randomBytes(8).toString('hex');

        const newAdmin = new USER({ name, email, password: randomPassword,  role: 'admin', verified: true });

        await newAdmin.save();

        try {
            const emailContent = adminCreationMailContent({ adminName: name, adminEmail: email, password: randomPassword });
            await sendEmail({ to: email, ...emailContent });
        } catch (emailError) {
            await USER.findByIdAndDelete(newAdmin._id);
            return next(createError("Admin was not created because the credentials email could not be sent. Please check email server configuration.", 500));
        }

        res.status(201).json({
            success: true,
            message: `Admin account for ${name} created successfully. Credentials have been sent to ${email}.`
        });
    } catch (error) {
        next(error);
    }
}

export const getLawyersData = async (req,res,next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const result = await LAWYER.paginate({ verificationStatus: 'pending' },{ 
            page: parseInt(page), 
            limit: parseInt(limit), 
            sort: { createdAt: 1 },
            populate: {
                path: "userId",
                select: "name email profileImage -_id"
            },
            select: "userId specialization"
        });

        res.status(200).json({ success: true, data: result.docs, pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            resultsOnPage: result.docs.length,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage }
        });
    } catch (error) {
        next(error);
    }
}

export const getLawyerProfile = async (req,res,next) => {
    try {
        const { lawyerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
            throw createError("Invalid Lawyer ID.", 400);
        }

        const lawyer = await LAWYER.findById(lawyerId).populate({ path: "userId", select: "name profileImage email -_id verified" })
        .select("userId specialization bio qualifications phone fees address documents verificationStatus");

        if (!lawyer){
            throw createError("Lawyer profile not found.", 404);
        }

        if (lawyer.verificationStatus === "approved" || lawyer.userId.verified === true){
            throw createError("Lawyer is already verified.", 400);
        }

        res.status(200).json({ success: true, data: lawyer });
    } catch (error) {
        next(error);
    }
}

export const updateVerificationStatus = async (req,res,next) => {
    try {
        const { status, lawyerId, rejectReason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
            throw createError("Invalid Lawyer ID.", 400);
        }

        if (!["rejected", "approved"].includes(status)) {
            throw createError("Invalid status provided.", 400);
        }

        if (status === "rejected" && !rejectReason) {
            throw createError("A reason is required for rejection.", 400);
        }

        const lawyer = await LAWYER.findById(lawyerId).populate('userId', 'name email');
        if (!lawyer) {
            throw createError("Lawyer profile not found.", 404);
        }
        
        const user = await USER.findById(lawyer.userId._id);

        if (lawyer.verificationStatus === "approved" || user.verified === true){
            throw createError("Lawyer is already verified.", 400);
        }

        if (status === "approved") {
            lawyer.verificationStatus = "approved"; 
            user.verified = true;

            await Promise.all([lawyer.save(), user.save()]);

            const mailContent = verificationApprovedMailContent(user.name);
            await sendEmail({ to: user.email, ...mailContent });

            res.status(200).json({ success: true, message: `Lawyer ${user.name} has been approved.` });

        } else {
            const documentsToDelete = [
                lawyer.documents.barCouncilCertificate,
                lawyer.documents.practiceCertificate,
                lawyer.documents.governmentId,
                lawyer.documents.lawDegree,
            ];
    
            await Promise.all(documentsToDelete.map(url => deleteFileByUrl(url)));
            await LAWYER.findByIdAndDelete(lawyerId);
            user.bioDataProvided = false;
            await user.save();
            const mailContent = verificationRejectedMailContent(user.name, rejectReason);
            await sendEmail({ to: user.email, ...mailContent });

            res.status(200).json({ success: true, message: `Lawyer ${user.name} has been rejected.` });
        }

    } catch (error) {
        next(error);
    }
}

export const getContactSubmissionList = async (req,res,next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const result = await CONTACT.paginate({  },{ 
            page: parseInt(page), 
            limit: parseInt(limit), 
            sort: { status: 1, createdAt: -1 },
        });

        res.status(200).json({ success: true, data: result.docs, pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            resultsOnPage: result.docs.length,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage }
        });
    } catch (error) {
        next(error);
    }
}

export const getContactDetails = async (req,res,next) => {
    try {
        const { contactId } = req.params;

        if (!mongoose.isValidObjectId(contactId)){
            throw createError("Invalid Contact Submission ID.", 400);
        }

        const contact = await CONTACT.findByIdAndUpdate(contactId, { status: "read" }, { new: true });

        if (!contact){
            throw createError("Contact Submission Not Found", 404);
        }

        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
}

export const removeContactSubmission = async (req,res,next) => {
    try {
        const { contactId } = req.params;

        if (!mongoose.isValidObjectId(contactId)){
            throw createError("Invalid Contact Submission ID.", 400);
        }

        const deletedContact = await CONTACT.findByIdAndDelete(contactId);

        if (!deletedContact) {
            throw createError("Contact Submission Not Found", 404);
        }

        res.status(200).json({ success: true, message: "Submission deleted successfully." });
    } catch (error) {
        next(error);
    }
}