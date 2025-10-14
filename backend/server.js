import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import seeders from "./assets/plans.seed.js";
import connectDB from "./config/connectDB.js";
import { startLocalCronJobs } from "./controllers/cron.controller.js";

//Routes
import authRouter from "./routes/auth.routes.js";
import lawyerRouter from "./routes/lawyer.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import landingRouter from "./routes/landing.routes.js";
import jitsiRouter from "./routes/jitsi.routes.js";
import cronRouter from "./routes/cron.routes.js";
import seedRouter from "./routes/seed.routes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();
//seeders();

app.use(express.json());
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser(process.env.COOKIE_KEY));

const allowedOrigins = [ "http://localhost:5173" ];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

app.use("/api/auth",authRouter);
app.use("/api/lawyer",lawyerRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/landing", landingRouter);
app.use("/api/jitsi", jitsiRouter);
app.use("/api/cron", cronRouter);
app.use("/api/seed", seedRouter);

app.get("/", (req, res) => {
    res.status(200).send("CounselDesk Backend is running successfully.");
});

app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({status, message, success: false});
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running locally at http://localhost:${port}`);
        startLocalCronJobs();
    });
}

export default app;