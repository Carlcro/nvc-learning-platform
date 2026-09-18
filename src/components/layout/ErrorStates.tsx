import { Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { SpeechBubble } from '~/components/ui/SpeechBubble'

function ErrorShell({
  message,
  children,
}: {
  message: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-giraffe-100 to-giraffe-50 px-4">
      <div className="flex flex-col items-center gap-8 max-w-md">
        <SpeechBubble className="w-full">
          <p className="text-lg text-brown-800 text-center font-medium">
            {message}
          </p>
        </SpeechBubble>

        <img
          src="/giraff.png"
          alt="Your compassionate communication guide"
          className="h-56 w-auto object-contain"
        />

        {children}
      </div>
    </div>
  )
}

const homeLinkClasses =
  'inline-flex items-center justify-center rounded-lg px-6 py-3 text-lg font-semibold bg-giraffe-400 text-brown-800 hover:bg-giraffe-500 shadow-sm transition duration-200 focus:ring-2 focus:ring-giraffe-300 focus:ring-offset-2'

const secondaryLinkClasses =
  'inline-flex items-center justify-center rounded-lg px-6 py-3 text-lg border-2 border-giraffe-400 text-brown-700 hover:bg-giraffe-50 transition duration-200 focus:ring-2 focus:ring-giraffe-300 focus:ring-offset-2'

export function RouteErrorPage({ error, reset }: ErrorComponentProps) {
  // The message and stack stay in the console for debugging and never reach
  // the page, where they would expose internals and read as a hard crash.
  console.error('Route error', error)

  return (
    <ErrorShell message="Something went wrong on our side. Nothing you did caused this, and your progress is safe.">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className={homeLinkClasses}>
          Try again
        </button>
        <Link to="/" className={secondaryLinkClasses}>
          Back to start
        </Link>
      </div>
    </ErrorShell>
  )
}

export function NotFoundPage() {
  return (
    <ErrorShell message="We could not find that page. It may have moved, or the link may be incomplete.">
      <Link to="/" className={homeLinkClasses}>
        Back to start
      </Link>
    </ErrorShell>
  )
}
