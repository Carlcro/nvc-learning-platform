import { Check, Eye, Heart, MessageCircleQuestion, Sprout } from 'lucide-react'

/**
 * A still frame of a real practice exchange for the landing page: a first
 * attempt that lands as blame, the hint that follows, and a second attempt
 * that opens the other person up. It borrows the conversation screen's own
 * bubbles and arc so visitors see the product instead of a description of it.
 * Purely illustrative; nothing here is interactive.
 */
export function PracticePreview() {
  return (
    <figure
      aria-label="An example practice conversation with Sam"
      className="rounded-xl border-2 border-giraffe-200 bg-paper overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b-2 border-giraffe-100 bg-white px-5 py-3">
        <p className="text-sm font-semibold text-brown-800">
          Talking with Sam
        </p>
        <p className="text-xs text-brown-600">A friend who went quiet</p>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-6">
        <Bubble from="you">
          You never text me back.{' '}
          <span className="underline decoration-empathy-low decoration-2 underline-offset-2">
            Clearly I'm not a priority.
          </span>
        </Bubble>
        <Bubble from="sam">Wow. So I'm the bad guy because I was busy?</Bubble>

        <div className="mx-auto max-w-sm rounded-lg bg-white px-4 py-3 text-center border-2 border-giraffe-100">
          <p className="text-xs font-semibold text-giraffe-800">A hint</p>
          <p className="text-sm text-brown-700 text-pretty">
            That landed as blame. What did you actually see happen, and how did
            it feel?
          </p>
        </div>

        <Bubble from="you">
          When I didn't hear from you after ten last night, I felt worried,
          because knowing you're safe matters to me.
        </Bubble>
        <Bubble from="sam">
          Oh. I didn't think of that. My phone died and I just went to bed.
        </Bubble>
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
  const isUser = from === 'you'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <span
        aria-hidden="true"
        className={`flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-xs font-bold ${
          isUser ? 'bg-giraffe-400 text-brown-800' : 'bg-brown-600 text-cream'
        }`}
      >
        {isUser ? 'You' : 'S'}
      </span>
      <p
        className={`max-w-[85%] sm:max-w-sm px-4 py-3 rounded-lg leading-relaxed text-pretty ${
          isUser
            ? 'bg-giraffe-300 text-brown-900 rounded-br-none'
            : 'bg-white border-2 border-giraffe-200 text-brown-800 rounded-bl-none'
        }`}
      >
        <span className="sr-only">{isUser ? 'You: ' : 'Sam: '}</span>
        {children}
      </p>
    </div>
  )
}

const ARC = [
  { label: 'Observe', Icon: Eye, reached: true },
  { label: 'Feeling', Icon: Heart, reached: true },
  { label: 'Need', Icon: Sprout, reached: true },
  { label: 'Request', Icon: MessageCircleQuestion, reached: false },
] as const

/** The arc as it would look after the second attempt: request still to come. */
function ArcStill() {
  return (
    <div>
      <p className="mb-3 text-xs text-brown-600">
        Three of four pieces reached. A request can come next turn.
      </p>
      <ol className="grid grid-cols-4" aria-hidden="true">
        {ARC.map((piece, index) => {
          const next = index < ARC.length - 1 ? ARC[index + 1] : null
          const PieceIcon = piece.Icon
          return (
            <li
              key={piece.label}
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
                {piece.label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
