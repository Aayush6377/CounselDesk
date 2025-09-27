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

export const scheduleUpdateValidator = [
    body("startTime")
    .trim()
    .notEmpty().withMessage("Start time is required.")
    .isTime({ hourFormat: 'hour24' }).withMessage("Start time must be a valid 24-hour format (e.g., 09:00)."),

    body("endTime")
    .trim()
    .notEmpty().withMessage("End time is required.")
    .isTime({ hourFormat: 'hour24' }).withMessage("End time must be a valid 24-hour format (e.g., 17:00).")
    .custom((endTime, { req }) => {
        const { startTime } = req.body;
        if (startTime && endTime <= startTime) {
            throw createError("End time must be after the start time", 400);
        }
        return true;
    }),

    body("breakStartTime")
    .trim()
    .notEmpty().withMessage("Break start time is required.")
    .isTime({ hourFormat: 'hour24' }).withMessage("Break start time must be a valid 24-hour format.")
    .custom((breakStartTime, { req }) => {
        const { startTime, endTime } = req.body;
        if (startTime && breakStartTime < startTime) {
            throw new Error("Break cannot start before the work day starts.");
        }
        if (endTime && breakStartTime >= endTime) {
            throw new Error("Break must start before the work day ends.");
        }
        return true;
    }),

    body("breakEndTime")
    .trim()
    .notEmpty().withMessage("Break end time is required.")
    .isTime({ hourFormat: 'hour24' }).withMessage("Break end time must be a valid 24-hour format.")
    .custom((breakEndTime, { req }) => {
        const { breakStartTime, endTime } = req.body;
        if (breakStartTime && breakEndTime <= breakStartTime) {
            throw new Error("Break end time must be after the break start time.");
        }
        if (endTime && breakEndTime > endTime) {
            throw new Error("Break cannot end after the work day ends.");
        }
        return true;
    }),

    body("slotDuration")
    .notEmpty().withMessage("Slot duration is required.")
    .isInt().withMessage("Slot duration must be an integer.")
    .isIn([15, 30, 45, 60]).withMessage("Slot duration must be one of the following: 15, 30, 45, or 60 minutes."),

    body("selectedDays.mon").isBoolean().withMessage("Monday must be a boolean value (true/false)."),
    body("selectedDays.tue").isBoolean().withMessage("Tuesday must be a boolean value (true/false)."),
    body("selectedDays.wed").isBoolean().withMessage("Wednesday must be a boolean value (true/false)."),
    body("selectedDays.thu").isBoolean().withMessage("Thursday must be a boolean value (true/false)."),
    body("selectedDays.fri").isBoolean().withMessage("Friday must be a boolean value (true/false)."),
    body("selectedDays.sat").isBoolean().withMessage("Saturday must be a boolean value (true/false)."),
    body("selectedDays.sun").isBoolean().withMessage("Sunday must be a boolean value (true/false)."),
];

export const scheduleTodayValidator = [
    body("isAvailableToday").isBoolean().withMessage("isAvailableToday must be a boolean value (true/false).")
];

export const isLawyer = async (req,res,next) => {
    try {
        const userId = req.userId;
        const lawyer = await LAWYER.findOne({userId});

        if (!lawyer){
            throw createError("User is not a lawyer",400);
        }

        req.lawyerId = lawyer._id;
        next();
    } catch (error) {
        next(error);
    }
}