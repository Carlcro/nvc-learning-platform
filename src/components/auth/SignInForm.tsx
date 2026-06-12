import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface SignInFormProps {
  onSignInSuccess?: () => void
  redirectTo?: string
}

/**
 * Maps raw Convex Auth errors to encouraging, human-friendly messages.
 * The server surfaces internal codes like "InvalidSecret" / "InvalidAccountId"
 * which should never be shown to the person practicing communication.
 */
function friendlyAuthError(err: unknown, isSignup: boolean): string {
  const raw = err instanceof Error ? err.message : String(err ?? '')

  if (/InvalidSecret|InvalidAccountId|Invalid credentials/i.test(raw)) {
    return 'That email and password don\'t match an account. Please double-check them, or create a new account below.'
  }
  if (/TooManyFailedAttempts/i.test(raw)) {
    return 'Too many attempts for now. Please wait a moment and try again.'
  }
  if (/Invalid password/i.test(raw)) {
    return 'Please choose a password with at least 8 characters.'
  }
  if (/already.*exist|account.*exist/i.test(raw)) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  return isSignup
    ? 'We couldn\'t create your account just now. Please try again.'
    : 'We couldn\'t sign you in just now. Please try again.'
}

/**
 * Sign in form with GitHub, Google, and email/password authentication
 * Styled with NVC principles - encouraging and welcoming
 */
export function SignInForm({ onSignInSuccess, redirectTo }: SignInFormProps) {
  const { signIn } = useAuthActions()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get redirect destination from search params or prop
  const searchParams = useSearch({ strict: false })
  const from =
    redirectTo || (searchParams as Record<string, unknown>)?.from || '/practice'

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isSignup) {
        await signIn('password', { email, password, flow: 'signUp' })
      } else {
        await signIn('password', { email, password, flow: 'signIn' })
      }
      onSignInSuccess?.()
      // Add small delay to ensure auth state is updated
      setTimeout(() => {
        navigate({ to: from as string })
      }, 500)
    } catch (err) {
      setError(friendlyAuthError(err, isSignup))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHub = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await signIn('github')
      onSignInSuccess?.()
      // Add small delay to ensure auth state is updated
      setTimeout(() => {
        navigate({ to: from as string })
      }, 500)
    } catch (err) {
      setError(friendlyAuthError(err, isSignup))
    } finally {
      setIsLoading(false)
    }
  }

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
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-giraffe-100 to-giraffe-50 p-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left side - Giraffe & Welcome Message */}

          <div className="flex flex-col items-center md:items-center space-y-10">
            {/* Welcome Speech Bubble - Larger & More Spacious */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-giraffe-200 relative w-full">
              <p className="text-brown-800 text-center font-medium leading-relaxed text-lg">
                {isSignup
                  ? "Welcome! I'm excited to help you develop more compassionate communication skills. Let's get started on this meaningful journey together."
                  : "Welcome back! I'm glad you're continuing your practice in compassionate communication. You're building something beautiful."}
              </p>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
            {/* Giraffe Image - Larger */}
            <div className="w-full">
              <img
                src="/giraff.png"
                alt="Your Compassionate Communication Guide"
                className="h-80 w-auto object-contain mx-auto md:mx-0 scale-x-[-1]"
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full">
            <Card className="w-full shadow-2xl">
              <div className="p-10 space-y-1">
                {/* Header - Better Hierarchy */}
                <div className="space-y-4 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-brown-800">
                    {isSignup ? 'Create Your Account' : 'Sign in'}
                  </h1>
                  <p className="text-brown-600 text-lg leading-relaxed">
                    {isSignup
                      ? 'Join our community of compassionate communicators'
                      : 'Continue practicing compassionate communication'}
                  </p>
                </div>

                {/* Error Message - Better Visibility */}
                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {/* OAuth Buttons - Larger & More Spacious */}
                <div className="space-y-4 pt-2">
                  <Button
                    onClick={handleGitHub}
                    disabled={isLoading}
                    className="w-full bg-giraffe-600 hover:bg-giraffe-700 text-white py-3.5 rounded-xl font-medium transition-colors text-base shadow-md"
                  >
                    {isLoading ? 'Connecting...' : 'Continue with GitHub'}
                  </Button>
                </div>

                {/* Divider - More Spacious */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-giraffe-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-brown-600 font-medium">
                      or with email
                    </span>
                  </div>
                </div>

                {/* Email/Password Form - Larger Inputs */}
                <form onSubmit={handleEmailAuth} className="space-y-6">
                  <div>
                    <label className="block text-base font-semibold text-brown-800 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-5 py-3.5 border-2 border-giraffe-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-giraffe-500 focus:border-transparent bg-giraffe-50 text-base transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-brown-800 mb-3">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        isSignup ? 'Create a password' : 'Enter your password'
                      }
                      required
                      minLength={isSignup ? 8 : 1}
                      className="w-full px-5 py-3.5 border-2 border-giraffe-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-giraffe-500 focus:border-transparent bg-giraffe-50 text-base transition-all"
                      disabled={isLoading}
                    />
                    {isSignup && (
                      <p className="text-sm text-brown-600 mt-3 font-medium">
                        Minimum 8 characters for security
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-giraffe-600 hover:bg-giraffe-700 text-white py-3.5 rounded-xl font-semibold transition-colors text-base shadow-md mt-8"
                  >
                    {isLoading
                      ? 'Please wait...'
                      : isSignup
                        ? 'Create Account'
                        : 'Sign In'}
                  </Button>
                </form>

                {/* Toggle Form - Better Spacing */}
                <div className="text-center pt-4">
                  <p className="text-brown-700">
                    {isSignup
                      ? 'Already have an account? '
                      : 'New to compassionate communication? '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignup(!isSignup)
                        setError(null)
                        setEmail('')
                        setPassword('')
                      }}
                      className="text-giraffe-600 hover:text-giraffe-700 font-bold text-base transition-colors underline-offset-2 hover:underline"
                      disabled={isLoading}
                    >
                      {isSignup ? 'Sign in' : 'Create account'}
                    </button>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
