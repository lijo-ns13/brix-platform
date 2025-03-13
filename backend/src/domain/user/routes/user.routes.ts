import { Router } from "express";
import { userController } from "../controllers/auth.controller";


const router=Router();

router.post('/auth/signup',userController.signUp);
router.post('/auth/signin',userController.signIn);
export default router;