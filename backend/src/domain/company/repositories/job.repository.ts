import {
  IJobRepository,
  CreateJobDto,
  UpdateJobDto,
} from "../interfaces/IJobRepository";
import JobModel, { IJob } from "../../../shared/models/job.model";
import mongoose from "mongoose";

export class JobRepository implements IJobRepository {
  async createJob(
    createJobDto: CreateJobDto,
    companyId: string
  ): Promise<IJob> {
    const job = new JobModel({
      ...createJobDto,
      company: new mongoose.Types.ObjectId(companyId),
    });
    return await job.save();
  }

  async updateJob(
    jobId: string,
    companyId: string,
    updateJobDto: UpdateJobDto
  ): Promise<IJob | null> {
    const job = await JobModel.findOneAndUpdate(
      { _id: jobId, company: companyId },
      { $set: updateJobDto },
      { new: true }
    );
    return job;
  }

  async deleteJob(jobId: string, companyId: string): Promise<boolean> {
    const result = await JobModel.deleteOne({ _id: jobId, company: companyId });
    return result.deletedCount === 1;
  }
}
