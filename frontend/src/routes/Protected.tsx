import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { JSX } from "react";
import { isExpired } from "../utils/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
  SpecificRole: "admin" | "company" | "user";
  redirectPath: string;
}

const Protected = ({
  children,
  SpecificRole,
  redirectPath,
}: ProtectedRouteProps) => {
  const { role, accessToken, logout } = useAuthStore();
  const location = useLocation();

  const tokenExpired = isExpired(accessToken);

  if (tokenExpired) {
    logout(); // Clear auth state
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (!role || role !== SpecificRole) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default Protected;
