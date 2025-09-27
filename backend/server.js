import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import lawyerRouter from "./routes/lawyer.routes.js";
import userRouter from "./routes/user.routes.js";
import landingRouter from "./routes/landing.routes.js";

dotenv.config();

const port = process.env.PORT;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();

export const frontend = "http://localhost:5173";

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(cors({
    origin: frontend, 
    credentials: true 
}));


app.use("/api/auth",authRouter);
app.use("/api/lawyer",lawyerRouter);
app.use("/api/user", userRouter);
app.use("/api/landing", landingRouter);

app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({status, message, success: false});
});

app.listen(port,() => {
    console.log(`Server is running at http://localhost:${port}`);
})