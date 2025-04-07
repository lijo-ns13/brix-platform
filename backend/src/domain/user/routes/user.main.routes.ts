import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/auth.middleware";
import { applyToJob, getAllJobs, getJob } from "../controllers/job.controller";
const router = Router();

router.use(authenticate("user"));

router.get("/jobs", getAllJobs);

router.post("/jobs/:jobId/apply", applyToJob);
router.get("/jobs/:jobId", getJob);
export default router;
