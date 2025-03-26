import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { userController } from "../controllers/user.management.controller";
import { companyController } from "../controllers/company.management.controller";
import { authenticate } from "../../../shared/middlewares/auth.middleware";
const router = Router();

router.post("/auth/signin", authController.signIn);
// user management
router.patch(
  "/users/block/:userId",
  authenticate("admin"),
  userController.blockUser
);
router.patch(
  "/users/unblock/:userId",
  authenticate("admin"),
  userController.unblockUser
);
router.get("/users", authenticate("admin"), userController.getUsers);

// company management
router.get("/companies", authenticate("admin"), companyController.getCompanies);

router.get(
  "/companies/unverified",
  authenticate("admin"),
  companyController.getUnverifiedCompaniesHandler
);
router.get(
  "/companies/:companyId",
  authenticate("admin"),
  companyController.getCompanyById
);
router.patch(
  "/companies/block/:companyId",
  authenticate("admin"),
  companyController.blockCompany
);
router.patch(
  "/companies/unblock/:companyId",
  authenticate("admin"),
  companyController.unblockCompany
);
router.patch(
  "/companies/verify/:companyId",
  authenticate("admin"),
  companyController.verifyCompany
);
export default router;
