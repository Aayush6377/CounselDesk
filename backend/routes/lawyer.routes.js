import { Router } from "express";
import * as lawyerController from "../controllers/lawyer.controller.js";
import { getPlansData } from "../controllers/landing.controller.js";
import { createSubscriptionCheckoutSession, confirmSubscriptionPurchase, getSubscriptionDetails, cancelSubscription } from "../controllers/stripe.controller.js";
import handleFormError, {validationAndCleanup} from "../utils/handleFormError.js";
import fileUploaderMiddleware, { imageUploader } from "../middlewares/multer.js";
import { profileSetupValidator, profileUpdateValidator, isLawyer, scheduleUpdateValidator, scheduleTodayValidator } from "../middlewares/lawyer.middleware.js";
import isLogin from "../middlewares/isLogin.js";

const router = Router();
router.use(isLogin);

//Profile routes
router.post("/profile/setup", fileUploaderMiddleware, profileSetupValidator ,validationAndCleanup, lawyerController.profileSetup);

router.use(isLawyer);
router.put("/profile/update", imageUploader, profileUpdateValidator, handleFormError ,lawyerController.profileUpdate);
router.get("/profile/details", lawyerController.profileDetails);

//Schedule routes
router.post("/schedule/update", scheduleUpdateValidator, handleFormError, lawyerController.scheduleUpdate);
router.put("/schedule/unavailable/today", scheduleTodayValidator, handleFormError,lawyerController.scheduleUnavailableToday);
router.get("/schedule/details", lawyerController.scheduleDetails);

//Appointment routes
router.get("/appointments/list", lawyerController.getLawyerAppointments);
router.get("/appointment/details/:appointmentId", lawyerController.getAppointmentDetails);

//Review routes
router.get("/reviews/stats", lawyerController.getReviewStats);
router.get("/reviews/list", lawyerController.getReviewsList);

//Subscription routes
router.get("/subscriptions/plans/details", getPlansData);
router.post("/payment/subscription/checkout-session", createSubscriptionCheckoutSession);
router.post("/payment/confirm-purchase", confirmSubscriptionPurchase);
router.put("/payment/cancel/subscription", cancelSubscription);
router.get("/subscription/curent-plan/details", getSubscriptionDetails);

export default router;