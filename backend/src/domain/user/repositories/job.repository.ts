import jobModel from "../../../shared/models/job.model";
import JobModel, {
  IJob,
  ApplicationStatus,
} from "../../../shared/models/job.model";
import { Types } from "mongoose";

export interface IJobRepository {
  getJob(jobId: string): Promise<any>;
  getAllJobs(): Promise<IJob[]>;
  applyToJob(jobId: string, userId: string, resumeUrl: string): Promise<IJob>;
}

export class JobRepository implements IJobRepository {
  async getJob(jobId: string) {
    return jobModel
      .find({
        status: "open",
        _id: jobId,
        applicationDeadline: { $gte: new Date() },
      })
      .populate([
        { path: "skillsRequired" },
        { path: "company", select: "-password -documents" },
      ]);
  }
  async getAllJobs(): Promise<IJob[]> {
    return JobModel.find({
      status: "open",
      applicationDeadline: { $gte: new Date() },
    })
      .populate([
        { path: "skillsRequired" },
        { path: "company", select: "-password -documents" },
      ])
      .sort({ createdAt: -1 });
  }

  async applyToJob(
    jobId: string,
    userId: string,
    resumeUrl: string
  ): Promise<IJob> {
    const job = await JobModel.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const alreadyApplied = job.applications.find(
      (app) => app.user.toString() === userId
    );

    if (alreadyApplied) {
      throw new Error("User has already applied for this job");
    }

    const newApplication = {
      user: new Types.ObjectId(userId),
      appliedAt: new Date(),
      resumeUrl,
      status: ApplicationStatus.APPLIED,
      statusHistory: [
        {
          status: ApplicationStatus.APPLIED,
          changedAt: new Date(),
        },
      ],
    };

    job.applications.push(newApplication);
    await job.save();

    return job;
  }
}
