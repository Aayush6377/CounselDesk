import Stripe from "stripe";
import createError from "../utils/createError.js";
import mongoose from "mongoose";
import LAWYER from "../models/lawyers.model.js";
import TIMESLOT from "../models/timeSlot.model.js";
import PAYMENT from "../models/payments.model.js";
import PLAN from "../models/plan.model.js";
import APPOINTMENT from "../models/appointments.model.js";
import { frontend } from "../server.js";
import moment from "moment-timezone";
import { sendEmail } from "../utils/sendEmail.js";
import { appointmentConfirmationMailContent } from "../assets/mails.js";
import { logoUrl } from "../utils/links.js";


export const createCheckoutSession = async(req,res,next) => {
    let dbSession;
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const { lawyerId, timeSlotId } = req.body;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(lawyerId) || !mongoose.Types.ObjectId.isValid(timeSlotId)) {
            return next(createError("Invalid IDs provided.", 400));
        }

        const [ lawyer, timeSlot ] = await Promise.all([
            LAWYER.findOne({userId: lawyerId}).populate("userId","name").select("+stripeAccountId"),
            TIMESLOT.findById(timeSlotId)
        ]);

        if (!lawyer || !timeSlot || timeSlot.status !== 'available') {
            return next(createError("Lawyer or slot not available.", 404));
        }

        if (!lawyer.stripeAccountId) {
            return next(createError("This lawyer cannot receive payments at this time.", 400));
        }

        const existingAppointment = await APPOINTMENT.findOne({
            userId: req.userId,
            status: 'scheduled',
        }).populate('timeSlotId');

        if (existingAppointment && moment(existingAppointment.timeSlotId.startTime).isSame(timeSlot.startTime)) {
            return next(createError("You already have another appointment scheduled at this exact time.", 409));
        }

        if (timeSlot.lawyerId.toString() !== lawyer._id.toString()) {
            return next(createError("This time slot does not belong to the specified lawyer.", 400));
        }

        dbSession = await mongoose.startSession();
        let appointmentId, paymentId;
        try {
            dbSession.startTransaction();

            const newPayment = new PAYMENT({
                userId,
                lawyerId: lawyer._id,
                amount: lawyer.fees,
                status: "pending",
                transactionId: `pending_${new mongoose.Types.ObjectId()}`
            });
            await newPayment.save({session: dbSession});
            paymentId = newPayment._id.toString();

            const newAppointment = new APPOINTMENT({
                userId,
                lawyerId: lawyer._id,
                timeSlotId,
                paymentId: newPayment._id,
                status: 'pending'
            });
            await newAppointment.save({session: dbSession});
            appointmentId = newAppointment._id.toString();

            newPayment.appointmentId = newAppointment._id;
            await newPayment.save({ session: dbSession });

            await dbSession.commitTransaction();

        } catch (dbError) {
            await dbSession.abortTransaction();
            console.error("Transaction failed:", dbError);
            throw dbError; 
        } finally{
            dbSession.endSession();
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${frontend}/user/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontend}/user/book-appointment/${lawyerId}`,
            line_items: [{
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: `Consultation with ${lawyer.userId.name}`,
                        description: `Appointment on ${moment(timeSlot.startTime).tz('Asia/Kolkata').format('MMMM Do, YYYY')} at ${moment(timeSlot.startTime).tz('Asia/Kolkata').format('hh:mm A')}`,
                        images: [logoUrl]
                    },
                    unit_amount: lawyer.fees * 100
                },
                quantity: 1
            }],
            metadata: { appointmentId, paymentId, timeSlotId: timeSlotId.toString(), lawyerId: lawyer._id.toString()}
        });

        res.status(200).json({success: true, url: session.url});
    } catch (error) {
        if (dbSession?.inTransaction()) {
            await dbSession.abortTransaction();
        }
        if (dbSession) {
            dbSession.endSession();
        }
        next(error);
    }
}

export const confirmBooking = async (req,res,next) => {
    try {
        const { session_id } = req.body;
        const email = req.email;

        if (!session_id) {
            return next(createError("Session ID is required.", 400));
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid"){
            return next(createError("Payment not successful.", 402));
        }

        const { appointmentId, paymentId, timeSlotId, lawyerId } = session.metadata;

        const paymentRecord = await PAYMENT.findById(paymentId);

        if (paymentRecord && paymentRecord.status === 'success') {
            return res.status(200).json({ success: true, message: "Webhook already processed." });
        }

        const totalAmount = session.amount_total / 100;
        const lawyerEarnings = totalAmount * 0.95;

        await Promise.all([
            LAWYER.findByIdAndUpdate(lawyerId, { $inc: { totalEarnings: lawyerEarnings } }),
            PAYMENT.findByIdAndUpdate(paymentId, { status: "success", transactionId: session.payment_intent }),
            TIMESLOT.findByIdAndUpdate(timeSlotId, { status: 'booked' })
        ]);
        
        const confirmedAppointment = await APPOINTMENT.findByIdAndUpdate(appointmentId, { status: 'scheduled' }, { new: true });

        if (!confirmedAppointment) {
            return next(createError("Could not find the appointment to confirm.", 404));
        }

        await confirmedAppointment.populate([
            { path: 'userId', select: 'name' },
            { path: 'lawyerId', populate: { path: 'userId', select: 'name' } },
            { path: 'timeSlotId', select: 'startTime' },
            { path: 'paymentId', select: 'amount' }
        ]);

        const content = appointmentConfirmationMailContent({
            userName: confirmedAppointment.userId.name,
            lawyerName: confirmedAppointment.lawyerId.userId.name,
            appointmentDate: moment(confirmedAppointment.timeSlotId.startTime).tz('Asia/Kolkata').format('dddd, MMMM Do YYYY'),
            appointmentTime: moment(confirmedAppointment.timeSlotId.startTime).tz('Asia/Kolkata').format('hh:mm A'),
            consultationFee: confirmedAppointment.paymentId.amount
        });
        await sendEmail({to: email, ...content});
        
        res.status(200).json({ success: true, message: "Appointment confirmed successfully!" });
    } catch (error) {
        next(error);
    }
}

export const cancelAppointment = async (req,res,next) => {
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
        const { appointmentId } = req.body;
        const { userId, role } = req;

        const appointment = await APPOINTMENT.findById(appointmentId)
            .populate('paymentId', 'amount').populate('timeSlotId', 'startTime').session(dbSession);

        if (!appointment) {
            throw createError("Appointment not found.", 404);
        }

        if (!(["user", "lawyer"].includes(role))) {
            throw createError("You are not authorized to cancel this appointment.", 403);
        }
        
        if (appointment.status !== 'scheduled') {
            throw createError(`Cannot cancel an appointment with status: ${appointment.status}.`, 400);
        }

        const now = moment().tz('Asia/Kolkata');
        const appointmentStartTime = moment(appointment.timeSlotId.startTime).tz('Asia/Kolkata');
        
        const hoursUntilAppointment = appointmentStartTime.diff(now, 'hours', true);

        if (hoursUntilAppointment <= 1) {
            throw createError("Appointments cannot be canceled less than 1 hour before the scheduled time.", 400);
        }
        
        const { lawyerId, timeSlotId, paymentId } = appointment;
        const refundAmount = paymentId.amount * 0.95;

        appointment.status = 'cancelled';
        

        await TIMESLOT.findByIdAndUpdate(timeSlotId, { status: 'available' }, { session: dbSession });

        await LAWYER.findByIdAndUpdate(lawyerId, {
            $inc: { totalEarnings: -refundAmount }
        }, { session: dbSession });

        const refundPayment = new PAYMENT({
            userId,
            lawyerId,
            appointmentId,
            amount: -paymentId.amount, 
            type: 'refund',
            status: 'success',
            transactionId: `re_${paymentId._id}_${Date.now()}`
        });
        await refundPayment.save({ session: dbSession });

        appointment.paymentId = refundPayment._id;
        await appointment.save({ session: dbSession });
        
        await dbSession.commitTransaction();

        res.status(200).json({ success: true, message: "Appointment successfully cancelled." });
    } catch (error) {
        await dbSession.abortTransaction();
        next(error);
    } finally{
        dbSession.endSession();
    }
}

export const createSubscriptionCheckoutSession = async (req,res,next) => {
    let dbSession;
    try {
        const { planId } = req.body;
        const lawyerId = req.lawyerId;

        if (!planId) {
            return next(createError("Plan ID is required.", 400));
        }

        const [ plan, lawyer ] = await Promise.all([
            PLAN.findOne({ planId }),
            LAWYER.findById(lawyerId).populate({path: "userId", select: "email name"})
        ]);

        if (!plan || !lawyer) {
            return next(createError("Plan or lawyer not found.", 404));
        }
        if (plan.planId === 'free' || lawyer.subscription.status === 'active') {
            return next(createError("Cannot purchase the plan.", 400));
        }

        dbSession = await mongoose.startSession();
        let paymentId;
        try {
            dbSession.startTransaction();

            const newPayment = new PAYMENT({
                userId: lawyer.userId._id,
                lawyerId: lawyer._id,
                amount: plan.price,
                type: "subscription",
                status: "pending",
                transactionId: `pending_${new mongoose.Types.ObjectId()}`
            });

            await newPayment.save({session: dbSession});
            paymentId = newPayment._id.toString();

            await dbSession.commitTransaction();
        } catch (error) {
            await dbSession.abortTransaction();
            throw error;
        } finally{
            dbSession.endSession();
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        let stripeCustomerId = lawyer.stripeCustomerId;
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: lawyer.userId.email,
                name: lawyer.userId.name,
                metadata: { lawyerId: lawyer._id.toString() },
            });
            stripeCustomerId = customer.id;
            await LAWYER.findByIdAndUpdate(lawyerId, { stripeCustomerId });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
                price: plan.stripePriceId,
                quantity: 1,
            }],
            success_url: `${frontend}/user-lawyer/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontend}/user-lawyer/subscription`,
            metadata: {
                lawyerId: lawyerId.toString(),
                planId: plan.planId,
                paymentId: paymentId, 
            },
        });

        res.status(200).json({ success: true, url: session.url });

    } catch (dbError) {
         if (dbSession?.inTransaction()) {
            await dbSession.abortTransaction();
        }
        if (dbSession) {
            dbSession.endSession();
        }
        next(dbError);
    } finally{
        dbSession.endSession();
    }
}

export const confirmSubscriptionPurchase = async (req, res, next) => {
    let dbSession;
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return next(createError("Session ID is required.", 400));
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            return next(createError("Payment not successful.", 402));
        }

        if (!session.subscription) {
            return next(createError("Subscription ID not found in checkout session.", 500));
        }
        const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);

        const { planId, paymentId, lawyerId } = session.metadata;
        
        const paymentRecord = await PAYMENT.findById(paymentId);
        const plan = await PLAN.findOne({ planId });

        if (paymentRecord && paymentRecord.status === 'success') {
            return res.status(200).json({ success: true, message: "Purchase already confirmed." });
        }

        const timezone = 'Asia/Kolkata';
        const startDate = moment.tz(timezone).toDate(); 
        
        const endDate = moment.tz(startDate, timezone); 
        if (plan.period === 'month') {
            endDate.add(1, 'months');
        } else if (plan.period === 'year') {
            endDate.add(1, 'years');
        }

        endDate.hour(23).minute(55).second(0).millisecond(0);

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
            const updatedLawyer = await LAWYER.findByIdAndUpdate(lawyerId, {
                $set: {
                    "subscription.plan": planId,
                    "subscription.price": plan.price,
                    "subscription.status": "active",
                    "subscription.startDate": startDate, 
                    "subscription.endDate": endDate.toDate(),
                    "subscription.stripeSubscriptionId": stripeSubscription.id,
                }
            }, { new: true, session: dbSession });

            if (!updatedLawyer) {
                throw createError("Lawyer not found, cannot update subscription.", 404);
            }

            await PAYMENT.findByIdAndUpdate(paymentId, {
                status: "success",
                transactionId: session.payment_intent
            }, { session: dbSession });

            await dbSession.commitTransaction();

        } catch (transactionError) {
            await dbSession.abortTransaction();
            throw transactionError;
        } finally {
            dbSession.endSession();
        }

        res.status(200).json({ success: true, message: "Subscription confirmed successfully!" });

    } catch (error) {
        if (dbSession) {
            dbSession.endSession();
        }
        next(error);
    }
};

export const cancelSubscription = async (req,res,next) => {
    try {
        const lawyerId = req.lawyerId;
        const lawyer = await LAWYER.findById(lawyerId).select('subscription');

        if (!lawyer) {
            return next(createError("Lawyer not found.", 404));
        }

        const { status, stripeSubscriptionId } = lawyer.subscription;

        if (status !== 'active' || !stripeSubscriptionId) {
            return next(createError("No active subscription to cancel.", 400));
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        await stripe.subscriptions.update(stripeSubscriptionId, {
            cancel_at_period_end: true,
        });

        lawyer.subscription.status = 'canceled';
        await lawyer.save();

        res.status(200).json({
            success: true,
            message: "Your subscription is now scheduled to be cancelled at the end of your current billing period. You can continue to use premium features until then."
        });

    } catch (error) {
        next(error);
    }
}

export const getSubscriptionDetails = async (req,res,next) => {
    try {
        const lawyerId = req.lawyerId;

        const lawyer = await LAWYER.findById(lawyerId).select('subscription stripeCustomerId');

        if (!lawyer || lawyer.subscription.status === 'expired') {
            throw createError("No active subscription found.", 404);
        }

        const plan = await PLAN.findOne({ planId: lawyer.subscription.plan });
        if (!plan) {
            throw createError("Subscription plan details not found.", 404);
        }

        const subscriptionDetails = {
            planTitle: plan.title,
            status: lawyer.subscription.status,
            cost: lawyer.subscription.price, 
            period: plan.period,
            renewalDate: lawyer.subscription.endDate,
            features: plan.features
        };

        res.status(200).json({ success: true, data: subscriptionDetails });
    } catch (error) {
        next(error);
    }
}