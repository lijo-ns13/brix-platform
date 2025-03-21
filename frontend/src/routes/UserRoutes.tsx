import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
// auth realted
import SignInPage from "../features/user/pages/SignInPage";
import SignUpPage from "../features/user/pages/SignUpPage";
// protected pages
import FeedPage from "../features/user/pages/FeedPage";
import VerifyEmail from "../features/user/pages/VerifyEmail";
import Protected from "./Protected";
const UserRoutes = () => {
  // get user role  from store here this
  return (
    <Routes>
      {/* user auth pages */}
      <Route path="login" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="verify-otp" element={<VerifyEmail />} />
      {/* Protected + user layout */}
      <Route
        element={
          <Protected SpecificRole="user" redirectPath="/signin">
            <UserLayout />
          </Protected>
        }
      >
        {/* we can write other user routes like dahsboard,profeliall proetected */}
        <Route path="feed" element={<FeedPage />} />
      </Route>
    </Routes>
  );
};
export default UserRoutes;
