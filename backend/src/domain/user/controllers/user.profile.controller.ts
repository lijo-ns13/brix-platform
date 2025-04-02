import { Request, Response } from "express";

import { IUserEducation } from "../../../shared/models/user.education.model";
import { IUserExperience } from "../../../shared/models/user.experience.model";
import { IUserProject } from "../../../shared/models/user.project.model";
import { IUserCertificate } from "../../../shared/models/user.certificate.model";
import { UserProfileService } from "../services/user.profile.service";
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  async getUserProfile(req: Request, res: Response) {
    try {
      const user = await this.userProfileService.getUserProfile(
        req.params.userId
      );
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const updatedUser = await this.userProfileService.updateUserProfile(
        req.params.userId,
        req.body
      );
      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProfileImage(req: Request, res: Response) {
    try {
      const updated = await this.userProfileService.updateProfileImage(
        req.params.userId,
        req.body.imageUrl
      );
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProfileImage(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteProfileImage(req.params.userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async addEducation(req: Request, res: Response) {
    try {
      const education = await this.userProfileService.addEducation(
        req.params.userId,
        req.body as IUserEducation
      );
      res.status(201).json(education);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteEducation(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteEducation(
        req.params.userId,
        req.params.educationId
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async addExperience(req: Request, res: Response) {
    try {
      const experience = await this.userProfileService.addExperience(
        req.params.userId,
        req.body as IUserExperience
      );
      res.status(201).json(experience);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteExperience(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteExperience(
        req.params.userId,
        req.params.experienceId
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async addProject(req: Request, res: Response) {
    try {
      const project = await this.userProfileService.addProject(
        req.params.userId,
        req.body as IUserProject
      );
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteProject(
        req.params.userId,
        req.params.projectId
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async addCertificate(req: Request, res: Response) {
    try {
      const certificate = await this.userProfileService.addCertificate(
        req.params.userId,
        req.body as IUserCertificate
      );
      res.status(201).json(certificate);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCertificate(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteCertificate(
        req.params.userId,
        req.params.certificateId
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
