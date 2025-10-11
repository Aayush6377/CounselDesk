import mongoose from "mongoose";
import LAWYER from "../models/lawyers.model.js";
import createError from "../utils/createError.js";
import { body } from "express-validator";

export const isLawyerFree = async (req,res,next) => {
    try {
        const { lawyerId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
            throw createError("Invalid Lawyer ID format.", 400);
        }

        const res = await LAWYER.findOne({userId: lawyerId},{subscription: 1});
        if (!res){
            throw createError("Lawyer Not Found", 404);
        }
        if (res.subscription.plan !== "free"){
            throw createError("Lawyer is premium, pls login to view profile",400);
        }

        next();
    } catch (error) {
        next(error);
    }
}

export const contactSubmissionValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Full name is required.")
    .isLength({ min: 3, max: 100 }).withMessage("Full name must be between 3 and 100 characters."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Invalid email format."),

  body("phone")
    .optional()
    .isMobilePhone("en-IN").withMessage("Invalid Indian phone number format."),

  body("message")
    .trim()
    .notEmpty().withMessage("Message is required.")
    .isLength({ min: 5 }).withMessage("Message must be at least 5 characters long.")
];