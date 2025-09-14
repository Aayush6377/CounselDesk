import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { signUpValidator, otpValidator, otpVerifyValidator, loginValidator, resetPasswordValidator } from "../middlewares/auth.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();

//Auth routes
router.post("/google", authController.authByGoogle);
router.post("/local/signup", signUpValidator, handleFormError, authController.signupByLocal);
router.post("/local/login", loginValidator, handleFormError ,authController.loginByLocal);
router.post("/local/resetPassword", resetPasswordValidator, handleFormError, authController.resetPassword);

//OTP routes
router.post("/otp/send", otpValidator, handleFormError, authController.sendOtp);
router.post("/otp/verify", otpVerifyValidator, handleFormError, authController.verifyOtp);

router.get("/refresh",authController.refresh);
router.post("/logout",authController.logout);

export default router;