import mongoose from "mongoose";
import USER from "../models/users.model.js";
import createError from "../utils/createError.js";
import { body } from "express-validator";

export const createAdminValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Full name is required.")
    .isLength({ min: 3, max: 100 }).withMessage("Full name must be between 3 and 100 characters."),

    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is not in proper format")
    .matches(/^[\w\.-]+@[\w\.-]+\.\w+$/).withMessage("Email is not in proper format")
    .custom(async (value) => {
        const user = await USER.findOne({email: value});

        if (user){
            return Promise.reject("User already exists, please add another user");
        }
        return true;
    })
];

export const isAdmin = async(req,res,next) => {
    try {
        const userId = req.userId;
        const user = await USER.findById(userId);

        if (!user){
            throw createError("User Not Found", 404);
        }

        if (user.role !== 'admin'){
            throw createError("User Not authorized", 403);
        }

        next();
    } catch (error) {
        next(error);
    }
}

export const deleteMiddleware = async (req,res,next) => {
    try {
        const { userId } = req.params;

        if (!mongoose.isValidObjectId(userId)){
            throw createError("Invalid User ID", 400);
        }

        const userToDelete = await USER.findById(userId);

        if (!userToDelete || userToDelete.status === 'deleted') {
            throw createError("User not found.", 404);
        }

        if (userToDelete.role === "admin"){
            throw createError("This account can't be deleted", 400);
        }

        req.userToDelete = userId;
        req.logout = false;
        next();
    } catch (error) {
        next(error);
    }
}