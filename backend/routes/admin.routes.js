import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { deleteAccount } from "../controllers/auth.controller.js";
import isLogin from "../middlewares/isLogin.js";
import { isAdmin, createAdminValidator, deleteMiddleware } from "../middlewares/admin.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();
router.use(isLogin);
router.use(isAdmin);

//Dashboard details
router.get("/dashboard/details", adminController.getDashboardData);

//User Management
router.get("/users/details", adminController.getUserData);
router.put("/user/update/status", adminController.updateUserStatus);
router.delete("/user/delete/:userId", deleteMiddleware, deleteAccount);

//Lawyer verification requests
router.get("/lawyers/list", adminController.getLawyersData);
router.get("/lawyer/profile/:lawyerId", adminController.getLawyerProfile);
router.put("/lawyer/update/verificationStatus", adminController.updateVerificationStatus);

//Contact Submissions
router.get("/contact/list", adminController.getContactSubmissionList);
router.get("/contact/detail/:contactId", adminController.getContactDetails);
router.delete("/contact/delete/:contactId", adminController.removeContactSubmission);

//Create new Admins
router.post("/create/new-admin",createAdminValidator, handleFormError, adminController.createNewAdmin);

export default router;