// src/modules/job/controllers/JobController.ts

import { Request, Response, RequestHandler } from "express";
import { JobService } from "../services/job.service";
import { createJobSchema, updateJobSchema } from "../dtos/job.validation";
import { HTTP_STATUS_CODES } from "../../../shared/constants/httpStatusCode";
import skillModel from "../../../shared/models/skill.model";
import { ZodError } from "zod";

interface Userr {
  id: string;
  email: string;
  role: string;
}
export class JobController {
  constructor(private readonly jobService: JobService) {}

  createJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id; // assuming company is authenticated and available
      if (!companyId) {
        res.status(400).json({ message: "no company id" });
        return;
      }
      const skillsId = [];
      const skills = req.body.skillsRequired;
      for (const skill of skills) {
        const skillIn = await skillModel.findOne({ title: skill });
        if (!skillIn) {
          const newSkill = new skillModel({ title: skill });
          await newSkill.save();
          skillsId.push(newSkill._id);
        } else {
          skillsId.push(skillIn._id);
        }
      }
      console.log("req.boyd", req.body);
      const jobData = {
        title: req.body.title,
        location: req.body.location,
        jobType: req.body.jobType,
        employmentType: req.body.employmentType,
        description: req.body.description,
        salary: req.body.salary,
        benefits: req.body.benefits,
        experienceLevel: req.body.experienceLevel,
        applicationDeadline: req.body.applicationDeadline,
        skillsRequired: skillsId,
        createdBy: companyId,
      };
      console.log("jobData", jobData);
      // in req.body skillsRequired =["",""] if any one of skills not in skill modal add to them that adn store that skills id into job collection not entire req.body in that skills are in string user entered
      const validatedData = createJobSchema.parse(jobData);
      console.log("isValidateData", validatedData);

      const job = await this.jobService.createJob(validatedData, companyId);
      res.status(201).json({ message: "Job created successfully", job });
    } catch (err: any) {
      if (err instanceof ZodError) {
        const errObj: Record<string, string> = {};
        err.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, error: err.message });
      }
    }
  };

  updateJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id;
      if (!companyId) {
        res.status(400).json({ message: "no company id" });
        return;
      }
      const jobId = req.params.jobId;
      const validatedData = updateJobSchema.parse(req.body);
      const updatedJob = await this.jobService.updateJob(
        jobId,
        companyId,
        validatedData
      );
      if (!updatedJob) {
        res.status(404).json({ message: "Job not found or unauthorized" });
        return;
      }
      res.status(200).json({ message: "Job updated successfully", updatedJob });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  deleteJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id;
      if (!companyId) {
        res.status(400).json({ message: "no company id" });
        return;
      }
      const jobId = req.params.jobId;
      const deleted = await this.jobService.deleteJob(jobId, companyId);
      if (!deleted) {
        res.status(404).json({ message: "Job not found or unauthorized" });
        return;
      }
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
  getJobs: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id;
      if (!companyId) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "Company ID required" });
        return;
      }

      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

      const { jobs, total } = await this.jobService.getJobs(
        companyId,
        page,
        limit
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: jobs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err: any) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: err.message });
    }
  };

  getJobApplications: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id;
      if (!companyId) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "Company ID required" });
        return;
      }

      const jobId = req.params.jobId;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

      const result = await this.jobService.getJobApplications(
        jobId,
        companyId,
        page,
        limit
      );
      if (!result) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: "Job not found" });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: result.applications,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err: any) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: err.message });
    }
  };
}
