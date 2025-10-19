import { Router } from "express";
import { lawyersList, lawyerProfile } from "../controllers/user.controller.js";
import { contactSubmissionValidator, isLawyerFree } from "../middlewares/landing.middleware.js";
import { getPlansData, addContactSubmission } from "../controllers/landing.controller.js";
import handleFormError from "../utils/handleFormError.js";
import { getFeaturedQAndA } from "../controllers/community.controller.js";

const router = Router();

//Lawyer routes
router.get("/lawyers/list", lawyersList);
router.get("/lawyer/profile/:lawyerId", isLawyerFree,lawyerProfile);

//Subscription routes
router.get("/subscriptions/plans/details", getPlansData);

//Contact us routes
router.post("/contact/add", contactSubmissionValidator, handleFormError, addContactSubmission);

//Community
router.get("/community/questions/list", getFeaturedQAndA);

export default router;