import PLAN from "../models/plan.model.js";
import createError from "../utils/createError.js";

export const getPlansData =  async (req,res,next) => {
    try {
        const plans = await PLAN.find();

        if (plans.length <= 0){
            throw createError("Plans Not Found", 404);
        }

        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        next(error);
    }
}