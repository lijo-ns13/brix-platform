import { useParams } from "react-router-dom";
import { JobService } from "../services/jobServices";
import { useEffect, useState } from "react";
function JobApplicantsPage() {
  useEffect(() => {
    if (jobId) {
      fetchApplicants(jobId);
    }
  }, []);
  const { jobId } = useParams<{ jobId: string }>();
  const [page, setPage] = useState(1);

  async function fetchApplicants(jobId: string) {
    const res = await JobService.getJobApplicants(jobId, page, 10);
    console.log("res", res);
  }
  return <div>JobApplicantsPage</div>;
}

export default JobApplicantsPage;
