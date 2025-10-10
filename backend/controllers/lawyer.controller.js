import LAWYER from "../models/lawyers.model.js";
import SCHEDULE from "../models/schedule.model.js";
import USER from "../models/users.model.js";
import TIMESLOT from "../models/timeSlot.model.js";
import APPOINTMENT from "../models/appointments.model.js";
import createError from "../utils/createError.js";
import generateSlotsForNextDays from "../utils/slotGenerator.js";
import deleteUploadedFiles, { deleteUploadedImage } from "../utils/deleteFile.js";
import path from "path";
import moment from "moment-timezone";
import Stripe from "stripe";
import mongoose from "mongoose";
import REVIEW from "../models/reviews.model.js";
import PAYMENT from "../models/payments.model.js";


export const generateFileUrl = (req, file) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const relativePath = file.path.substring(file.path.indexOf(path.sep + 'uploads'));
    return `${baseUrl}${relativePath.replace(/\\/g, '/')}`;
}

const getMonthlyStats = async(lawyerId) => {
    const startOfMonth = moment.tz('Asia/Kolkata').startOf('month').toDate();
    const endOfMonth = moment.tz('Asia/Kolkata').endOf('month').toDate();

    const [monthlyEarningsResult, monthlyBookings] = await Promise.all([
        PAYMENT.aggregate([
            {
                $match: {
                    lawyerId: lawyerId,
                    status: 'success',
                    type: {$in: ['consultancy', 'refund'] },
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        APPOINTMENT.countDocuments({ lawyerId, status: { $in: ['scheduled', 'completed'] }, createdAt: { $gte: startOfMonth, $lte: endOfMonth } })
    ]);

    const earnings = (monthlyEarningsResult[0]?.total || 0) * 0.95;
    return { earnings, bookings: monthlyBookings };
}

export const getDashboardData = async (req,res,next) => {
    try {
        const lawyerId = req.lawyerId;
        const now = new Date();

        const [ lawyer, totalBookings, monthlyData, upcomingAppointments, recentReviews ] = await Promise.all([
            LAWYER.findById(lawyerId).select("totalEarnings rating reviewsCount subscription.plan"),
            APPOINTMENT.countDocuments({ lawyerId, status: { $in: ['scheduled', 'completed'] } }),
            getMonthlyStats(lawyerId),
            APPOINTMENT.find({ lawyerId: lawyerId, status: 'scheduled' }).populate({ path: 'timeSlotId', match: { startTime: { $gt: now } } })
            .populate({ path: 'userId', select: 'name profileImage' }).sort({ 'timeSlotId.startTime': 1 }).limit(2),
            REVIEW.find({ lawyerId: lawyerId }).sort({ createdAt: -1 }).limit(3).populate({ path: 'userId', select: 'name profileImage' })
        ]);

        const responseData = {
            stats: { totalBookings, totalEarnings: lawyer.totalEarnings, rating: lawyer.rating, reviewsCount: lawyer.reviewsCount, subscriptionPlan: lawyer.subscription.plan, thisMonthEarnings: monthlyData.earnings, thisMonthBookings: monthlyData.bookings },
            upcomingAppointments: upcomingAppointments.filter(apt => apt.timeSlotId).map(apt => ({
                _id: apt._id,
                name: apt.userId.name,
                date: apt.timeSlotId.startTime,
                image: apt.userId.profileImage,
            })),
            recentReviews: recentReviews.map(review => ({
                _id: review._id,
                name: review.userId.name,
                name: review.userId.name,
                message: review.comment,
                time: review.createdAt,
                image: review.userId.profileImage,
            })),
        };

        res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        next(error);
    }
}

export const profileSetup = async (req,res,next) => {
    try {
        const userId = req.userId;
        const {fullName, specialization, bio, qualifications, 
            phone, city, state, pincode, accountHolderName, 
            bankName, accountNumber, ifscCode, fees} = req.body;

        const user = await USER.findById(userId);

        if (user.role !== "lawyer"){
            deleteUploadedFiles(req.files);
            throw createError("User is not a lawyer", 400);
        }

        const check = await LAWYER.findOne({userId});
        if (check) {
            deleteUploadedFiles(req.files);
            throw createError("Lawyer already registered", 400);
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        let stripeAccountId;
        try {
            const account = await stripe.accounts.create({
                type: "express",
                country: "US",
                email: user.email,
                business_type: "individual",
                capabilities: {
                    card_payments: { requested: true },
                    transfers: {requested: true}
                },
                external_account: 'btok_us_verified',
            });
            stripeAccountId = account.id;
        } catch (error) {
            console.error(error);
            throw createError("Unable to create stripe account",500);
        }

        const files = req.files;

        const profileImage = files.profileImage ? generateFileUrl(req, files.profileImage[0]) : null;
        const barCouncilCertificate = files.barCouncilCertificate ? generateFileUrl(req, files.barCouncilCertificate[0]) : null;
        const practiceCertificate = files.practiceCertificate ? generateFileUrl(req, files.practiceCertificate[0]) : null;
        const governmentId = files.governmentId ? generateFileUrl(req, files.governmentId[0]) : null;
        const lawDegree = files.lawDegree ? generateFileUrl(req, files.lawDegree[0]) : null;

        const address = {city, state, pincode};
        const bankDetails = {accountHolderName, bankName, accountNumber, ifscCode};
        
        const documents = { barCouncilCertificate, practiceCertificate, governmentId, lawDegree };

        user.name = fullName;
        user.bioDataProvided = true;
        if (profileImage) user.profileImage = profileImage;
        await user.save();

        await LAWYER.create({
            userId, specialization, bio, qualifications, 
            phone, fees, address, bankDetails, documents, stripeAccountId
        });

        res.status(201).json({success: true, message: "Lawyer data has successfully been added."});
    } catch (error) {
        if (req.files) {
            deleteUploadedFiles(req.files);
        }
        next(error);
    }
}

export const profileUpdate = async (req,res,next) => {
    try {
        const userId = req.userId;
        const {name, specialization, bio, qualifications, 
            phone, address, bankDetails, fees} = req.body;

        const user = await USER.findById(userId);

        if (req.file && user.profileImage) {
            await deleteUploadedImage(user.profileImage);
        }

        user.name = name;
        if (req.file) {
            user.profileImage = generateFileUrl(req, req.file);
        }
        await user.save();

        const lawyerUpdateData = { specialization, bio, qualifications, phone, address, bankDetails, fees };

        const updatedLawyer = await LAWYER.findOneAndUpdate(
            { userId: userId },      
            { $set: lawyerUpdateData },
            { new: true, runValidators: true }
        );

        if (!updatedLawyer) {
            throw createError("Lawyer profile not found.", 404);
        }

        res.status(200).json({success: true, message: "Profile updated successfully."});
        
    } catch (error) {
        next(error);
    }
}

export const profileDetails = async (req,res,next) => {
    try {
        const userId = req.userId;
        const user = await LAWYER.findOne({userId}).select("+bankDetails.accountHolderName +bankDetails.bankName +bankDetails.accountNumber +bankDetails.ifscCode").select("-documents -_id -userId");

        if (!user){
            throw createError("Lawyer is not registered",400);
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const scheduleUpdate = async (req,res,next) => {
    try {
        const lawyerId = req.lawyerId;
        const { startTime, endTime, breakStartTime, breakEndTime, slotDuration, selectedDays: recurringDays } = req.body;

        const updatedData = {lawyerId, startTime, endTime, breakStartTime, breakEndTime, slotDuration, recurringDays, availableToday: true};

        const updatedSchedule = await SCHEDULE.findOneAndUpdate({lawyerId}, updatedData, {new: true, upsert: true, validationResult: true});

        await TIMESLOT.deleteMany({lawyerId, status: {$ne: "booked"}});

        await generateSlotsForNextDays(lawyerId,updatedSchedule);

        res.status(200).json({success: true, message: "Schedule save", schedule: updatedSchedule});
    } catch (error) {
        next(error);
    }
}

export const scheduleDetails = async (req,res,next) => {
    try {
        const lawyerId = req.lawyerId;

        const schedule = await SCHEDULE.findOne({lawyerId}, {lawyerId: 0, _id: 0});

        if (!schedule){
            throw createError("Schedule is not set for the lawyer", 404);
        }

        const now = moment().tz("Asia/Kolkata").toDate();

        const slots = await TIMESLOT.find({lawyerId, startTime: {$gte: now}},{startTime: 1, endTime: 1, status: 1, _id: 0}).sort("startTime");
        res.status(200).json({success: true, message: "Schedule found", schedule, slots});
    } catch (error) {
        next(error);
    }
}

export const scheduleUnavailableToday = async (req, res, next) => {
    try {
        const lawyerId = req.lawyerId;
        const { isAvailableToday } = req.body;

        const newStatus = isAvailableToday ? "available" : "cancelled";
        const currentStatus = isAvailableToday ? "cancelled" : "available";

        const timeZone = 'Asia/Kolkata';
        const startOfToday = moment().tz(timeZone).startOf('day').toDate();
        const endOfToday = moment().tz(timeZone).endOf('day').toDate();

        const result = await TIMESLOT.updateMany(
            {
                lawyerId: lawyerId,
                status: currentStatus,
                startTime: {
                    $gte: startOfToday,
                    $lte: endOfToday 
                }
            }, 
            { $set: { status: newStatus } } 
        );

        await SCHEDULE.findOneAndUpdate({lawyerId},{availableToday: isAvailableToday});

        const message = isAvailableToday 
            ? `Made ${result.modifiedCount} slots available for today.`
            : `Cancelled ${result.modifiedCount} available slots for today.`;

        res.status(200).json({ success: true, message });

    } catch (error) {
        next(error);
    }
};

export const getLawyerAppointments = async (req,res,next) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const lawyerId = req.lawyerId;
        const now = moment().tz("Asia/Kolkata").toDate();

        const timeSlotsToEnd = await TIMESLOT.find({endTime: {$lt: now}}).select("_id");
        const timeSlotIdsToEnd = timeSlotsToEnd.map(slot => slot._id);

        await APPOINTMENT.updateMany({lawyerId, status: "scheduled", timeSlotId: {$in: timeSlotIdsToEnd}}, {$set: {status: "completed"}});

        const pipeleine = new mongoose.Aggregate([
            { $match: { lawyerId: new mongoose.Types.ObjectId(lawyerId), status: { $in: ['scheduled', 'completed', 'cancelled'] } } }, 
            { $lookup: { from: "timeslots", localField: "timeSlotId", foreignField: "_id", as: "timeSlot" } }, 
            { $unwind: "$timeSlot" },
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userId" } },
            { $unwind: "$userId" },
            { $addFields: {
                sortPriority: {
                    $cond: {
                        if: { $eq: ["$status", "scheduled"] },
                        then: 1,
                        else: 2
                    }
                }
            } },
            { $sort: { sortPriority:1 ,"timeSlot.startTime": -1, updatedAt: -1 } },
            { $project: {
                _id: 1,
                status: 1,
                clientName: "$userId.name",
                clientProfileImage: "$userId.profileImage",
                startTime: "$timeSlot.startTime",
                endTime: "$timeSlot.endTime"
            }}
        ]);

        const result = await APPOINTMENT.aggregatePaginate(pipeleine,{ page: parseInt(page,10), limit: parseInt(limit, 10) });
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
        const lawyerId = req.lawyerId;

        if (!mongoose.isValidObjectId(appointmentId)){
            throw createError("Invalid Appointment ID", 400);
        }

        const appointment = await APPOINTMENT.findOne({_id: appointmentId, lawyerId})
        .populate([{path: "userId", select: "name email profileImage -_id"},
             {path: "paymentId", select: "amount transactionId type -_id"},
            {path: "timeSlotId", select: "startTime endTime -_id"}]).select("-__v -lawyerId");

        if (!appointment){
            throw createError("Appointment Not Found", 404);
        }

        res.status(200).json({success: true, data: appointment});
    } catch (error) {
        next(error);
    }
}

export const getReviewStats = async(req,res,next) => {
    try {
        const lawyerId = req.lawyerId;

        const lawyer = await LAWYER.findById(lawyerId).select("rating reviewsCount");

        const reviews = await REVIEW.aggregate([
            { $match: { lawyerId: new mongoose.Types.ObjectId(lawyerId) }},
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $project: { stars: "$_id", count: 1 , _id: 0} }
        ]);

        const reviewMap = new Map();
        for(let i = 5; i>=1; i--) reviewMap.set(i, 0);
        reviews.forEach(review => reviewMap.set(review.stars, review.count));
        const fullReviewStat = Array.from(reviewMap, ([stars, count]) => ({ stars, count }));

        res.status(200).json({success: true, data: {rating: lawyer.rating, reviewsCount: lawyer.reviewsCount, reviews:  fullReviewStat}});
    } catch (error) {
        next(error);
    }
}

export const getReviewsList = async (req, res, next) => {
    try {
        const lawyerId = req.lawyerId;
        const { page = 1, limit = 5, sortBy = 'newest' } = req.query;

        let sortOption = { createdAt: -1 }; 
        switch (sortBy) {
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'highest':
                sortOption = { rating: -1, createdAt: -1 };
                break;
            case 'lowest':
                sortOption = { rating: 1, createdAt: -1 };
                break;
        }
        
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sortOption,
            populate: {
                path: 'userId',
                select: 'name profileImage -_id'
            },
            select: 'rating comment createdAt userId' 
        };

        const paginatedReviews = await REVIEW.paginate({ lawyerId }, options);
        
        res.status(200).json({ success: true, reviews: paginatedReviews.docs, pagination: {
            currentPage: paginatedReviews.page,
            totalPages: paginatedReviews.totalPages,
            totalResults: paginatedReviews.totalDocs,
            hasNextPage: paginatedReviews.hasNextPage,
            nextPage: paginatedReviews.nextPage }
        });
    } catch (error) {
        next(error);
    }
};

export const getEarningsData = async (req,res,next) => {
    try {
        const lawyerId = req.lawyerId;
        const { page = 1, limit = 10 } = req.query;

        const lawyer = await LAWYER.findById(lawyerId).select('totalEarnings');
        if (!lawyer) {
            return next(createError("Lawyer not found.", 404));
        }

        const startOfMonth = moment.tz('Asia/Kolkata').startOf('month').toDate();
        const endOfMonth = moment.tz('Asia/Kolkata').endOf('month').toDate();

        const monthlyEarningsResult = await PAYMENT.aggregate([
            {
                $match: {
                    lawyerId: lawyerId,
                    status: 'success',
                    type: {$in: ['consultancy', 'refund'] },
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const thisMonthEarnings = (monthlyEarningsResult[0]?.total || 0) * 0.95;

        const transactions = await PAYMENT.paginate({ lawyerId: lawyer._id, status: "success" }, {page: parseInt(page, 10), limit: parseInt(limit, 10),
            sort: {createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'name'
            },
            select: 'createdAt type amount status userId'
        });

        const responseData = {
            summary: {
                thisMonth: {
                    amount: thisMonthEarnings,
                    description: `Earnings for ${moment().format('MMMM')}`
                },
                lifetime: {
                    amount: lawyer.totalEarnings,
                    description: 'All-time earnings received'
                }
            },
            transactions: {
                docs: transactions.docs.map(tx => ({
                    id: tx._id,
                    date: tx.createdAt,
                    type: tx.type,
                    client: tx.type === 'subscription' ? '-' : tx.userId.name ,
                    amount: tx.type === 'subscription' ? -tx.amount : tx.amount * 0.95,
                    status: tx.status,
                })),
                pagination: {
                    currentPage: transactions.page,
                    totalPages: transactions.totalPages,
                    totalResults: transactions.totalDocs,
                    hasNextPage: transactions.hasNextPage,
                    hasPrevPage: transactions.hasPrevPage,
                    nextPage: transactions.nextPage,
                    prevPage: transactions.prevPage
                }
            }
        };

        res.status(200).json({ success: true, ...responseData });
    } catch (error) {
        next(error);
    }
}