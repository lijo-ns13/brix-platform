// src/modules/job/services/JobService.ts

import { IJobRepository } from "../interfaces/IJobRepository";
import { CreateJobDto, UpdateJobDto } from "../interfaces/IJobRepository";
import { IJob } from "../../../shared/models/job.model";

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
}
