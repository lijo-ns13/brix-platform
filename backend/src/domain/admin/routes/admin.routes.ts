// import { Router } from "express";
// import { authController } from "../controllers/auth.controller";
// import { userController } from "../controllers/user.management.controller";
// import { companyController } from "../controllers/company.management.controller";
// import { authenticate } from "../../../shared/middlewares/auth.middleware";
// const router = Router();

// router.post("/auth/signin", authController.signIn);
// // user management
// router.patch(
//   "/users/block/:userId",
//   authenticate("admin"),
//   userController.blockUser
// );
// router.patch(
//   "/users/unblock/:userId",
//   authenticate("admin"),
//   userController.unblockUser
// );
// router.get("/users", authenticate("admin"), userController.getUsers);

// // company management
// router.get("/companies", authenticate("admin"), companyController.getCompanies);

// router.get(
//   "/companies/unverified",
//   authenticate("admin"),
//   companyController.getUnverifiedCompaniesHandler
// );
// router.get(
//   "/companies/:companyId",
//   authenticate("admin"),
//   companyController.getCompanyById
// );
// router.patch(
//   "/companies/block/:companyId",
//   authenticate("admin"),
//   companyController.blockCompany
// );
// router.patch(
//   "/companies/unblock/:companyId",
//   authenticate("admin"),
//   companyController.unblockCompany
// );
// router.patch(
//   "/companies/verify/:companyId",
//   authenticate("admin"),
//   companyController.verifyCompany
// );

// export default router;

import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/auth.middleware";
import { SkillRepository } from "../repositories/skill.repository";
import { SkillService } from "../services/skill.service";
import { SkillController } from "../controllers/skill.controller";

// Import other controllers
import { authController } from "../controllers/auth.controller";
import { userController } from "../controllers/user.management.controller";
import { companyController } from "../controllers/company.management.controller";

const router = Router();

// Auth routes
router.post("/auth/signin", authController.signIn);

// ==== Skill Management Setup ====
const skillRepository = new SkillRepository();
const skillService = new SkillService(skillRepository);
const skillController = new SkillController(skillService);

// ==== Apply Admin Authentication Middleware ====
router.use(authenticate("admin"));

// ==== User Management Routes ====
router.patch("/users/block/:userId", userController.blockUser);
router.patch("/users/unblock/:userId", userController.unblockUser);
router.get("/users", userController.getUsers);

// ==== Company Management Routes ====
router.get("/companies", companyController.getCompanies);
router.get(
  "/companies/unverified",
  companyController.getUnverifiedCompaniesHandler
);
router.get("/companies/:companyId", companyController.getCompanyById);
router.patch("/companies/block/:companyId", companyController.blockCompany);
router.patch("/companies/unblock/:companyId", companyController.unblockCompany);
router.patch("/companies/verify/:companyId", companyController.verifyCompany);

// ==== Skill Management Routes ====
router.post("/skills", (req, res) => skillController.create(req, res));
router.get("/skills", (req, res) => skillController.getAll(req, res));
router.get("/skills/:id", (req, res) => skillController.getById(req, res));
router.patch("/skills/:id", (req, res) => skillController.update(req, res));
router.delete("/skills/:id", (req, res) => skillController.delete(req, res));

export default router;
