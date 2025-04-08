import { IJob } from "../../../shared/models/job.model";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IJobRepository } from "../repositories/job.repository";

export interface IJobService {
  getAllJobs(): Promise<IJob[]>;
  applyToJob(jobId: string, userId: string, resumeUrl: string): Promise<IJob>;
}

export class JobService implements IJobService {
  constructor(
    private readonly jobRepository: IJobRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getAllJobs(): Promise<IJob[]> {
    return this.jobRepository.getAllJobs();
  }
  async getJob(jobId: string) {
    return this.jobRepository.getJob(jobId);
  }
  async applyToJob(
    jobId: string,
    userId: string,
    resumeUrl: string
  ): Promise<IJob> {
    const job = await this.jobRepository.applyToJob(jobId, userId, resumeUrl);
    await this.userRepository.addToAppliedJobs(userId, jobId);
    return job;
  }
  async getSavedJobs(userId: string): Promise<IJob[]> {
    const user = await this.userRepository.getSavedJobs(userId);
    return user?.savedJobs || [];
  }

  async getAppliedJobs(userId: string): Promise<IJob[]> {
    const user = await this.userRepository.getAppliedJobs(userId);
    return user?.appliedJobs || [];
  }

  async addToSavedJobs(userId: string, jobId: string): Promise<void> {
    await this.userRepository.addToSavedJobs(userId, jobId);
  }

  async removeFromSavedJobs(userId: string, jobId: string): Promise<void> {
    await this.userRepository.removeFromSavedJobs(userId, jobId);
  }
}
