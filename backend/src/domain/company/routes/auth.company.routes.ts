import { Router } from "express";

import { authController } from "../controllers/auth.controller";
const router = Router();

// auth related
router.post("/auth/signin", authController.signIn);
router.post("/auth/signup", authController.signUp);
router.post("/auth/verify", authController.verify);
router.post("/auth/resend", authController.resend);
router.get("/auth/logout", authController.logout);

// **

export default router;
