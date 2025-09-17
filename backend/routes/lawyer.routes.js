import { Router } from "express";
import * as lawyerController from "../controllers/lawyer.controller.js";
import handleFormError, {validationAndCleanup} from "../utils/handleFormError.js";
import fileUploaderMiddleware, { imageUploader } from "../middlewares/multer.js";
import { profileSetupValidator, profileUpdateValidator, isLawyer } from "../middlewares/lawyer.middleware.js";
import isLogin from "../middlewares/isLogin.js";

const router = Router();
router.use(isLogin);

//Profile routes
router.post("/profile/setup", fileUploaderMiddleware, profileSetupValidator ,validationAndCleanup, lawyerController.profileSetup);

router.use(isLawyer);
router.put("/profile/update", imageUploader, profileUpdateValidator, handleFormError ,lawyerController.profileUpdate);
router.get("/profile/details", lawyerController.profileDetails);

export default router;
