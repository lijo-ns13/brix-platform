import { Router } from "express";
import { authController } from "../controllers/auth.controller";
const router = Router();

router.post("/auth/signup", authController.signUp);
router.post("/auth/signin", authController.signIn);
router.post("/auth/verify", authController.verifyOTP);
router.post("/auth/resend", authController.resendOTP);
router.get("/auth/logout", authController.logout);
router.post("/auth/forget-password", authController.forgetPassword);
router.post("/auth/reset-password", authController.resetPassword);
export default router;
