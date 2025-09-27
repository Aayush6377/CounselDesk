import { Router } from "express";
import * as lawyerController from "../controllers/lawyer.controller.js";
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

//Booking routes
router.post("/schedule/update", scheduleUpdateValidator, handleFormError, lawyerController.scheduleUpdate);
router.put("/schedule/unavailable/today", scheduleTodayValidator, handleFormError,lawyerController.scheduleUnavailableToday);
router.get("/schedule/details", lawyerController.scheduleDetails);

export default router;