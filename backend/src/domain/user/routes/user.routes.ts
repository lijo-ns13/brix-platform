import { Router } from "express";
import { userController } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/signup", userController.signUp);
router.post("/auth/signin", userController.signIn);
router.post("/auth/verify", userController.verify);
router.post("/auth/resend", userController.resend);
router.get("/auth/logout", userController.logout);
router.post("/auth/forget-password", userController.forgetPassword);
router.post("/auth/reset-password", userController.resetPassword);
export default router;
