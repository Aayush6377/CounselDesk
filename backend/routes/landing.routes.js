import { Router } from "express";
import { lawyersList, lawyerProfile } from "../controllers/user.controller.js";
import { isLawyerFree } from "../middlewares/landing.middleware.js";
import { getPlansData } from "../controllers/landing.controller.js";

const router = Router();

//Lawyer routes
router.get("/lawyers/list", lawyersList);
router.get("/lawyer/profile/:lawyerId", isLawyerFree,lawyerProfile);

//Subscription routes
router.get("/subscriptions/plans/details", getPlansData);

export default router;