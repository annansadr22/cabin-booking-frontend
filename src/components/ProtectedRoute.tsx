
import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface ProtectedRouteProps {
  role: "user" | "admin";
}

export const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { isAuthenticated: isUserAuthenticated } = useUserAuth();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();

  // Determine if the user is authenticated based on the required role
  const isAuthenticated = role === "user" ? isUserAuthenticated : isAdminAuthenticated;
  
  // Redirect to the appropriate login page if not authenticated
  if (!isAuthenticated) {
    const loginPath = role === "user" ? "/user/login" : "/admin/login";
    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
};
