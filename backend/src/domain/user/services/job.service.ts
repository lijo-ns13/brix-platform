import { IJob } from "../../../shared/models/job.model";
import { IJobRepository } from "../repositories/job.repository";

export interface IJobService {
  getAllJobs(): Promise<IJob[]>;
  applyToJob(jobId: string, userId: string, resumeUrl: string): Promise<IJob>;
}

export class JobService implements IJobService {
  constructor(private readonly jobRepository: IJobRepository) {}

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
    return this.jobRepository.applyToJob(jobId, userId, resumeUrl);
  }
}
