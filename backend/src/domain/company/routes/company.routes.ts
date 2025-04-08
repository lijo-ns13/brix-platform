// job routers

import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { JobService } from "../services/job.service";
import { JobRepository } from "../repositories/job.repository";
import { authenticate } from "../../../shared/middlewares/auth.middleware";

// Inject dependencies
const jobRepository = new JobRepository();
const jobService = new JobService(jobRepository);
const jobController = new JobController(jobService);

// Router
const router = Router();
router.use(authenticate("company"));
// Middlewares like auth can go here (e.g. isCompanyAuth)
router.post("/job", jobController.createJob);
router.put("/job/:jobId", jobController.updateJob);
router.delete("/job/:jobId", jobController.deleteJob);
router.get("/job", jobController.getJobs);
router.get("/job/:jobId/applications", jobController.getJobApplications);
router.get("/job/:jobId", jobController.getJob);
export default router;
