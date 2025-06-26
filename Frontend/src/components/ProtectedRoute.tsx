import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "USER" | "ADMIN";
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireRole,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean | null>(
    null
  );

  // Check admin authentication from localStorage and verify token
  useEffect(() => {
    if (requireRole === "ADMIN" || location.pathname.startsWith("/admin")) {
      const isAdminAuth =
        localStorage.getItem("isAdminAuthenticated") === "true";
      const adminToken = localStorage.getItem("adminToken");
      const adminUser = localStorage.getItem("adminUser");

      if (isAdminAuth && adminToken && adminUser) {
        // Verify token with backend (optional - can be implemented later)
        setAdminAuthenticated(true);
      } else {
        setAdminAuthenticated(false);
        // Clear invalid auth data
        localStorage.removeItem("isAdminAuthenticated");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    } else {
      setAdminAuthenticated(null);
    }
  }, [requireRole, location.pathname]);

  // Show loading spinner while checking authentication
  if (isLoading || (requireRole === "ADMIN" && adminAuthenticated === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle admin routes
  if (requireRole === "ADMIN" || location.pathname.startsWith("/admin")) {
    if (!adminAuthenticated) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  // Handle regular user routes
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requireRole === "USER" && user?.role !== "USER") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
