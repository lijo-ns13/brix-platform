import { Request, RequestHandler, Response } from "express";
import { JobService } from "../services/job.service";
import { JobRepository } from "../repositories/job.repository";
import { UserRepository } from "../repositories/user.repository";
import { HTTP_STATUS_CODES } from "../../../shared/constants/httpStatusCode";

const jobRepository = new JobRepository();
const userRepository = new UserRepository();
const jobService = new JobService(jobRepository, userRepository);
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
    res.status(HTTP_STATUS_CODES.OK).json(jobs);
  } catch (error: any) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
export const getJob: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await jobService.getJob(jobId);
    console.log("jobs", job);
    res.status(HTTP_STATUS_CODES.OK).json(job);
  } catch (error: any) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
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
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: "User not authenticated or user ID missing" });
      return;
    }

    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: "Resume URL is required" });
      return;
    }

    const updatedJob = await jobService.applyToJob(jobId, userId, resumeUrl);
    res.status(HTTP_STATUS_CODES.OK).json(updatedJob);
  } catch (error: any) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
export const getSavedJobs: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user as Userr;
    const savedJobs = await jobService.getSavedJobs(user.id);
    res.status(HTTP_STATUS_CODES.OK).json(savedJobs);
  } catch (error: any) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getAppliedJobs: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user as Userr;
    const appliedJobs = await jobService.getAppliedJobs(user.id);
    res.status(HTTP_STATUS_CODES.OK).json(appliedJobs);
  } catch (error: any) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const saveJob: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const user = req.user as Userr;
    await jobService.addToSavedJobs(user.id, jobId);
    res
      .status(HTTP_STATUS_CODES.OK)
      .json({ message: "Job saved successfully" });
  } catch (error: any) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const unsaveJob: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { jobId } = req.params;
    const user = req.user as Userr;
    await jobService.removeFromSavedJobs(user.id, jobId);
    res
      .status(HTTP_STATUS_CODES.OK)
      .json({ message: "Job removed from saved jobs" });
  } catch (error: any) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
