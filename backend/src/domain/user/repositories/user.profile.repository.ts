import userModel, { IUser } from "../../../shared/models/user.model";
import userCertificateModel, {
  IUserCertificate,
} from "../../../shared/models/user.certificate.model";
import userEducationModel, {
  IUserEducation,
} from "../../../shared/models/user.education.model";
import userExperienceModel, {
  IUserExperience,
} from "../../../shared/models/user.experience.model";
import userProjectModel, {
  IUserProject,
} from "../../../shared/models/user.project.model";
import { IUserProfileRepository } from "../interfaces/IUserProfile.Repository";

export class UserProfileRepository implements IUserProfileRepository {
  //  Get User Profile
  async getUserProfile(userId: string): Promise<IUser | null> {
    return await userModel.findById(userId);
  }
  // get user profiole with details
  async getUserProfileWithDetails(userId: string): Promise<IUser | null> {
    return userModel
      .findById(userId)
      .populate("educations")
      .populate("experiences")
      .populate("projects")
      .populate("certificates");
  }
  //  Update User Profile
  async updateUserProfile(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return await userModel.findByIdAndUpdate(userId, data, { new: true });
  }

  // Update Profile Image
  async updateProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<IUser | null> {
    return await userModel.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    );
  }

  //  Delete Profile Image
  async deleteProfileImage(userId: string): Promise<boolean> {
    return (
      (await userModel.findByIdAndUpdate(userId, { profilePicture: null })) !==
      null
    );
  }

  //  Add Education
  async addEducation(
    userId: string,
    education: IUserEducation
  ): Promise<IUserEducation> {
    try {
      const newEducation = new userEducationModel({ ...education, userId });
      const savedEducation = await newEducation.save();

      await userModel.findByIdAndUpdate(
        userId,
        { $push: { educations: savedEducation._id } },
        { new: true }
      );

      return savedEducation;
    } catch (error) {
      console.log("error occured", error);
      throw error;
    }
  }

  // Update Education
  async updateEducation(
    educationId: string,
    data: Partial<IUserEducation>
  ): Promise<IUserEducation | null> {
    return await userEducationModel.findByIdAndUpdate(educationId, data, {
      new: true,
    });
  }

  //  Delete Education
  async deleteEducation(userId: string, educationId: string): Promise<boolean> {
    try {
      const deletedEducation = await userEducationModel.findByIdAndDelete(
        educationId
      );
      if (!deletedEducation) {
        throw new Error("Education not found");
      }
      await userModel.findByIdAndUpdate(userId, {
        $pull: { educations: educationId },
      });

      return true;
    } catch (error) {
      console.log("error in delete education", error);
      return false;
    }
  }

  //  Add Experience
  async addExperience(
    userId: string,
    experience: IUserExperience
  ): Promise<IUserExperience> {
    try {
      const newExperience = new userExperienceModel({ ...experience, userId });
      const savedExperience = await newExperience.save();

      await userModel.findByIdAndUpdate(
        userId,
        { $push: { experiences: savedExperience._id } },
        { new: true }
      );

      return savedExperience;
    } catch (error) {
      console.log("error occured in add experinced", error);
      throw error;
    }
  }

  //  Update Experience
  async updateExperience(
    experienceId: string,
    data: Partial<IUserExperience>
  ): Promise<IUserExperience | null> {
    return await userExperienceModel.findByIdAndUpdate(experienceId, data, {
      new: true,
    });
  }

  //  Delete Experience
  async deleteExperience(
    userId: string,
    experienceId: string
  ): Promise<boolean> {
    try {
      const deletedExperience = await userExperienceModel.findByIdAndDelete(
        experienceId
      );
      if (!deletedExperience) {
        throw new Error("not found experience");
      }
      await userModel.findByIdAndUpdate(userId, {
        $pull: { experiences: experienceId },
      });

      return true;
    } catch (error) {
      console.log("error in deleted expernce", error);
      return false;
    }
  }

  //  Add Project
  async addProject(
    userId: string,
    project: IUserProject
  ): Promise<IUserProject> {
    try {
      const newProject = new userProjectModel({ ...project, userId });
      const savedProject = await newProject.save();

      await userModel.findByIdAndUpdate(
        userId,
        { $push: { projects: savedProject._id } },
        { new: true }
      );

      return savedProject;
    } catch (error) {
      console.log("error in add project", error);
      throw error;
    }
  }

  //  Update Project
  async updateProject(
    projectId: string,
    data: Partial<IUserProject>
  ): Promise<IUserProject | null> {
    return await userProjectModel.findByIdAndUpdate(projectId, data, {
      new: true,
    });
  }

  //  Delete Project
  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    try {
      const deletedProject = await userProjectModel.findByIdAndDelete(
        projectId
      );
      if (!deletedProject) {
        throw new Error("no projects found");
      }
      await userModel.findByIdAndUpdate(userId, {
        $pull: { projects: projectId },
      });

      return true;
    } catch (error) {
      console.log("error in delete projects", error);
      return false;
    }
  }

  //  Add Certificate
  async addCertificate(
    userId: string,
    certificate: IUserCertificate
  ): Promise<IUserCertificate> {
    try {
      const newCertificate = new userCertificateModel({
        ...certificate,
        userId,
      });
      const savedCertificate = await newCertificate.save();

      await userModel.findByIdAndUpdate(
        userId,
        { $push: { certifications: savedCertificate._id } },
        { new: true }
      );

      return savedCertificate;
    } catch (error) {
      console.log("error in add certificates", error);
      throw error;
    }
  }

  //  Update Certificate
  async updateCertificate(
    certificateId: string,
    data: Partial<IUserCertificate>
  ): Promise<IUserCertificate | null> {
    return await userCertificateModel.findByIdAndUpdate(certificateId, data, {
      new: true,
    });
  }

  //  Delete Certificate
  async deleteCertificate(
    userId: string,
    certificateId: string
  ): Promise<boolean> {
    try {
      const deletedCertificates = await userCertificateModel.findByIdAndDelete(
        certificateId
      );
      if (!deletedCertificates) {
        throw new Error("certificates not found");
      }
      await userModel.findByIdAndUpdate(userId, {
        $pull: { certifications: certificateId },
      });

      return true;
    } catch (error) {
      console.log("erro in delete certificates", error);
      return false;
    }
  }
  // Get all educations for a user
  async getAllEducations(userId: string): Promise<IUserEducation[]> {
    return await userEducationModel.find({ userId });
  }

  // Get all experiences for a user
  async getAllExperiences(userId: string): Promise<IUserExperience[]> {
    return await userExperienceModel.find({ userId });
  }

  // Get all projects for a user
  async getAllProjects(userId: string): Promise<IUserProject[]> {
    return await userProjectModel.find({ userId });
  }

  // Get all certificates for a user
  async getAllCertificates(userId: string): Promise<IUserCertificate[]> {
    return await userCertificateModel.find({ userId });
  }
}
