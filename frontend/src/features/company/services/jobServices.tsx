import companyAxios from "../../../utils/companyAxios";
const BASE_URL = "http://localhost:3000/company/job";

export const JobService = {
  async createJob(data: any) {
    const response = await companyAxios.post(BASE_URL, data, {
      withCredentials: true,
    });
    return response.data;
  },
  async updateJob() {},
  async editJob() {},
};
