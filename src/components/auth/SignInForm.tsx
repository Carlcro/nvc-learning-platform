import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { SpeechBubble } from '../ui/SpeechBubble'

interface SignInFormProps {
  onSignInSuccess?: () => void
  redirectTo?: string
}

type Mode = 'signIn' | 'signUp' | 'resetRequest' | 'resetVerify'

const inputClasses =
  'w-full px-5 py-3.5 border-2 border-giraffe-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-giraffe-500 focus:border-transparent bg-giraffe-50 text-base transition-all'

const submitClasses =
  'w-full bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 py-3.5 rounded-xl font-semibold transition-colors text-base mt-8'

/**
 * Maps raw Convex Auth errors to encouraging, human-friendly messages.
 * The server surfaces internal codes like "InvalidSecret" / "InvalidAccountId"
 * which should never be shown to the person practicing communication.
 *
 * Convex Auth raises these as plain Errors, and Convex redacts plain Error
 * messages to "Server Error" on production deployments. The specific cases
 * below therefore only match in development, so each fallback has to stand on
 * its own and name the likely causes rather than just saying to try again.
 */
function friendlyAuthError(err: unknown, mode: Mode): string {
  const raw = err instanceof Error ? err.message : String(err ?? '')

  if (/Invalid code|InvalidSecret.*verification/i.test(raw)) {
    return 'That code did not match, or it has expired. You can send yourself a new one.'
  }
  if (/InvalidSecret|InvalidAccountId|Invalid credentials/i.test(raw)) {
    return "That email and password don't match an account. Please double-check them, or create a new account below."
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

  switch (mode) {
    case 'signUp':
      return "We couldn't create your account. That email may already have one, or the password may be under 8 characters."
    case 'resetRequest':
      return "We couldn't start the reset just now. Please try again in a moment."
    case 'resetVerify':
      return "We couldn't update your password. The code may not match, or it may have expired. You can send yourself a new one."
    default:
      return "We couldn't sign you in. Please check your email and password. If you are not sure of your password, you can reset it."
  }
}

const headings: Record<Mode, { title: string; subtitle: string }> = {
  signIn: {
    title: 'Sign in',
    subtitle: 'Your conversations and progress are saved to your account',
  },
  signUp: {
    title: 'Create Your Account',
    subtitle: 'Your practice stays private to you',
  },
  resetRequest: {
    title: 'Reset your password',
    subtitle: 'We will email you a code to set a new one',
  },
  resetVerify: {
    title: 'Choose a new password',
    subtitle: 'Enter the code we emailed you, and your new password',
  },
}

const welcomeMessages: Record<Mode, string> = {
  signIn:
    "Practice conversations are saved to your account, so you can come back to them. New here? Create an account at the bottom, it only takes a moment.",
  signUp:
    "Glad you're here. Once you have an account, you can rehearse any scenario as many times as you like.",
  resetRequest:
    "It happens to everyone. Give me the address you signed up with and I'll send you a code so you can get back to your practice.",
  resetVerify:
    "Almost there. Pop in the code from your inbox, choose a new password, and you're back where you left off.",
}

/**
 * Sign in form with GitHub and email/password, including password reset.
 * Styled with NVC principles - encouraging and welcoming
 */
export function SignInForm({ onSignInSuccess, redirectTo }: SignInFormProps) {
  const { signIn } = useAuthActions()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  // Separate loading states so starting email sign-in does not make the
  // GitHub button read "Connecting..." (and vice versa).
  const [emailLoading, setEmailLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const isLoading = emailLoading || githubLoading
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const isPasswordMode = mode === 'signIn' || mode === 'signUp'

  // Get redirect destination from search params or prop
  const searchParams = useSearch({ strict: false })
  const from =
    redirectTo || (searchParams as Record<string, unknown>).from || '/practice'

  const goTo = (next: Mode) => {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  const finishSignIn = () => {
    onSignInSuccess?.()
    // Tokens are set once signIn resolves, so we can navigate straight away.
    navigate({ to: from as string, replace: true })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setEmailLoading(true)

    try {
      if (mode === 'signUp') {
        await signIn('password', { email, password, flow: 'signUp' })
        finishSignIn()
      } else if (mode === 'signIn') {
        await signIn('password', { email, password, flow: 'signIn' })
        finishSignIn()
      } else if (mode === 'resetRequest') {
        try {
          await signIn('password', { email, flow: 'reset' })
        } catch {
          // Deliberately swallowed: the server tells us whether an account
          // exists, and passing that on would turn this form into a way to
          // check which addresses are registered. The next step looks the
          // same either way.
        }
        setMode('resetVerify')
        setNotice(
          'If that address has an account, a code is on its way. It can take a moment to arrive.',
        )
      } else {
        await signIn('password', {
          email,
          code,
          newPassword,
          flow: 'reset-verification',
        })
        finishSignIn()
      }
    } catch (err) {
      setError(friendlyAuthError(err, mode))
    } finally {
      setEmailLoading(false)
    }
  }

  const handleGitHub = async () => {
    setError(null)
    setNotice(null)
    setGithubLoading(true)
    try {
      // OAuth triggers a full-page redirect to GitHub and back. Telling Convex
      // where to land afterwards sends the person straight into the app instead
      // of bouncing through the home page or flashing the sign-in form again.
      await signIn('github', { redirectTo: from as string })
      onSignInSuccess?.()
    } catch (err) {
      setError(friendlyAuthError(err, mode))
      setGithubLoading(false)
    }
  }

  const submitLabel = () => {
    if (emailLoading) return 'Please wait...'
    switch (mode) {
      case 'signUp':
        return 'Create Account'
      case 'resetRequest':
        return 'Email me a code'
      case 'resetVerify':
        return 'Update password and sign in'
      default:
        return 'Sign In'
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-giraffe-100 to-giraffe-50 p-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left side - Giraffe & Welcome Message */}
          <div className="flex flex-col items-center space-y-10">
            <SpeechBubble className="w-full">
              <p className="text-brown-800 text-center font-medium leading-relaxed text-lg">
                {welcomeMessages[mode]}
              </p>
            </SpeechBubble>
            <div className="hidden md:block w-full">
              <img
                src="/giraff.png"
                alt="The giraffe, your guide"
                className="h-80 w-auto object-contain mx-auto md:mx-0 scale-x-[-1]"
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full">
            <Card className="w-full shadow-md">
              <div className="p-6 sm:p-10 space-y-1">
                <div className="space-y-4 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-brown-800">
                    {headings[mode].title}
                  </h1>
                  <p className="text-brown-600 text-lg leading-relaxed">
                    {headings[mode].subtitle}
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-empathy-low/15 border-2 border-empathy-low/40 rounded-lg">
                    <p className="text-empathy-low font-medium">{error}</p>
                  </div>
                )}

                {notice && (
                  <div className="p-4 bg-giraffe-100 border-2 border-giraffe-300 rounded-lg">
                    <p className="text-brown-800 font-medium">{notice}</p>
                  </div>
                )}

                {isPasswordMode && (
                  <>
                    <div className="space-y-4 pt-2">
                      <Button
                        onClick={handleGitHub}
                        disabled={isLoading}
                        variant="secondary"
                        className="w-full py-3.5 rounded-xl font-medium text-base"
                      >
                        {githubLoading
                          ? 'Connecting...'
                          : 'Continue with GitHub'}
                      </Button>
                    </div>

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
                  </>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode !== 'resetVerify' && (
                    <div>
                      <label
                        htmlFor="signin-email"
                        className="block text-base font-semibold text-brown-800 mb-3"
                      >
                        Email Address
                      </label>
                      <input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className={inputClasses}
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  {isPasswordMode && (
                    <div>
                      <label
                        htmlFor="signin-password"
                        className="block text-base font-semibold text-brown-800 mb-3"
                      >
                        Password
                      </label>
                      <input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          mode === 'signUp'
                            ? 'Create a password'
                            : 'Enter your password'
                        }
                        required
                        minLength={mode === 'signUp' ? 8 : 1}
                        className={inputClasses}
                        disabled={isLoading}
                      />
                      {mode === 'signUp' ? (
                        <p className="text-sm text-brown-600 mt-3 font-medium">
                          Minimum 8 characters for security
                        </p>
                      ) : (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => goTo('resetRequest')}
                            disabled={isLoading}
                            className="text-giraffe-800 hover:text-brown-800 font-semibold text-sm transition-colors underline-offset-2 hover:underline"
                          >
                            Forgot your password?
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {mode === 'resetVerify' && (
                    <>
                      <div>
                        <label
                          htmlFor="reset-code"
                          className="block text-base font-semibold text-brown-800 mb-3"
                        >
                          Code from your email
                        </label>
                        <input
                          id="reset-code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={code}
                          onChange={(e) => setCode(e.target.value.trim())}
                          placeholder="12345678"
                          required
                          className={inputClasses}
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="reset-new-password"
                          className="block text-base font-semibold text-brown-800 mb-3"
                        >
                          New Password
                        </label>
                        <input
                          id="reset-new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Choose a new password"
                          required
                          minLength={8}
                          className={inputClasses}
                          disabled={isLoading}
                        />
                        <p className="text-sm text-brown-600 mt-3 font-medium">
                          Minimum 8 characters for security
                        </p>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={submitClasses}
                  >
                    {submitLabel()}
                  </Button>
                </form>

                <div className="text-center pt-4">
                  {isPasswordMode ? (
                    <p className="text-brown-700">
                      {mode === 'signUp'
                        ? 'Already have an account? '
                        : 'New to compassionate communication? '}
                      <button
                        type="button"
                        onClick={() => {
                          goTo(mode === 'signUp' ? 'signIn' : 'signUp')
                          setEmail('')
                          setPassword('')
                        }}
                        className="text-giraffe-800 hover:text-brown-800 font-bold text-base transition-colors underline-offset-2 hover:underline"
                        disabled={isLoading}
                      >
                        {mode === 'signUp' ? 'Sign in' : 'Create account'}
                      </button>
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {mode === 'resetVerify' && (
                        <p className="text-brown-700">
                          Code did not arrive?{' '}
                          <button
                            type="button"
                            onClick={() => {
                              goTo('resetRequest')
                              setCode('')
                              setNewPassword('')
                            }}
                            className="text-giraffe-800 hover:text-brown-800 font-bold text-base transition-colors underline-offset-2 hover:underline"
                            disabled={isLoading}
                          >
                            Send another
                          </button>
                        </p>
                      )}
                      <p className="text-brown-700">
                        <button
                          type="button"
                          onClick={() => {
                            goTo('signIn')
                            setCode('')
                            setNewPassword('')
                          }}
                          className="text-giraffe-800 hover:text-brown-800 font-bold text-base transition-colors underline-offset-2 hover:underline"
                          disabled={isLoading}
                        >
                          Back to sign in
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
