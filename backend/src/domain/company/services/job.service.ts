// src/modules/job/services/JobService.ts

import { IJobRepository } from "../interfaces/IJobRepository";
import { CreateJobDto, UpdateJobDto } from "../interfaces/IJobRepository";
import { IJob, JobApplication } from "../../../shared/models/job.model";

export class JobService {
  constructor(private readonly jobRepository: IJobRepository) {}

  async createJob(
    createJobDto: CreateJobDto,
    companyId: string
  ): Promise<IJob> {
    return await this.jobRepository.createJob(createJobDto, companyId);
  }

  async updateJob(
    jobId: string,
    companyId: string,
    updateJobDto: UpdateJobDto
  ): Promise<IJob | null> {
    return await this.jobRepository.updateJob(jobId, companyId, updateJobDto);
  }

  async deleteJob(jobId: string, companyId: string): Promise<boolean> {
    return await this.jobRepository.deleteJob(jobId, companyId);
  }
  async getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: IJob[]; total: number }> {
    return await this.jobRepository.getJobs(companyId, page, limit);
  }

  async getJobApplications(
    jobId: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ applications: JobApplication[]; total: number } | null> {
    return await this.jobRepository.getJobApplications(
      jobId,
      companyId,
      page,
      limit
    );
  }
}
