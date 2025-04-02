import { Router } from "express";

import { UserProfileService } from "../services/user.profile.service";
import { UserProfileRepository } from "../repositories/user.profile.repository";
import { UserProfileController } from "../controllers/user.profile.controller";
const userProfileRouter = Router();
const userProfileService = new UserProfileService(new UserProfileRepository());
const userProfileController = new UserProfileController(userProfileService);

userProfileRouter.get("/:userId", (req, res) =>
  userProfileController.getUserProfile(req, res)
);
userProfileRouter.put("/:userId", (req, res) =>
  userProfileController.updateUserProfile(req, res)
);
userProfileRouter.put("/:userId/profile-image", (req, res) =>
  userProfileController.updateProfileImage(req, res)
);
userProfileRouter.delete("/:userId/profile-image", (req, res) =>
  userProfileController.deleteProfileImage(req, res)
);

// Education Routes
userProfileRouter.post("/:userId/education", (req, res) =>
  userProfileController.addEducation(req, res)
);
userProfileRouter.delete("/:userId/education/:educationId", (req, res) =>
  userProfileController.deleteEducation(req, res)
);

// Experience Routes
userProfileRouter.post("/:userId/experience", (req, res) =>
  userProfileController.addExperience(req, res)
);
userProfileRouter.delete("/:userId/experience/:experienceId", (req, res) =>
  userProfileController.deleteExperience(req, res)
);

// Project Routes
userProfileRouter.post("/:userId/project", (req, res) =>
  userProfileController.addProject(req, res)
);
userProfileRouter.delete("/:userId/project/:projectId", (req, res) =>
  userProfileController.deleteProject(req, res)
);

// Certificate Routes
userProfileRouter.post("/:userId/certificate", (req, res) =>
  userProfileController.addCertificate(req, res)
);
userProfileRouter.delete("/:userId/certificate/:certificateId", (req, res) =>
  userProfileController.deleteCertificate(req, res)
);

export default userProfileRouter;
