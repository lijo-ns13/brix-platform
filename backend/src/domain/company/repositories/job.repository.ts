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
  async getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: IJob[]; total: number }> {
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      JobModel.find({ company: companyId })
        .skip(skip)
        .limit(limit)
        .populate("skillsRequired")
        .sort({ createdAt: -1 })
        .exec(),
      JobModel.countDocuments({ company: companyId }),
    ]);
    return { jobs, total };
  }

  async getJobApplications(
    jobId: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ applications: any[]; total: number } | null> {
    const skip = (page - 1) * limit;

    const result = await JobModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(jobId),
          company: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $project: {
          applications: 1,
        },
      },
      {
        $unwind: "$applications",
      },
      {
        $sort: { "applications.appliedAt": -1 }, // optional: sort by latest
      },
      {
        $facet: {
          paginatedApplications: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "users",
                localField: "applications.user",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $unwind: "$userData",
            },
            {
              $project: {
                _id: "$applications._id",
                resumeUrl: "$applications.resumeUrl",
                status: "$applications.status",
                statusHistory: "$applications.statusHistory",
                appliedAt: "$applications.appliedAt",
                user: "$userData",
              },
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
      {
        $project: {
          applications: "$paginatedApplications",
          total: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
          },
        },
      },
    ]);

    return result.length > 0
      ? { applications: result[0].applications, total: result[0].total }
      : null;
  }

  async getJob(jobId: string) {
    return await JobModel.findById(jobId).populate("skillsRequired");
  }
}
