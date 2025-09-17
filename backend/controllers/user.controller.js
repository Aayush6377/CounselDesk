import USER from "../models/users.model.js";
import { deleteUploadedImage } from "../utils/deleteFile.js";
import { generateFileUrl } from "./lawyer.controller.js";

export const profileUpdate = async (req,res,next) => {
    try {
        const userId = req.userId;
        const { name } = req.body;
        const user = await USER.findById(userId);

        if (req.file && user.profileImage) {
            await deleteUploadedImage(user.profileImage);
        }

        user.name = name;
        if (req.file) {
            user.profileImage = generateFileUrl(req, req.file);
        }

        await user.save();
        res.status(200).json({success: true, message: "Profile updated successfully."});
    } catch (error) {
        next(error);
    }
}