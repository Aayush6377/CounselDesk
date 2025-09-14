import nodemailer from "nodemailer";
import createError from "./createError.js";

export const sendEmail = async ({to, subject, html}) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to, subject, html
        });

        return true;
    } catch (error) {
        throw createError("Failed to send Email", 500);
    }
}

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};