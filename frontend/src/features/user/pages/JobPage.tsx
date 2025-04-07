import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/JobServices";

function JobPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await getJobs();
      setJobs(res);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        jobs.map((job: any) => (
          <Link
            to={`/jobs/${job._id}`}
            key={job._id}
            className="block border rounded p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">
              {job.description.slice(0, 100)}...
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Posted on: {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))
      )}
    </div>
  );
}

export default JobPage;
