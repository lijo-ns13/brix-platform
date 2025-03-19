import axios from "axios";
const BASE_URL = "http://localhost:3000/admin/auth";
export const SignInAdmin = async (email: string, password: string) => {
  try {
    const result = axios.post(
      `${BASE_URL}/signin`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    const { accessToken, role, user } = (await result).data;
    return { accessToken, role, user };
  } catch (error: any) {
    console.log("error in admin signin", error);
    const message =
      error.response?.data?.message || "An error occurred during admin signin.";
    console.error("Signin error:", message);
    throw new Error(message);
  }
};
