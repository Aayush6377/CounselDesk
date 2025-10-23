import createError from "../utils/createError.js";

const isDemoAccount = async (req,res,next) => {
    try {
        const userEmail = req.user?.email || req.body?.email || req.email;

        if (!userEmail) {
            throw createError("User email not found", 404);
        }

        if (["demolawyer@counseldesk.com", "demouser@counseldesk.com"].includes(userEmail)){
            throw createError("Demo accounts are not allowed to perform this action", 400);
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default isDemoAccount;