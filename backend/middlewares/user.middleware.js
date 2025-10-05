import { body } from "express-validator";
import mongoose from "mongoose";
import LAWYER from "../models/lawyers.model.js";
import createError from "../utils/createError.js";
import APPOINTMENT from "../models/appointments.model.js";
import REVIEW from "../models/reviews.model.js";

export const profileUpdateValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Full name is required.")
    .isLength({ min: 3, max: 100 }).withMessage("Full name must be between 3 and 100 characters.")
];

export const reviewValidator = [
    body("rating").notEmpty().withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 }).withMessage("Rating must be a number between 1 and 5."),

    body("comment").trim().
    notEmpty().withMessage("Comment is required"),

    body("appointmentId").optional()
    .isMongoId().withMessage("Appointment ID is not Valid")
    .custom(async (value, { req }) => {
        const appointment = await APPOINTMENT.findById(value);
        if (!appointment){
            return Promise.reject("Appointment not Found");
        }

        if (appointment.userId.toString() !== req.userId.toString()) {
            return Promise.reject("You are not authorized to review this appointment.");
        }

        if (appointment.status !== 'completed') {
            return Promise.reject(`Cannot review an appointment with status: ${appointment.status}.`);
        }
        
        return true;
    }),

    body("reviewId").optional()
    .isMongoId().withMessage("Review ID is not Valid")
    .custom(async (value, {req}) => {
        const review = await REVIEW.findById(value);

        if (!review){
            return Promise.reject("Review not Found");
        }

        if (review.userId.toString() !== req.userId.toString()) {
            return Promise.reject("You are not authorized to update this review.");
        }

        return true;
    }),

    body()
    .custom((value, { req }) => {
        const { appointmentId, reviewId } = req.body;
        if (!appointmentId && !reviewId) {
            throw new Error('Either an appointmentId (for adding) or a reviewId (for updating) must be provided.');
        }
        if (appointmentId && reviewId) {
            throw new Error('Provide either an appointmentId or a reviewId, but not both.');
        }
        return true;
    })
];

export const isLawyer = async (req,res,next) => {
    try {
        const { lawyerId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
            throw createError("Invalid Lawyer ID format.", 400);
        }

        const res = await LAWYER.findOne({userId: lawyerId});
        if (!res){
            throw createError("Lawyer Not Found", 404);
        }

        next();
    } catch (error) {
        next(error);
    }
}