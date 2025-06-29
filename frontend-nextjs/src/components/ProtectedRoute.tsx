"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "USER" | "ADMIN";
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireRole,
  redirectTo = "/auth/login",
}) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`${redirectTo}?returnUrl=${pathname}`);
      return;
    }

    if (requireRole && user?.role !== requireRole) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, requireRole, redirectTo, router, pathname]);

  if (!isAuthenticated || (requireRole && user?.role !== requireRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
