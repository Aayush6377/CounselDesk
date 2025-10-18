import { body } from "express-validator";
import mongoose from "mongoose";
import createError from "../utils/createError.js";
import ANSWER from "../models/answers.model.js";


export const addQuestionValidator = [
    body("title").trim()
    .notEmpty().withMessage("Title must not be empty")
    .isLength({ min: 15 }).withMessage("Title must be at least 15 characters long"),

    body("description").trim()
    .notEmpty().withMessage("Description must not be empty")
    .isLength({ min: 30 }).withMessage("Description must at least 30 characters long"),

    body("category").trim()
    .notEmpty().withMessage("Category is required")
    .isIn(["Family Law", "Corporate Law", "Criminal Law", "Tax Law", "Cyber Law", "Real Estate Law", "Environmental Law", "Labour Law", "Civil Law", "Other"]).withMessage("Invalid category."),

    body("isAnonymous").optional()
    .isBoolean().withMessage("isAnonymous must be a boolean value")
];

export const isValidAnswerId = async (req,res,next) => {
    try {
        const { answerId } = req.body;

        if (!mongoose.isValidObjectId(answerId)){
            throw createError("Invalid Answer ID", 400);
        }

        const answer = await ANSWER.findById(answerId);

        if (!answer){
            throw createError("Answer Not Found", 404);
        }

        next();
    } catch (error) {
        next(error);
    }
}