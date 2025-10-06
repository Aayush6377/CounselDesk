import { Router } from "express";
import isLogin from "../middlewares/isLogin.js";
import { imageUploader } from "../middlewares/multer.js";
import * as userController from "../controllers/user.controller.js";
import { isLawyer, profileUpdateValidator, reviewValidator } from "../middlewares/user.middleware.js";
import handleFormError from "../utils/handleFormError.js";
import { createCheckoutSession, confirmBooking, cancelAppointment } from "../controllers/stripe.controller.js";

const router = Router();
router.use(isLogin);

//Profile route
router.put("/profile/update", imageUploader, profileUpdateValidator , handleFormError ,userController.profileUpdate);

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

export default router;