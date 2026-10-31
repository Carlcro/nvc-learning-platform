import { useEffect, useState } from 'react'
import { SpeechBubble } from './SpeechBubble'

/** How long a wait has to last before the giraffe appears at all. */
const SHOW_AFTER_MS = 400

interface GiraffeLoaderProps {
  /** Warm, specific message shown in the guide's speech bubble. */
  message?: string
}

/**
 * Full-screen loading state in the brand's voice: the giraffe guide gently
 * preparing your space, "thinking" via the calm typing dots.
 *
 * Most loads finish in a fraction of a second, so for the first 400ms this
 * shows only the plain page background. A giraffe that appears and vanishes
 * at once is a flash, not reassurance. If the wait goes on, the guide fades
 * in softly.
 *
 * The fade and the typing dots are the only motion, and both stop under
 * prefers-reduced-motion via the animation utilities in app.css. The giraffe
 * itself never moves.
 */
export function GiraffeLoader({
  message = 'Getting things ready for you...',
}: GiraffeLoaderProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) {
    return (
      <div className="min-h-screen bg-paper" aria-busy="true" />
    )
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div
        className="flex flex-col items-center gap-6 animate-loader-in"
        role="status"
        aria-live="polite"
      >
        <SpeechBubble className="max-w-xs">
          <p className="text-center text-brown-800 font-medium text-pretty">
            {message}
          </p>
          <div
            className="mt-3 flex justify-center gap-1.5"
            aria-hidden="true"
          >
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-2 h-2 rounded-full bg-giraffe-400 animate-typing-dot"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </SpeechBubble>

        <img
          src="/giraff.png"
          alt=""
          aria-hidden="true"
          className="h-56 w-auto object-contain"
        />
      </div>
    </div>
  )
}
