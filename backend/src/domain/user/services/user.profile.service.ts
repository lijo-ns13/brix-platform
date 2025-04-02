import { IUserProfileRepository } from "../interfaces/IUserProfile.Repository";
import { IUser } from "../../../shared/models/user.model";
import { IUserEducation } from "../../../shared/models/user.education.model";
import { IUserExperience } from "../../../shared/models/user.experience.model";
import { IUserProject } from "../../../shared/models/user.project.model";
import { IUserCertificate } from "../../../shared/models/user.certificate.model";

export class UserProfileService {
  constructor(private userRepository: IUserProfileRepository) {}

  async getUserProfile(userId: string): Promise<IUser> {
    const user = await this.userRepository.getUserProfile(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserProfileWithDetails(userId: string): Promise<IUser> {
    const user = await this.userRepository.getUserProfileWithDetails(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUserProfile(userId: string, data: Partial<IUser>) {
    const updated = await this.userRepository.updateUserProfile(userId, data);
    if (!updated) {
      throw new Error("User profile update failed");
    }
    return updated;
  }

  // Profile image management
  async updateProfileImage(userId: string, imageUrl: string) {
    const updateImg = await this.userRepository.updateProfileImage(
      userId,
      imageUrl
    );
    if (!updateImg) {
      throw new Error("Failed to update profile image");
    }
    return updateImg;
  }

  async deleteProfileImage(userId: string) {
    const deleted = await this.userRepository.deleteProfileImage(userId);
    if (!deleted) {
      throw new Error("Failed to delete profile image");
    }
    return deleted;
  }

  // Education
  async addEducation(userId: string, education: IUserEducation) {
    return await this.userRepository.addEducation(userId, education);
  }

  async editEducation(educationId: string, data: Partial<IUserEducation>) {
    const updated = await this.userRepository.updateEducation(
      educationId,
      data
    );
    if (!updated) {
      throw new Error("Failed to update education");
    }
    return updated;
  }

  async deleteEducation(userId: string, educationId: string) {
    const deleted = await this.userRepository.deleteEducation(
      userId,
      educationId
    );
    if (!deleted) {
      throw new Error("Failed to delete education");
    }
    return deleted;
  }

  // Experience
  async addExperience(userId: string, experience: IUserExperience) {
    return await this.userRepository.addExperience(userId, experience);
  }

  async editExperience(experienceId: string, data: Partial<IUserExperience>) {
    const updated = await this.userRepository.updateExperience(
      experienceId,
      data
    );
    if (!updated) {
      throw new Error("Failed to update experience");
    }
    return updated;
  }

  async deleteExperience(userId: string, experienceId: string) {
    const deleted = await this.userRepository.deleteExperience(
      userId,
      experienceId
    );
    if (!deleted) {
      throw new Error("Failed to delete experience");
    }
    return deleted;
  }

  // Projects
  async addProject(userId: string, project: IUserProject) {
    return await this.userRepository.addProject(userId, project);
  }

  async editProject(projectId: string, data: Partial<IUserProject>) {
    const updated = await this.userRepository.updateProject(projectId, data);
    if (!updated) {
      throw new Error("Failed to update project");
    }
    return updated;
  }

  async deleteProject(userId: string, projectId: string) {
    const deleted = await this.userRepository.deleteProject(userId, projectId);
    if (!deleted) {
      throw new Error("Failed to delete project");
    }
    return deleted;
  }

  // Certificates
  async addCertificate(userId: string, certificate: IUserCertificate) {
    return await this.userRepository.addCertificate(userId, certificate);
  }

  async editCertificate(
    certificateId: string,
    data: Partial<IUserCertificate>
  ) {
    const updated = await this.userRepository.updateCertificate(
      certificateId,
      data
    );
    if (!updated) {
      throw new Error("Failed to update certificate");
    }
    return updated;
  }

  async deleteCertificate(userId: string, certificateId: string) {
    const deleted = await this.userRepository.deleteCertificate(
      userId,
      certificateId
    );
    if (!deleted) {
      throw new Error("Failed to delete certificate");
    }
    return deleted;
  }
}
