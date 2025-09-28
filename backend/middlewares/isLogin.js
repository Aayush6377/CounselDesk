import jwt from "jsonwebtoken";
import USER from "../models/users.model.js";
import createError from "../utils/createError.js";

const isLogin = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw createError("Access token is missing or malformed.", 401);
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw createError("Server configuration error.", 500);
        }

        const decoded = jwt.verify(token, secret);

        const user = await USER.findById(decoded.userId);
        
        if (!user) {
            throw createError("User not found", 404);
        }

        req.userId = decoded.userId;
        req.role = decoded.role;
        req.email = user.email;
        
        next();

    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({success: false, message: "Invalid access token." });
        }
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({success: false,  message: "Access token expired." });
        }

        next(error);
    }
}

export default isLogin;