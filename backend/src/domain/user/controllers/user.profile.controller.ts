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
  async editEducation(req: Request, res: Response) {
    try {
      const updatedEducation = await this.userProfileService.editEducation(
        req.params.educationId,
        req.body as Partial<IUserEducation>
      );
      res.json(updatedEducation);
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
  async editExperience(req: Request, res: Response) {
    try {
      const updatedExperience = await this.userProfileService.editExperience(
        req.params.experienceId,
        req.body as Partial<IUserExperience>
      );
      res.json(updatedExperience);
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
  async editProject(req: Request, res: Response) {
    try {
      const updatedProject = await this.userProfileService.editProject(
        req.params.projectId,
        req.body as Partial<IUserProject>
      );
      res.json(updatedProject);
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
  async editCertificate(req: Request, res: Response) {
    try {
      const updatedCertificate = await this.userProfileService.editCertificate(
        req.params.certificateId,
        req.body as Partial<IUserCertificate>
      );
      res.json(updatedCertificate);
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
  // Get all educations
  async getAllEducations(req: Request, res: Response) {
    try {
      const educations = await this.userProfileService.getAllEducations(
        req.params.userId
      );
      res.json(educations);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all experiences
  async getAllExperiences(req: Request, res: Response) {
    try {
      const experiences = await this.userProfileService.getAllExperiences(
        req.params.userId
      );
      res.json(experiences);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all projects
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await this.userProfileService.getAllProjects(
        req.params.userId
      );
      res.json(projects);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all certificates
  async getAllCertificates(req: Request, res: Response) {
    try {
      const certificates = await this.userProfileService.getAllCertificates(
        req.params.userId
      );
      res.json(certificates);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
