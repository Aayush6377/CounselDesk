import mongoose from "mongoose";
import USER from "../models/users.model.js";
import { deleteUploadedImage } from "../utils/deleteFile.js";
import { generateFileUrl } from "./lawyer.controller.js";
import LAWYER from "../models/lawyers.model.js";
import createError from "../utils/createError.js";
import TIMESLOT from "../models/timeSlot.model.js";
import moment from "moment-timezone";
import APPOINTMENT from "../models/appointments.model.js";
import { generateInvoicePDF } from "../assets/invoice.js";
import REVIEW from "../models/reviews.model.js";
import PAYMENT from "../models/payments.model.js";
import { populate } from "dotenv";

export const profileUpdate = async (req,res,next) => {
    try {
        const userId = req.userId;
        const { name } = req.body;
        const user = await USER.findById(userId);

        if (req.file && user.profileImage) {
            await deleteUploadedImage(user.profileImage);
        }

        user.name = name;
        if (req.file) {
            user.profileImage = generateFileUrl(req, req.file);
        }

        await user.save();
        res.status(200).json({success: true, message: "Profile updated successfully."});
    } catch (error) {
        next(error);
    }
}

export const lawyersList = async (req, res, next) => {
    try {
        const { search = "", specialization = "", rating = 0, limit = 12, page=1, address } = req.query;

        const queryRating = parseFloat(rating);
        const addressFilter = address ? JSON.parse(address) : null;

        const pipeline = [
            { $match: { role: "lawyer", verified: true } },
            { $lookup: { from: "lawyers", localField: "_id", foreignField: "userId", as: "lawyerDetails" } },
            { $match: { "lawyerDetails": { $ne: [] } } },
            { $unwind: '$lawyerDetails' },
        ];

        let filterMatch = {};
        if (search) {
            filterMatch.name = { $regex: search, $options: 'i' };
        }
        if (specialization) {
            filterMatch["lawyerDetails.specialization"] = specialization;
        }
        if (queryRating > 0) {
            filterMatch['lawyerDetails.rating'] = { $gte: queryRating };
        }
        if (Object.keys(filterMatch).length > 0) {
            pipeline.push({ $match: filterMatch });
        }

        let addFieldsStage = {
            subscriptionPriority: {
                $cond: {
                    if: {
                        $and: [
                            { $in: ['$lawyerDetails.subscription.plan', ['monthly', 'yearly']] },
                            { $in: ['$lawyerDetails.subscription.status', ['active', 'canceled']] }
                        ]
                    },
                    then: 1,
                    else: 2
                }
            }
        };

        if (addressFilter) {
            addFieldsStage.addressPriority = {
                $cond: {
                    if: {
                        $and: [
                            { $eq: ['$lawyerDetails.address.state', addressFilter.state] },
                            { $eq: ['$lawyerDetails.address.city', addressFilter.city] }
                        ]
                    },
                    then: 1,
                    else: {
                        $cond: {
                            if: { $eq: ['$lawyerDetails.address.state', addressFilter.state] },
                            then: 2,
                            else: 3
                        }
                    }
                }
            };
        } else {
            addFieldsStage.addressPriority = { $literal: 3 };
        }
        pipeline.push({ $addFields: addFieldsStage });

        pipeline.push({
            $sort: {
                addressPriority: 1,
                subscriptionPriority: 1,
                'lawyerDetails.rating': -1,
                'lawyerDetails.reviewsCount': -1,
                'lawyerDetails.fees': -1,
                name: 1
            }
        });

        pipeline.push({
            $project: {
                _id: 1,
                name: 1,
                profileImage: 1,
                specialization: '$lawyerDetails.specialization',
                bio: '$lawyerDetails.bio',
                rating: '$lawyerDetails.rating',
                reviewsCount: '$lawyerDetails.reviewsCount',
                fees: '$lawyerDetails.fees',
                address: '$lawyerDetails.address',
                subscription: '$lawyerDetails.subscription.plan'
            }
        });

        const result = await USER.aggregatePaginate(pipeline,  {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        });

        res.status(200).json({ success: true, data: result.docs,  pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage
        } });

    } catch (error) {
        next(error);
    }
};

export const lawyerProfile = async (req,res, next) => {
    try {
        const { lawyerId } = req.params;

        const lawyer = await LAWYER.findOne({userId: lawyerId}).populate({path: "userId", select: "name profileImage email"}).select("-documents");
        if (!lawyer){
            throw createError("Lawyer Not Found",404);
        }

        const now = moment().tz("Asia/Kolkata").toDate();
        const availability = await TIMESLOT.find({lawyerId: lawyer._id, status: "available", startTime: {$gte: now}},{startTime: 1, endTime: 1, status: 1, _id: 0}).sort("startTime").limit(3);

        const reviews = await REVIEW.aggregate([
            { $match: { lawyerId: lawyer._id } },
            { $sort: { rating: -1, createdAt: -1 } },
            {
                $group: {
                    _id: "$userId",
                    doc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$doc" } },
            { $sort: { rating: -1, createdAt: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
            { $unwind: '$userId' },
            {
                $project: {
                    rating: 1,
                    comment: 1,
                    createdAt: 1,
                    user: {
                        name: '$userId.name',
                        profileImage: '$userId.profileImage'
                    }
                }
            }
        ]);

        res.json({success: true, data: lawyer, availability, reviews});
    } catch (error) {
        next(error);
    }
}

export const lawyerTimeSlots = async (req,res,next) => {
    try {
        const { lawyerId } = req.params;
        const userId = req.userId;
        const lawyer = await LAWYER.findOne({userId: lawyerId}).populate({path: "userId", select: "name"}).select("userId fees specialization");

        const timeZone = "Asia/Kolkata";
        const startOfToday = moment().tz(timeZone).startOf('day').toDate();
        const endOfToday = moment().tz(timeZone).endOf('day').toDate();

        const todaysAppointment = await APPOINTMENT.findOne({
            userId: userId,
            status: 'scheduled',
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });

        const hasBookedSlotToday = !!todaysAppointment;

        const now = moment().tz("Asia/Kolkata").toDate();
        const slots = await TIMESLOT.find({lawyerId: lawyer._id, status: "available", startTime: {$gte: now}}).sort("startTime");
        res.json({success: true, data: lawyer, slots, hasBookedSlotToday});
    } catch (error) {
        next(error);
    }
}

export const getUserAppointments = async (req,res,next) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const userId = req.userId;
        const timeZone = 'Asia/Kolkata';
        const now = moment().tz(timeZone).toDate();

        const timeSlotsToEnd = await TIMESLOT.find({ endTime: { $lt: now } }).select("_id");
        const timeSlotIdsToEnd = timeSlotsToEnd.map(slot => slot._id);

        await APPOINTMENT.updateMany({userId, status: "scheduled", timeSlotId: {$in: timeSlotIdsToEnd}}, {$set: {status: "completed"}});

        const pipeline = new mongoose.Aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), status: {$in: ['scheduled', 'completed', 'cancelled']} }},
            { $lookup: { from: "timeslots", localField: "timeSlotId", foreignField: "_id", as: "timeSlot" } },
            { $unwind: "$timeSlot" },
            { $lookup: { from: "lawyers", localField: "lawyerId", foreignField: "_id", as: "lawyer" } },
            { $unwind: "$lawyer" },
            { $lookup: { from: "users", localField: "lawyer.userId", foreignField: "_id", as: "lawyer.user" } },
            { $unwind: "$lawyer.user" },
            { $lookup: { from: "payments", localField: "paymentId", foreignField: "_id", as: "payment" } },
            { $unwind: "$payment" },
            {
                $addFields: {
                    sortPriority: {
                        $cond: {
                            if: { $eq: ["$status", "scheduled"] },
                            then: 1,
                            else: 2
                        }
                    }
                }
            },
            { $sort: { sortPriority:1 ,"timeSlot.startTime": -1, updatedAt: -1 }},
            {
                $project: {
                    _id: 1,
                    status: 1,
                    lawyerName: "$lawyer.user.name",
                    lawyerId: "$lawyer.user._id",
                    specialization: "$lawyer.specialization",
                    date: "$timeSlot.startTime",
                    fees: "$payment.amount"
                }
            }
        ]);

        const result = await APPOINTMENT.aggregatePaginate(pipeline, { page: parseInt(page, 10), limit: parseInt(limit, 10) });
        res.status(200).json({ success: true, data: result.docs, pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalResults: result.totalDocs,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage
        }});
    } catch (error) {
        next(error);
    }
}

export const getAppointmentDetails = async (req,res,next) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.userId;

        if (!mongoose.isValidObjectId(appointmentId)){
            throw createError("Invalid Appointment ID", 400);
        }

        const appointment = await APPOINTMENT.findOne({_id: appointmentId, userId})
        .populate([{path: "lawyerId", select: "specialization rating reviewsCount -_id", populate: {path: "userId", select: "name profileImage -_id"}},
             {path: "paymentId", select: "amount transactionId -_id"},
            {path: "timeSlotId", select: "startTime endTime -_id"}]).select("-__v -userId");

        if (!appointment){
            throw createError("Appointment Not Found", 404);
        }

        res.status(200).json({success: true, data: appointment});
    } catch (error) {
        next(error);
    }
}

export const generateInvoice = async (req,res,next) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.userId;

        if (!mongoose.isValidObjectId(appointmentId)){
            throw createError("Invalid Appointment ID", 400);
        }

        const appointment = await APPOINTMENT.findOne({_id: appointmentId, userId}).populate([
            { path: 'userId', select: 'name email' },
            { path: 'paymentId', select: 'amount transactionId' },
            { path: 'timeSlotId', select: 'startTime' },
            { path: 'lawyerId', select: 'specialization', populate: { path: 'userId', select: 'name' } }
        ]);

        if (!appointment) {
            throw createError("Appointment Not Found", 404);
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${appointment._id}.pdf`);

        generateInvoicePDF(res, appointment);
    } catch (error) {
        next(error);
    }
}

export const addReviw = async (req,res,next) => {
    try {
        const { rating, comment, appointmentId } = req.body;
        const userId = req.userId;

        const appointment = await APPOINTMENT.findById(appointmentId).select('lawyerId');
        const review = await REVIEW.findOne({appointmentId});

        if (review){
            throw createError("You have already submitted a review for this appointment", 400);
        }

        const lawyerId = appointment.lawyerId;
        const lawyer = await LAWYER.findById(lawyerId).select('+totalRatingSum');
        const newAverageRating = (lawyer.totalRatingSum + rating) / (lawyer.reviewsCount + 1);

        await REVIEW.create({userId, lawyerId, appointmentId, rating, comment});

        await LAWYER.findByIdAndUpdate(lawyerId,{
            $inc: {
                reviewsCount: 1,
                totalRatingSum: rating
            },
            rating: newAverageRating
        });

        res.status(201).json({ success: true, message: "Review added successfully" });
    } catch (error) {
        next(error);
    }
}

export const getReviewsList = async (req,res,next) => {
    try {
        const { lawyerId } = req.params;
        const { page = 1, limit = 5 } = req.query;

        if (!mongoose.isValidObjectId(lawyerId)){
            throw createError("Invalid Lawyer ID", 400);
        }

        const lawyer = await LAWYER.findOne({userId: lawyerId}).populate({path: "userId", select: "name"}).select("userId specialization rating reviewsCount");

        if (!lawyer){
            throw createError("Lawyer Not Found", 404);
        }

        const reviews = await REVIEW.paginate({ lawyerId: lawyer._id }, {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { rating: -1, createdAt: -1 }, 
            populate: {
                path: 'userId',
                select: 'name profileImage'
            },
            select: "userId rating comment createdAt"
        });

        res.status(200).json({ success: true, lawyer, reviews: reviews.docs, pagination: {
            currentPage: reviews.page,
            totalPages: reviews.totalPages,
            totalResults: reviews.totalDocs,
            hasNextPage: reviews.hasNextPage,
            hasPrevPage: reviews.hasPrevPage,
            nextPage: reviews.nextPage,
            prevPage: reviews.prevPage
        }});
    } catch (error) {
        next(error);
    }
}

export const getReviewDetails = async (req,res,next) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.userId;

        if (!mongoose.isValidObjectId(appointmentId)){
            throw createError("Invalid Appointment ID", 400);
        }

        const review = await REVIEW.findOne({appointmentId, userId}).select("rating comment");

        if (!review){
            throw createError("Review Not Found", 404);
        }

        res.status(200).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
}

export const updateReview = async (req,res,next) => {
    try {
        const { rating, comment, reviewId } = req.body;

        const review = await REVIEW.findById(reviewId);

        const lawyerId = review.lawyerId;
        const oldRating = review.rating;
        
        review.rating = rating;
        review.comment = comment;
        await review.save();

        const lawyer = await LAWYER.findById(lawyerId).select('+totalRatingSum');
        const newTotalRatingSum = lawyer.totalRatingSum - oldRating + rating;
        const newAverageRating = newTotalRatingSum / lawyer.reviewsCount;

        await LAWYER.findByIdAndUpdate(lawyerId,{
            totalRatingSum: newTotalRatingSum,
            rating: newAverageRating
        });

        res.status(201).json({ success: true, message: "Review updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const getPaymentHistory = async (req,res,next) => {
    try {
        const userId = req.userId;
        const { page = 1, limit = 15 } = req.query;

        const payments = await PAYMENT.paginate({ userId , status: "success"}, { page: parseInt(page,10), limit: parseInt(limit, 10), 
            sort: { createdAt: -1},
            populate: {
                path: "lawyerId",
                select: "specialization userId -_id",
                populate: {
                    path: "userId",
                    select: "name profileImage -_id"
                }
            },
            select: "lawyerId createdAt type amount status -_id"
        });

        payments.docs = payments.docs.map(p => ({
            ...p.toObject(),
            amount: -p.amount
        }));

        res.status(200).json({ success: true, payments: payments.docs, pagination: {
            currentPage: payments.page,
            totalPages: payments.totalPages,
            totalResults: payments.totalDocs,
            hasNextPage: payments.hasNextPage,
            hasPrevPage: payments.hasPrevPage,
            nextPage: payments.nextPage,
            prevPage: payments.prevPage
        }});
    } catch (error) {
        next(error);
    }
}