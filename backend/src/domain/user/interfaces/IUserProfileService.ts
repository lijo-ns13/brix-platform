import { IUser } from "../../../shared/models/user.model";
import { IUserEducation } from "../../../shared/models/user.education.model";
import { IUserExperience } from "../../../shared/models/user.experience.model";
import { IUserProject } from "../../../shared/models/user.project.model";
import { IUserCertificate } from "../../../shared/models/user.certificate.model";

export interface IUserProfileService {
  // User Profile
  getUserProfile(userId: string): Promise<IUser | null>;
  updateUserProfile(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null>;

  // Profile Image
  updateProfileImage(userId: string, imageUrl: string): Promise<IUser | null>;
  deleteProfileImage(userId: string): Promise<boolean>;

  // Education
  addEducation(
    userId: string,
    education: IUserEducation
  ): Promise<IUserEducation>;
  updateEducation(
    educationId: string,
    data: Partial<IUserEducation>
  ): Promise<IUserEducation | null>;
  deleteEducation(educationId: string): Promise<boolean>;

  // Experience
  addExperience(
    userId: string,
    experience: IUserExperience
  ): Promise<IUserExperience>;
  updateExperience(
    experienceId: string,
    data: Partial<IUserExperience>
  ): Promise<IUserExperience | null>;
  deleteExperience(experienceId: string): Promise<boolean>;

  // Projects
  addProject(userId: string, project: IUserProject): Promise<IUserProject>;
  updateProject(
    projectId: string,
    data: Partial<IUserProject>
  ): Promise<IUserProject | null>;
  deleteProject(projectId: string): Promise<boolean>;

  // Certificates
  addCertificate(
    userId: string,
    certificate: IUserCertificate
  ): Promise<IUserCertificate>;
  updateCertificate(
    certificateId: string,
    data: Partial<IUserCertificate>
  ): Promise<IUserCertificate | null>;
  deleteCertificate(certificateId: string): Promise<boolean>;
}
