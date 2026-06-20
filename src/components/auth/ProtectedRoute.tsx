import type { ReactNode } from "react";
import { useEffect } from "react";
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { useLocation } from "@tanstack/react-router";
import { api } from "../../../convex/_generated/api";
import { SignInForm } from "./SignInForm";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component that protects routes from unauthenticated access
 * Shows SignInForm for unauthenticated users
 * Ensures user profile is initialized on first login
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const userProfile = useQuery(api.users.getUserProfile);
  const location = useLocation();

  // Initialize user profile on first login if needed
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
        {/* Initialize profile if it doesn't exist */}
        {!userProfile?.profile ? (
          <ProfileInitializer>{children}</ProfileInitializer>
        ) : (
          children
        )}
      </Authenticated>

      <Unauthenticated>
        {fallback || <SignInForm redirectTo={location.pathname} />}
      </Unauthenticated>
    </>
  );
}

/**
 * Internal component that initializes user profile on first login
 */
function ProfileInitializer({ children }: { children: ReactNode }) {
  const initProfile = useMutation(api.users.initializeUserProfile);
  const userProfile = useQuery(api.users.getUserProfile);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initProfile();
      } catch (error) {
        console.error("Failed to initialize profile:", error);
      }
    };

    if (!userProfile?.profile) {
      initialize();
    }
  }, [initProfile, userProfile?.profile]);

  // Wait until profile is initialized
  if (!userProfile?.profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-giraffe-50">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-giraffe-200 border-t-giraffe-600 rounded-full mx-auto" />
          <p className="text-brown-700">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Loading skeleton for protected routes
 */
export function ProtectedRouteLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-giraffe-50 to-cream">
      <div className="text-center space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-giraffe-100 rounded w-32 mx-auto" />
          <div className="h-8 bg-giraffe-200 rounded w-48 mx-auto" />
          <div className="h-4 bg-giraffe-100 rounded w-40 mx-auto" />
        </div>
      </div>
    </div>
  );
}
