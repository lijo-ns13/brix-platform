import { Request, RequestHandler, Response } from "express";
import { JobService } from "../services/job.service";
import { JobRepository } from "../repositories/job.repository";

const jobRepository = new JobRepository();
const jobService = new JobService(jobRepository);
interface Userr {
  id: string;
  email: string;
  role: string;
}
export const getAllJobs: RequestHandler = async (
  _req: Request,
  res: Response
) => {
  try {
    const jobs = await jobService.getAllJobs();
    console.log("jobs", jobs);
    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getJob: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await jobService.getJob(jobId);
    console.log("jobs", job);
    res.status(200).json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const applyToJob: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { jobId } = req.params;
    const userId = (req.user as Userr)?.id; // Assuming auth middleware adds req.user

    if (!userId) {
      res
        .status(401)
        .json({ message: "User not authenticated or user ID missing" });
      return;
    }

    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      res.status(400).json({ message: "Resume URL is required" });
      return;
    }

    const updatedJob = await jobService.applyToJob(jobId, userId, resumeUrl);
    res.status(200).json(updatedJob);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
