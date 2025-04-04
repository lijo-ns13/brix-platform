import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
// auth realted
import SignInPage from "../features/user/pages/SignInPage";
import SignUpPage from "../features/user/pages/SignUpPage";
import ForgetPasswordPage from "../features/user/pages/ForgetPasswordPage";
import ResetPasswordPage from "../features/user/pages/ResetPasswordPage";
import VerifyEmail from "../features/user/pages/VerifyEmail";
// protected pages
import FeedPage from "../features/user/pages/FeedPage";
import Protected from "./Protected";
import OAuthSuccessPage from "../features/user/pages/OAuthSuccess";
import ProfilePage from "../features/user/pages/ProfilePage";
const UserRoutes = () => {
  // get user role  from store here this
  return (
    <Routes>
      {/* user auth pages */}
      <Route path="login" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="verify-otp" element={<VerifyEmail />} />
      <Route path="forget-password" element={<ForgetPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="/oauth-success" element={<OAuthSuccessPage />} />

      {/* Protected + user layout */}
      <Route
        element={
          <Protected SpecificRole="user" redirectPath="/login">
            <UserLayout />
          </Protected>
        }
      >
        {/* we can write other user routes like dahsboard,profeliall proetected */}
        <Route path="feed" element={<FeedPage />} />
      </Route>
      {/* Protected + no user layout */}
      <Route
        path="user-profile"
        element={
          <Protected SpecificRole="user" redirectPath="/login">
            <ProfilePage />
          </Protected>
        }
      ></Route>
    </Routes>
  );
};
export default UserRoutes;
