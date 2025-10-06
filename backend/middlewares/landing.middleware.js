import mongoose from "mongoose";
import LAWYER from "../models/lawyers.model.js";
import createError from "../utils/createError.js";


export const isLawyerFree = async (req,res,next) => {
    try {
        const { lawyerId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
            throw createError("Invalid Lawyer ID format.", 400);
        }

        const res = await LAWYER.findOne({userId: lawyerId},{subscription: 1});
        if (!res){
            throw createError("Lawyer Not Found", 404);
        }
        if (res.subscription.plan !== "free"){
            throw createError("Lawyer is premium, pls login to view profile",400);
        }

        next();
    } catch (error) {
        next(error);
    }
}