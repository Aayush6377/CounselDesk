import CONTACT from "../models/contact.model.js";
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

export const addContactSubmission = async (req,res,next) => {
    try {
        const { name, email, message, phone } = req.body;

        await CONTACT.create({ name, email, message, phone });

        res.status(200).json({ success: true, message: "Your message has been received! We will get back to you shortly" });
    } catch (error) {
        next(error);
    }
}