import userAxios from "../../../utils/userAxios";

const API_BASE_URL = "http://localhost:3000/jobs";

// get all jobs
export const getJobs = async () => {
  const response = await userAxios.get(`${API_BASE_URL}`);
  return response.data;
};
// get one job
export const getJob = async (jobId: string) => {
  const response = await userAxios.get(`${API_BASE_URL}/${jobId}`);
  return response.data;
};
export const applyJob = async (jobId: string, resumeUrl: string) => {
  const response = await userAxios.post(
    `${API_BASE_URL}/${jobId}/apply`,
    { resumeUrl },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
