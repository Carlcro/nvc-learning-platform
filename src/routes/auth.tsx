import { useEffect } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useConvexAuth } from 'convex/react'
import { SignInForm } from '~/components/auth/SignInForm'
import { SpeechBubble } from '~/components/ui/SpeechBubble'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const from =
    ((search as Record<string, unknown>).from as string | undefined) ||
    '/practice'

  // Once auth resolves (including the return trip from GitHub), send the person
  // straight to where they were headed rather than re-rendering the form.
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: from, replace: true })
    }
  }, [isAuthenticated, from, navigate])

  // While auth is settling, or just after it succeeds, show a calm loader so the
  // sign-in form never flashes back during the redirect hand-off.
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-giraffe-100 to-giraffe-50">
        <div className="flex flex-col items-center gap-8">
          <SpeechBubble className="max-w-sm">
            <p className="text-lg text-brown-800 text-center font-medium">
              Welcoming you in...
            </p>
          </SpeechBubble>
          <img
            src="/giraff.png"
            alt="Your compassionate communication guide"
            className="h-64 w-auto object-contain"
          />
        </div>
      </div>
    )
  }

  return <SignInForm redirectTo={from} />
}
