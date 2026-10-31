import { Check, Eye, Heart, MessageCircleQuestion, Sprout } from 'lucide-react'
import { useT } from '~/i18n/useT'

/**
 * A still frame of a real practice exchange for the landing page: a first
 * attempt that lands as blame, the hint that follows, and a second attempt
 * that opens the other person up. It borrows the conversation screen's own
 * bubbles and arc so visitors see the product instead of a description of it.
 * Purely illustrative; nothing here is interactive.
 */
export function PracticePreview() {
  const t = useT()
  const preview = t.home.preview
  return (
    <figure
      aria-label={preview.label}
      className="rounded-xl border-2 border-giraffe-200 bg-paper overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b-2 border-giraffe-100 bg-white px-5 py-3">
        <p className="text-sm font-semibold text-brown-800">
          {preview.talkingWith}
        </p>
        <p className="text-xs text-brown-600">{preview.situation}</p>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-6">
        <Bubble from="you">
          {preview.firstAttempt}{' '}
          <span className="underline decoration-empathy-low decoration-2 underline-offset-2">
            {preview.firstAttemptBlame}
          </span>
        </Bubble>
        <Bubble from="sam">{preview.samReplyGuarded}</Bubble>

        <div className="mx-auto max-w-sm rounded-lg bg-white px-4 py-3 text-center border-2 border-giraffe-100">
          <p className="text-xs font-semibold text-giraffe-800">
            {preview.hintLabel}
          </p>
          <p className="text-sm text-brown-700 text-pretty">{preview.hint}</p>
        </div>

        <Bubble from="you">{preview.secondAttempt}</Bubble>
        <Bubble from="sam">{preview.samReplyOpen}</Bubble>
      </div>

      <figcaption className="border-t-2 border-giraffe-100 bg-white px-5 py-4">
        <ArcStill />
      </figcaption>
    </figure>
  )
}

function Bubble({
  from,
  children,
}: {
  from: 'you' | 'sam'
  children: React.ReactNode
}) {
  const t = useT()
  const preview = t.home.preview
  const isUser = from === 'you'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <span
        aria-hidden="true"
        className={`flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-xs font-bold ${
          isUser ? 'bg-giraffe-400 text-brown-800' : 'bg-brown-600 text-cream'
        }`}
      >
        {isUser ? preview.youAvatar : preview.samAvatar}
      </span>
      <p
        className={`max-w-[85%] sm:max-w-sm px-4 py-3 rounded-lg leading-relaxed text-pretty ${
          isUser
            ? 'bg-giraffe-300 text-brown-900 rounded-br-none'
            : 'bg-white border-2 border-giraffe-200 text-brown-800 rounded-bl-none'
        }`}
      >
        <span className="sr-only">
          {isUser ? preview.youSpeaker : preview.samSpeaker}
        </span>
        {children}
      </p>
    </div>
  )
}

const ARC = [
  { key: 'observation', Icon: Eye, reached: true },
  { key: 'feeling', Icon: Heart, reached: true },
  { key: 'need', Icon: Sprout, reached: true },
  { key: 'request', Icon: MessageCircleQuestion, reached: false },
] as const

/** The arc as it would look after the second attempt: request still to come. */
function ArcStill() {
  const t = useT()
  const preview = t.home.preview
  return (
    <div>
      <p className="mb-3 text-xs text-brown-600">{preview.arcSummary}</p>
      <ol className="grid grid-cols-4" aria-hidden="true">
        {ARC.map((piece, index) => {
          const next = index < ARC.length - 1 ? ARC[index + 1] : null
          const PieceIcon = piece.Icon
          return (
            <li
              key={piece.key}
              className="relative flex flex-col items-center text-center"
            >
              {next && (
                <span
                  className={`absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                    next.reached ? 'bg-empathy-high' : 'bg-brown-100'
                  }`}
                />
              )}
              <span
                className={`relative z-10 h-10 w-10 rounded-full grid place-items-center ${
                  piece.reached
                    ? 'bg-[color-mix(in_srgb,var(--color-empathy-high)_22%,white)] text-brown-800 border-2 border-empathy-high'
                    : 'bg-giraffe-50 text-brown-800 border-2 border-giraffe-400 ring-4 ring-giraffe-100'
                }`}
              >
                <PieceIcon className="h-4.5 w-4.5" strokeWidth={1.75} />
                {piece.reached && (
                  <span className="absolute -right-1 -bottom-1 h-4.5 w-4.5 rounded-full bg-empathy-high ring-2 ring-white grid place-items-center">
                    <Check className="h-3 w-3 text-brown-900" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span className="mt-1.5 text-xs font-medium text-brown-800">
                {preview.arc[piece.key]}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
