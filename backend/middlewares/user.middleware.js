import { body } from "express-validator";
import mongoose from "mongoose";
import LAWYER from "../models/lawyers.model.js";
import createError from "../utils/createError.js";

export const profileUpdateValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Full name is required.")
    .isLength({ min: 3, max: 100 }).withMessage("Full name must be between 3 and 100 characters.")
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