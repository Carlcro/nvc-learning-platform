import { useEffect } from "react";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { useLocation } from "@tanstack/react-router";
import { api } from "../../../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component that protects routes from unauthenticated access
 * Shows SignInForm for unauthenticated users
 * Ensures the user's progress record exists on first login
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const userProfile = useQuery(api.users.getUserProfile);
  const location = useLocation();

  if (userProfile === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-giraffe-50">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-giraffe-200 border-t-giraffe-600 rounded-full mx-auto" />
          <p className="text-brown-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Authenticated>
        <ProgressInitializer>{children}</ProgressInitializer>
      </Authenticated>

      <Unauthenticated>
        {fallback || <SignInForm redirectTo={location.pathname} />}
      </Unauthenticated>
    </>
  );
}

/**
 * Ensures the signed-in user has a progress record (idempotent, runs once
 * per mount). Children render immediately; nothing downstream requires the
 * record to exist before its first read.
 */
function ProgressInitializer({ children }: { children: ReactNode }) {
  const initProfile = useMutation(api.users.initializeUserProfile);

  useEffect(() => {
    initProfile().catch((error) => {
      console.error("Failed to initialize progress:", error);
    });
  }, [initProfile]);

  return <>{children}</>;
}

