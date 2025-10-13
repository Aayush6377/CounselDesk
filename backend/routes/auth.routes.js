import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { signUpValidator, otpValidator, otpVerifyValidator, loginValidator, resetPasswordValidator, deleteMiddleware } from "../middlewares/auth.middleware.js";
import handleFormError from "../utils/handleFormError.js";
import isLogin from "../middlewares/isLogin.js";
import { authLimiter } from "../middlewares/rateLimiters.js";

const router = Router();
router.use(authLimiter);

//Auth routes
router.post("/google", authController.authByGoogle);
router.post("/local/signup", signUpValidator, handleFormError, authController.signupByLocal);
router.post("/local/login", loginValidator, handleFormError ,authController.loginByLocal);
router.post("/local/resetPassword", resetPasswordValidator, handleFormError, authController.resetPassword);

//OTP routes
router.post("/otp/send", otpValidator, handleFormError, authController.sendOtp);
router.post("/otp/verify", otpVerifyValidator, handleFormError, authController.verifyOtp);

router.post("/refresh",authController.refresh);

router.use(isLogin);
router.post("/logout",authController.logout);
router.delete("/delete", deleteMiddleware, authController.deleteAccount);

export default router;