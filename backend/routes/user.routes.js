import { Router } from "express";
import isLogin from "../middlewares/isLogin.js";
import { imageUploader } from "../middlewares/multer.js";
import * as userController from "../controllers/user.controller.js";
import { profileUpdateValidator } from "../middlewares/user.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();
router.use(isLogin);

router.put("/profile/update", imageUploader, profileUpdateValidator , handleFormError ,userController.profileUpdate);

//Lawyer details
router.get("/lawyers/list", userController.lawyersList);
router.get("/lawyer/profile/:lawyerId", userController.lawyerProfile);

export default router;