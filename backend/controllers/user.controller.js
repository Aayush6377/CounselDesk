import mongoose from "mongoose";
import USER from "../models/users.model.js";
import { deleteUploadedImage } from "../utils/deleteFile.js";
import { generateFileUrl } from "./lawyer.controller.js";
import LAWYER from "../models/lawyers.model.js";
import createError from "../utils/createError.js";
import TIMESLOT from "../models/timeSlot.model.js";
import moment from "moment-timezone";
import APPOINTMENT from "../models/appointments.model.js";

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
                            { $in: ['$lawyerDetails.subscription.plan', ['Monthly', 'Yearly']] },
                            { $eq: ['$lawyerDetails.subscription.status', 'active'] }
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

        res.json({success: true, data: lawyer, availability});
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
            { $sort: { sortPriority:1 ,"timeSlot.startTime": 1, updatedAt: -1 }},
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