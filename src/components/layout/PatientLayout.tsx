import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav } from "./MobileNav";
import { Loader2 } from "lucide-react";

export function PatientLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <MobileNav />
    </div>
  );
}
