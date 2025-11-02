import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface SignInFormProps {
  onSignInSuccess?: () => void;
  redirectTo?: string;
}

/**
 * Sign in form with GitHub, Google, and email/password authentication
 * Styled with NVC principles - encouraging and welcoming
 */
export function SignInForm({ onSignInSuccess, redirectTo }: SignInFormProps) {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get redirect destination from search params or prop
  const searchParams = useSearch({ strict: false });
  const from = redirectTo || (searchParams as Record<string, unknown>)?.from || "/practice";

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignup) {
        await signIn("password", { email, password, flow: "signUp" });
      } else {
        await signIn("password", { email, password, flow: "signIn" });
      }
      onSignInSuccess?.();
      // Add small delay to ensure auth state is updated
      setTimeout(() => {
        navigate({ to: from as string });
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHub = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signIn("github");
      onSignInSuccess?.();
      // Add small delay to ensure auth state is updated
      setTimeout(() => {
        navigate({ to: from as string });
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "GitHub sign-in failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Uncomment when Google OAuth is configured
  // const handleGoogle = async () => {
  //   setError(null);
  //   setIsLoading(true);
  //   try {
  //     await signIn("google");
  //     onSignInSuccess?.();
  //   } catch (err) {
  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : "Google sign-in failed. Please try again."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600">
              {isSignup
                ? "Join us on a journey toward compassionate communication"
                : "Continue your practice in Non-Violent Communication"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGitHub}
              disabled={isLoading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              {isLoading ? "Connecting..." : "Continue with GitHub"}
            </Button>

            {/* Uncomment when Google OAuth is configured
            <Button
              onClick={handleGoogle}
              disabled={isLoading}
              className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-medium transition-colors"
            >
              {isLoading ? "Connecting..." : "Continue with Google"}
            </Button>
            */}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "Create a password" : "Enter your password"}
                required
                minLength={isSignup ? 8 : 1}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              {isSignup && (
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 8 characters for security
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              {isLoading
                ? "Please wait..."
                : isSignup
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          {/* Toggle Form */}
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              {isSignup ? "Already have an account?" : "New to NVC Learning?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError(null);
                  setEmail("");
                  setPassword("");
                }}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                disabled={isLoading}
              >
                {isSignup ? "Sign in" : "Create account"}
              </button>
            </p>
          </div>

          {/* Info Message */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              By signing in, you agree to practice compassionate communication.
              This is a safe, judgment-free space to grow.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
