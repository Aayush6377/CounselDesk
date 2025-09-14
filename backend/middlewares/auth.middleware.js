import { body } from "express-validator";
import USER from "../models/users.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcryptjs";

export const signUpValidator = [
    body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({min: 5}).withMessage("Name must be 5 characters long"),

    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is not in proper format")
    .matches(/^[\w\.-]+@[\w\.-]+\.\w+$/).withMessage("Email is not in proper format")
    .custom(async (value) => {
        const user = await USER.findOne({email: value});

        if (user){
            return Promise.reject("User already exists, please login");
        }
        return true;
    }),

    body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["user","lawyer"]).withMessage("Role must be user or lawyer"),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isStrongPassword().withMessage("Password must contains an uppercase, lowercase, digit and a special character"),

    body("confirmPassword")
    .notEmpty().withMessage("Confirm Password is required")
    .custom((value, {req}) => {
        if (value !== req.body.password){
            throw createError("Password and confirm password doesn't match",400);
        }
        return true;
    })
];

export const loginValidator = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is not in proper format")
    .matches(/^[\w\.-]+@[\w\.-]+\.\w+$/).withMessage("Email is not in proper format")
    .custom(async (value, {req}) => {
        const user = await USER.findOne({email: value}).select("+password");
        if (!user){
            return Promise.reject("Email not found, please signup");
        }
        req.user = user;
        return true;
    }),

    body("password")
    .notEmpty().withMessage("Password is required")
    .custom(async (value, {req}) => {
        const user = req.user;

        if (!user){
            return Promise.reject("Email not found, please signup");
        }

        if (!user.password){
            return Promise.reject("Password is not setup for this email, please login using google");
        }
        
        const match = await bcrypt.compare(value,user.password);

        if (!match){
            return Promise.reject("Incorrect Password, please try again");
        }
        return true;
    })
];

export const resetPasswordValidator = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is not in proper format")
    .matches(/^[\w\.-]+@[\w\.-]+\.\w+$/).withMessage("Email is not in proper format")
    .custom(async (value, {req}) => {
        const user = await USER.findOne({email: value});
        if (!user){
            return Promise.reject("Email not found, please signup");
        }
        return true;
    }),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isStrongPassword().withMessage("Password must contains an uppercase, lowercase, digit and a special character"),

    body("confirmPassword")
    .notEmpty().withMessage("Confirm Password is required")
    .custom((value, {req}) => {
        if (value !== req.body.password){
            throw createError("Password and confirm password doesn't match",400);
        }
        return true;
    })
];

export const otpValidator = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is not in proper format")
    .matches(/^[\w\.-]+@[\w\.-]+\.\w+$/).withMessage("Email is not in proper format")
];

export const otpVerifyValidator = [
    body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({min: 6, max: 6}).withMessage("OTP must be 6 digit long")
];