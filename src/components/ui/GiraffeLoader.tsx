import { SpeechBubble } from './SpeechBubble'

interface GiraffeLoaderProps {
  /** Warm, specific message shown in the guide's speech bubble. */
  message?: string
}

/**
 * Full-screen loading state in the brand's voice: the giraffe guide gently
 * preparing your space, "thinking" via the calm typing dots. Replaces the bare
 * spinner so even the wait feels warm and unhurried (the Patient Mentor).
 *
 * Motion (float + dots) is disabled under prefers-reduced-motion via the
 * animation utilities in app.css.
 */
export function GiraffeLoader({
  message = 'Getting things ready for you…',
}: GiraffeLoaderProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream flex items-center justify-center px-4">
      <div
        className="flex flex-col items-center gap-6"
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
          className="h-56 w-auto object-contain drop-shadow-xl animate-float-soft"
        />
      </div>
    </div>
  )
}
