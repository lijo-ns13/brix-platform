import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/auth.middleware";
import {
  applyToJob,
  getAllJobs,
  getJob,
  getSavedJobs,
  getAppliedJobs,
  saveJob,
  unsaveJob,
} from "../controllers/job.controller";

const router = Router();

// All routes below require user authentication
router.use(authenticate("user"));

// Get all jobs
router.get("/jobs", getAllJobs);

// Get a specific job by ID
router.get("/jobs/:jobId", getJob);

// Apply to a job
router.post("/jobs/:jobId/apply", applyToJob);

// Get all jobs saved by the user
router.get("/saved-jobs", getSavedJobs);

// Save a job
router.post("/jobs/:jobId/save", saveJob);

// Unsave a job
router.delete("/jobs/:jobId/unsave", unsaveJob);

// Get all jobs the user has applied to
router.get("/applied-jobs", getAppliedJobs);

export default router;
