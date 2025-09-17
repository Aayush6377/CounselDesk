import { body } from "express-validator";
import LAWYER from "../models/lawyers.model.js";
import createError from "../utils/createError.js";

export const profileSetupValidator = [
    body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required.")
    .isLength({ min: 3, max: 100 }).withMessage("Full name must be between 3 and 100 characters."),

    body("specialization")
    .notEmpty().withMessage("Specialization is required.")
    .isIn(["Family Law", "Corporate Law", "Criminal Law", "Tax Law", "Cyber Law", "Real Estate Law", "Environmental Law", "Labour Law", "Civil Law"]).withMessage("Invalid specialization."),

    body("bio")
    .trim()
    .notEmpty().withMessage("Biography is required.")
    .isLength({ min: 20, max: 500 }).withMessage("Biography must be between 20 and 500 characters."),

    body("qualifications")
    .trim()
    .notEmpty().withMessage("Qualifications are required.")
    .isLength({ min: 10 }).withMessage("Qualifications should be at least 10 characters long."),

    body("phone")
    .notEmpty().withMessage("Phone number is required.")
    .isMobilePhone("en-IN").withMessage("Invalid Indian phone number format."),

    body("city")
    .trim()
    .notEmpty().withMessage("City is required."),

    body("state")
    .trim()
    .notEmpty().withMessage("State is required."),

    body("pincode")
    .notEmpty().withMessage("Pincode is required.")
    .isNumeric().withMessage("Pincode must contain only numbers.")
    .isLength({ min: 6, max: 6 }).withMessage("Pincode must be 6 digits long."),

    body("accountHolderName")
    .trim()
    .notEmpty().withMessage("Account holder name is required."),

    body("bankName")
    .trim()
    .notEmpty().withMessage("Bank name is required."),
    
    body("accountNumber")
    .notEmpty().withMessage("Account number is required.")
    .isNumeric().withMessage("Account number must contain only numbers."),
    
    body("ifscCode")
    .trim()
    .notEmpty().withMessage("IFSC Code is required.")
    .isAlphanumeric().withMessage("IFSC Code can only contain letters and numbers.")
    .isLength({ min: 11, max: 11 }).withMessage("IFSC Code must be 11 characters long."),

    body("fees")
    .notEmpty().withMessage("Fees are required.")
    .isFloat({ min: 0 }).withMessage("Fees must be a positive number.")
];

export const profileUpdateValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Full name is required.")
    .isLength({ min: 3, max: 100 }).withMessage("Full name must be between 3 and 100 characters."),

    body("specialization")
    .notEmpty().withMessage("Specialization is required.")
    .isIn(["Family Law", "Corporate Law", "Criminal Law", "Tax Law", "Cyber Law", "Real Estate Law", "Environmental Law", "Labour Law", "Civil Law"]).withMessage("Invalid specialization."),

    body("bio")
    .trim()
    .notEmpty().withMessage("Biography is required.")
    .isLength({ min: 20, max: 500 }).withMessage("Biography must be between 20 and 500 characters."),

    body("qualifications")
    .trim()
    .notEmpty().withMessage("Qualifications are required.")
    .isLength({ min: 10 }).withMessage("Qualifications should be at least 10 characters long."),

    body("phone")
    .notEmpty().withMessage("Phone number is required.")
    .isMobilePhone("en-IN").withMessage("Invalid Indian phone number format."),

    body("address[city]")
    .trim()
    .notEmpty().withMessage("City is required."),

    body("address[state]")
    .trim()
    .notEmpty().withMessage("State is required."),

    body("address[pincode]")
    .notEmpty().withMessage("Pincode is required.")
    .isNumeric().withMessage("Pincode must contain only numbers.")
    .isLength({ min: 6, max: 6 }).withMessage("Pincode must be 6 digits long."),

    body("bankDetails[accountHolderName]")
    .trim()
    .notEmpty().withMessage("Account holder name is required."),

    body("bankDetails[bankName]")
    .trim()
    .notEmpty().withMessage("Bank name is required."),
    
    body("bankDetails[accountNumber]")
    .notEmpty().withMessage("Account number is required.")
    .isNumeric().withMessage("Account number must contain only numbers."),
    
    body("bankDetails[ifscCode]")
    .trim()
    .notEmpty().withMessage("IFSC Code is required.")
    .isAlphanumeric().withMessage("IFSC Code can only contain letters and numbers.")
    .isLength({ min: 11, max: 11 }).withMessage("IFSC Code must be 11 characters long."),

    body("fees")
    .notEmpty().withMessage("Fees are required.")
    .isFloat({ min: 0 }).withMessage("Fees must be a positive number.")
];

export const isLawyer = async (req,res,next) => {
    try {
        const userId = req.userId;
        const lawyer = await LAWYER.findOne({userId});

        if (!lawyer){
            throw createError("User is not a lawyer",400);
        }

        req.lawyer = lawyer;
        next();
    } catch (error) {
        next(error);
    }
}