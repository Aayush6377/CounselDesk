import USER from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import createError from "../utils/createError.js";
import { generateOtp, sendEmail } from "../utils/sendEmail.js";
import { otpMailContent, welcomeMailContent } from "../assets/mails.js";

const googleCLient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authByGoogle = async (req,res,next) => {
    try {
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

        const { token, role } = req.body;
        
        const ticket = await googleCLient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const { sub, name, email, picture } = payload;
        
        let user = await USER.findOne({ oauthId: sub });

        if (!user) {
            user = await USER.findOne({ email });
            
            if (user) {
                user.authProvider = "google";
                user.oauthId = sub;
            } 
            else {
                user = await USER.create({
                    name,
                    email,
                    authProvider: "google",
                    oauthId: sub,
                    role,
                    profileImage: picture
                });

                const emailContent = welcomeMailContent(name);
                const sent = await sendEmail({...emailContent, to: email});

                if (!sent){
                    console.log("Unable to sent welcome message");
                }
            }
        }

        if (user.status === 'suspended') {
            return next(createError("Your account has been suspended. Please contact support.", 403));
        }

        user.name = name;
        user.email = email;
        if (!user.profileImage) user.profileImage = picture;
        await user.save();

        const accessToken = jwt.sign({ userId: user._id, role: user.role }, ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        const refreshToken = jwt.sign({ userId: user._id, role: user.role }, REFRESH_TOKEN_SECRET,{expiresIn: "7d"});
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            success: true,
            message: "Google auth Successful", 
            accessToken, 
            user: { name: user.name, email: user.email, role: user.role, profileImage: user.profileImage, bioDataProvided: user.bioDataProvided, verified: user.verified } 
        });
    } catch (error) {
        console.error("Google authentication failed:", error);
        next(createError("Google authentication failed. Please try again.", 401));
    }
}

export const signupByLocal = async (req,res,next) => {
    try {
        const { name, email, password, role } = req.body;
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

        const user = await USER.create({
            name, email, password, role
        });

        const emailContent = welcomeMailContent(name);
        const sent = await sendEmail({...emailContent, to: email});

        if (!sent){
            console.log("Unable to sent welcome message");
        }

        const accessToken = jwt.sign({ userId: user._id, role }, ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        const refreshToken = jwt.sign({ userId: user._id, role }, REFRESH_TOKEN_SECRET,{expiresIn: "7d"});
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            success: true,
            message: "Google Signup Successful", 
            accessToken, 
            user: { name, email, role ,bioDataProvided: user.bioDataProvided, verified: user.verified } 
        });
        
    } catch (error) {
        next(error);
    }
}

export const loginByLocal = async (req,res,next) => {
    try {
        const { email } = req.body;
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

        const user = await USER.findOne({email});

        if (user.status === 'suspended') {
            return next(createError("Your account has been suspended. Please contact support.", 403));
        }

        const accessToken = jwt.sign({ userId: user._id, role: user.role }, ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        const refreshToken = jwt.sign({ userId: user._id, role: user.role }, REFRESH_TOKEN_SECRET,{expiresIn: "7d"});

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            success: true,
            message: "Google Login Successful", 
            accessToken, 
            user: { name: user.name, email: user.email, role: user.role, profileImage: user.profileImage, bioDataProvided: user.bioDataProvided, verified: user.verified} 
        });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async(req,res,next) => {
    try {
        const { email, password } = req.body;

        const user = await USER.findOne({email});

        if (!user){
            return next(createError("User with this email not found.", 404));
        }

        user.password = password;
        await user.save();

        res.status(200).json({success: true, message: "Password changed successfully"});
    } catch (error) {
        next(error);
    }
}

export const logout = async (req,res,next) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}

export const deleteAccount = (req,res,next) => {
    try {
         
    } catch (error) {
        next(error);
    }
}

export const sendOtp = async (req,res,next) => {
    try {
        const otp = generateOtp();
        const { email: to, useCase } = req.body;
        const content = otpMailContent(otp);

        const user = await USER.findOne({email: to});

        if (user && useCase === "signup"){
            throw createError("Email already exists, please try login", 400);
        }

        if (!user && useCase === "forgotPassword"){
            throw createError("Email not found, please sign up",400);
        }

        const send = await sendEmail({to, ...content});
        const otpToken = jwt.sign({email: to, otp}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "2m"});

        if (!send){
            throw createError("Failed to send Email", 500);
        }
        res.status(200).json({success: true, message: "OTP send successfully", token: otpToken});
    } catch (error) {
        next(error);
    }
}

export const verifyOtp = async (req,res,next) => {
    try {
        const { otp, token } = req.body;

        if (!token){
            throw createError("No token provided", 400);
        }

        const result = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        if (!result){
            throw createError("Invalid or expired OTP token",401);
        }

        if (result.otp !== otp){
            throw createError("OTP doesn't matched", 400);
        }

        res.status(200).json({message: "OTP verified", success: true, email: result.email});
    } catch (error) {
        next(error);
    }
}

export const refresh = async (req,res,next) => {
    try {
        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        
        const token = req.cookies.refreshToken;
        if (!token) throw createError("Unauthorised user",401);

        const decode = jwt.verify(token,REFRESH_TOKEN_SECRET);
        const user = await USER.findById(decode.userId);
        if (!user) {
            throw createError("User not found", 404);
        }
        
        const accessToken = jwt.sign({userId: user._id, role: user.role}, ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        res.status(200).json({success: true, accessToken, user: { name: user.name, email: user.email, role: user.role, profileImage: user.profileImage, bioDataProvided: user.bioDataProvided, verified: user.verified }});
    } catch (error) {
        next(error);
    }
}