import mongoose from "mongoose";
import USER from "../models/users.model.js";
import createError from "../utils/createError.js";
import crypto from 'crypto';
import { sendEmail } from "../utils/sendEmail.js";
import { adminCreationMailContent } from "../assets/mails.js";

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