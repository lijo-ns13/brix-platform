import { Routes, Route } from "react-router-dom";
// auth pages
import SignIn from "../features/admin/pages/SignIn";

// protectedpages
import Dashboard from "../features/admin/pages/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import Protected from "./Protected";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* auth */}
      <Route path="/signin" element={<SignIn />} />

      <Route
        element={
          <Protected SpecificRole="admin" redirectPath="/admin/signin">
            <AdminLayout />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
