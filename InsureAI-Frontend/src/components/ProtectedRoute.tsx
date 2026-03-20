import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const role = localStorage.getItem("role");
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // ✅ redirect to LandingPage
  }
  return <>{children}</>;
}