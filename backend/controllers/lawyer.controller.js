import LAWYER from "../models/lawyers.model.js";
import USER from "../models/users.model.js";
import createError from "../utils/createError.js";
import deleteUploadedFiles, { deleteUploadedImage } from "../utils/deleteFile.js";
import path from "path";

export const generateFileUrl = (req, file) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const relativePath = file.path.substring(file.path.indexOf(path.sep + 'uploads'));
    return `${baseUrl}${relativePath.replace(/\\/g, '/')}`;
}

export const profileSetup = async (req,res,next) => {
    try {
        const userId = req.userId;
        const {fullName, specialization, bio, qualifications, 
            phone, city, state, pincode, accountHolderName, 
            bankName, accountNumber, ifscCode, fees} = req.body;

        const user = await USER.findById(userId);

        if (user.role !== "lawyer"){
            deleteUploadedFiles(req.files);
            throw createError("User is not a lawyer", 400);
        }

        const check = await LAWYER.findOne({userId});
        if (check) {
            deleteUploadedFiles(req.files);
            throw createError("Lawyer already registered", 400);
        }

        const files = req.files;

        const profileImage = files.profileImage ? generateFileUrl(req, files.profileImage[0]) : null;
        const barCouncilCertificate = files.barCouncilCertificate ? generateFileUrl(req, files.barCouncilCertificate[0]) : null;
        const practiceCertificate = files.practiceCertificate ? generateFileUrl(req, files.practiceCertificate[0]) : null;
        const governmentId = files.governmentId ? generateFileUrl(req, files.governmentId[0]) : null;
        const lawDegree = files.lawDegree ? generateFileUrl(req, files.lawDegree[0]) : null;

        const address = {city, state, pincode};
        const bankDetails = {accountHolderName, bankName, accountNumber, ifscCode};
        
        const documents = { barCouncilCertificate, practiceCertificate, governmentId, lawDegree };

        user.name = fullName;
        user.bioDataProvided = true;
        if (profileImage) user.profileImage = profileImage;
        await user.save();

        await LAWYER.create({
            userId, specialization, bio, qualifications, 
            phone, fees, address, bankDetails, documents
        });

        res.status(201).json({success: true, message: "Lawyer data has successfully been added."});
    } catch (error) {
        if (req.files) {
            deleteUploadedFiles(req.files);
        }
        next(error);
    }
}

export const profileUpdate = async (req,res,next) => {
    try {
        const userId = req.userId;
        const {name, specialization, bio, qualifications, 
            phone, address, bankDetails, fees} = req.body;

        const user = await USER.findById(userId);

        if (req.file && user.profileImage) {
            await deleteUploadedImage(user.profileImage);
        }

        user.name = name;
        if (req.file) {
            user.profileImage = generateFileUrl(req, req.file);
        }
        await user.save();

        const lawyerUpdateData = { specialization, bio, qualifications, phone, address, bankDetails, fees };

        const updatedLawyer = await LAWYER.findOneAndUpdate(
            { userId: userId },      
            { $set: lawyerUpdateData },
            { new: true, runValidators: true }
        );

        if (!updatedLawyer) {
            throw createError("Lawyer profile not found.", 404);
        }

        res.status(200).json({success: true, message: "Profile updated successfully."});
        
    } catch (error) {
        next(error);
    }
}

export const profileDetails = async (req,res,next) => {
    try {
        const userId = req.userId;
        const user = await LAWYER.findOne({userId}).select("+bankDetails.accountHolderName +bankDetails.bankName +bankDetails.accountNumber +bankDetails.ifscCode").select("-documents -_id -userId");

        if (!user){
            throw createError("Lawyer is not registered",400);
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}