import { Router } from "express";
import isLogin from "../middlewares/isLogin.js";
import { imageUploader } from "../middlewares/multer.js";
import * as authController from "../controllers/user.controller.js";
import { profileUpdateValidator } from "../middlewares/user.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();
router.use(isLogin);

router.put("/profile/update", imageUploader, profileUpdateValidator , handleFormError ,authController.profileUpdate);

export default router;