import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import isLogin from "../middlewares/isLogin.js";
import { isAdmin, createAdminValidator } from "../middlewares/admin.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();
router.use(isLogin);
router.use(isAdmin);

//User Management
router.get("/users/details", adminController.getUserData);
router.put("/user/update/status", adminController.updateUserStatus);

//Create new Admins
router.post("/create/new-admin",createAdminValidator, handleFormError, adminController.createNewAdmin);

export default router;