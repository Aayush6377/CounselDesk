import createError from "../utils/createError.js";

export const checkCronSecret = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError("Unauthorized: Missing or malformed secret token.", 401);
        }

        const secret = authHeader.split(' ')[1];
        if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
            throw createError("Unauthorized: Invalid secret token.", 401);
        }

        next();
    } catch (error) {
        next(error);
    }
};