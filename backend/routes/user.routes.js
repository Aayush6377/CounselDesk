import { Router } from "express";
import isLogin from "../middlewares/isLogin.js";
import { imageUploader } from "../middlewares/multer.js";
import * as userController from "../controllers/user.controller.js";
import { isLawyer, profileUpdateValidator, reviewValidator } from "../middlewares/user.middleware.js";
import handleFormError from "../utils/handleFormError.js";
import { createCheckoutSession, confirmBooking, cancelAppointment } from "../controllers/stripe.controller.js";
import { generalLimiter } from "../middlewares/rateLimiters.js";
import { addQuestion, getQuestionsList, markAsBestAnswer, toggleVote } from "../controllers/community.controller.js";
import { addQuestionValidator, isValidAnswerId } from "../middlewares/community.middleware.js";

const router = Router();
router.use(generalLimiter);
router.use(isLogin);

//Profile route
router.put("/profile/update", imageUploader, profileUpdateValidator , handleFormError ,userController.profileUpdate);

//Dashboard details
router.get("/dashboard/details", userController.getDashboardData);

//Lawyer details
router.get("/lawyers/list", userController.lawyersList);
router.get("/lawyer/profile/:lawyerId", isLawyer,userController.lawyerProfile);
router.get("/lawyer/timeSlots/:lawyerId", isLawyer,userController.lawyerTimeSlots);

//Appointment Booking
router.post("/payment/consultancy/checkout-session", createCheckoutSession);
router.post("/payment/confirm-booking", confirmBooking);
router.put("/payment/cancel/appointment", cancelAppointment);

//Appointment Details
router.get("/appointments/list", userController.getUserAppointments);
router.get("/appointment/details/:appointmentId", userController.getAppointmentDetails);
router.get('/appointment/invoice/:appointmentId', userController.generateInvoice);

//Review
router.post("/review/add", reviewValidator, handleFormError ,userController.addReviw);
router.put("/review/update", reviewValidator, handleFormError, userController.updateReview);
router.get("/review/details/:appointmentId", userController.getReviewDetails);
router.get("/reviews/list/:lawyerId", userController.getReviewsList);

//Payment History
router.get("/payments/history", userController.getPaymentHistory);

//Community
router.post("/community/question/add", addQuestionValidator, handleFormError, addQuestion);
router.get("/community/questions/list", getQuestionsList);
router.post("/community/vote/toggle", isValidAnswerId, toggleVote);
router.put("/community/mark", isValidAnswerId, markAsBestAnswer);

export default router;