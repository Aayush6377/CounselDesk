import { Router } from "express";
import { lawyersList, lawyerProfile } from "../controllers/user.controller.js";
import { isLawyerFree } from "../middlewares/landing.middleware.js";

const router = Router();

router.get("/lawyers/list", lawyersList);
router.get("/lawyer/profile/:lawyerId", isLawyerFree,lawyerProfile);

export default router;