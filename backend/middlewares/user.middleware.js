import { body } from "express-validator";

export const profileUpdateValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Full name is required.")
    .isLength({ min: 3, max: 100 }).withMessage("Full name must be between 3 and 100 characters.")
];