import axios from "axios";
const BASE_URL = "http://localhost:3000/company/auth";
export const signUpCompany = async (
  companyName: string,
  email: string,
  about: string = "",
  foundedYear: number,
  businessNumber: number,
  industryType: string,
  documents: string[] = [],
  password: string,
  confirmPassword: string,
  location: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/signup`,
      {
        companyName,
        email,
        about,
        foundedYear,
        businessNumber,
        industryType,
        documents,
        password,
        confirmPassword,
        location,
      },
      { withCredentials: true }
    );

    const { success } = response.data;

    if (!success) {
      alert("Signinn failed");
      return;
    }

    alert("Signin successful");

    return { success };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "An error occurred during company signupy.";
    console.error("Signup error:", message);
    throw new Error(message);
  }
};
export const signInCompany = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/signin`,
      { email, password },
      { withCredentials: true }
    );

    const { success, accessToken, role, company } = response.data;

    if (!success) {
      alert("Signin failed");
      return;
    }
    return { accessToken, role, user: company };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "An error occurred during company signin.";
    console.error("Signin error:", message);
    throw new Error(message);
  }
};
export const verifyCompanyByOTP = async (email: string | null, otp: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/verify`,
      { email, otp },
      {
        withCredentials: true,
      }
    );
    const { success } = response.data;
    if (!success) {
      alert("failed");
      return;
    }
    alert("success");
  } catch (error) {
    console.log("error in serviced", error);
    throw error;
  }
};
export const resendOTP = async (email: string | null) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/resend`,
      { email },
      {
        withCredentials: true,
      }
    );
    const { success } = response.data;
    if (!success) {
      alert("failed");
      return;
    }
    alert("success");
  } catch (error) {
    console.log("errorin resned", error);
    throw error;
  }
};
