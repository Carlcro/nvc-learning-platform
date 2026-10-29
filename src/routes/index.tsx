import { Link, createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { Button } from '~/components/ui/Button'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
import { DailyChallengeTeaser } from '~/components/features/dashboard/DailyChallengeTeaser'
import { PracticePreview } from '~/components/features/landing/PracticePreview'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: pageMeta({
      title: 'Learn Compassionate Communication',
      description:
        'Practice the four steps of compassionate communication through guided lessons and lifelike roleplay conversations.',
    }),
  }),
  component: Home,
})

/**
 * One message said two ways. Line by line, each jackal move sits beside the
 * giraffe piece that replaces it, so the four parts read as a translation.
 */
const JACKAL_LINES = [
  { move: 'Judgment', line: 'You always ignore me.' },
  { move: 'Mind reading', line: "I feel like you don't care." },
  { move: 'Criticism', line: 'I need you to be better at this.' },
  { move: 'Demand', line: 'Just text me next time.' },
] as const

const GIRAFFE_LINES = [
  { move: 'Observation', line: "When I didn't hear from you last night," },
  { move: 'Feeling', line: 'I felt worried,' },
  { move: 'Need', line: "because knowing you're safe matters to me." },
  {
    move: 'Request',
    line: "Would you be willing to send a quick text if you're out late?",
  },
] as const

function Home() {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-800 mb-6 text-balance tracking-tight leading-[1.08]">
              Rehearse the hard conversation before you have it.
            </h1>
            <p className="text-lg sm:text-xl text-brown-700 mb-8 leading-relaxed max-w-prose mx-auto md:mx-0 text-pretty">
              Learn the four parts of Non-Violent Communication, then try them
              out loud with someone who answers back. When the real talk comes,
              the words will already feel like yours.
            </p>
            <div className="flex flex-col gap-4 items-center md:items-start">
              <Link to="/practice">
                <Button
                  size="lg"
                  variant="primary"
                  className="px-8 whitespace-nowrap"
                >
                  Try a practice conversation
                </Button>
              </Link>
              <Link
                to="/learn"
                className="font-semibold text-brown-700 underline decoration-giraffe-500 decoration-2 underline-offset-4 hover:text-brown-900 hover:decoration-brown-700 transition-colors"
              >
                Or start with a short lesson
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <SpeechBubble className="mb-6 max-w-xs">
              <p className="text-lg text-brown-800 text-center font-medium text-pretty">
                Had a talk go sideways? Let's try it again, slowly.
              </p>
            </SpeechBubble>
            <img
              src="/giraff.png"
              alt="The giraffe, your guide"
              className="h-56 sm:h-72 md:h-80 w-auto object-contain scale-x-[-1]"
            />
          </div>
        </div>
      </section>

      {/* The product, shown rather than described */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.15fr] gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-brown-800 mb-5 text-balance tracking-tight">
              Say it, see how it lands, try again.
            </h2>
            <div className="space-y-4 text-lg text-brown-700 leading-relaxed max-w-prose text-pretty">
              <p>
                Each practice partner has a history and a mood. Blame makes
                them guarded. Honesty about what you saw and felt helps them
                soften.
              </p>
              <p>
                After every message you get a hint, never a script, and the
                arc fills in as you bring each piece into the conversation. One
                piece per message is plenty.
              </p>
            </div>
          </div>
          <PracticePreview />
        </div>
      </section>

      {/* Giraffe and jackal, with the four pieces as one rewritten message */}
      <section className="bg-paper px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brown-800 mb-5 text-balance tracking-tight">
              Every hard moment has two voices.
            </h2>
            <p className="text-lg text-brown-700 leading-relaxed max-w-prose text-pretty">
              Marshall Rosenberg called them the jackal and the giraffe. The
              jackal judges, blames and demands, and people defend themselves
              against it. The giraffe, the land animal with the largest heart,
              says what happened, how it felt, what mattered, and what would
              help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <VoicePanel
              voice="jackal"
              name="The jackal"
              image="/jakyll.webp"
              lines={JACKAL_LINES}
              outcome="Sam hears an attack, and starts defending."
            />
            <VoicePanel
              voice="giraffe"
              name="The giraffe"
              image="/giraff.png"
              lines={GIRAFFE_LINES}
              outcome="Sam hears that you were worried, and softens."
            />
          </div>

          <p className="mt-10 max-w-prose text-brown-700 text-pretty">
            Nobody speaks all four at once in real life, and you don't have to
            either. The lessons take each piece in turn, with a short quiz at
            the end of each.{' '}
            <Link
              to="/learn"
              className="font-semibold text-brown-800 underline decoration-giraffe-500 decoration-2 underline-offset-4 hover:decoration-brown-700"
            >
              See the lessons
            </Link>
          </p>
        </div>
      </section>

      {/* Today's challenge */}
      <section className="bg-giraffe-50 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <DailyChallengeTeaser />
        </div>
      </section>

      {/* Closing */}
      <section className="bg-brown-800 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-cream mb-5 text-balance tracking-tight">
            Bring the conversation you're dreading.
          </h2>
          <p className="text-lg text-giraffe-100 mb-8 max-w-prose mx-auto text-pretty">
            Pick a ready-made scenario, or describe a situation from your own
            life and rehearse it there. Your practice conversations are private
            to you.
          </p>
          <Link to="/practice">
            <Button size="lg" variant="primary" className="px-8">
              Start practicing
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-brown-900 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm">
          <p className="text-brown-200">
            Practice NVC. Based on the work of Marshall Rosenberg and the{' '}
            <a
              href="https://www.cnvc.org"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-cream"
            >
              Center for Nonviolent Communication
            </a>
            .
          </p>
          <nav aria-label="Footer" className="flex gap-6 text-brown-200">
            <Link to="/learn" className="hover:text-cream">
              Lessons
            </Link>
            <Link to="/practice" className="hover:text-cream">
              Practice
            </Link>
            <Link to="/feelings" className="hover:text-cream">
              Feelings
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}

interface VoicePanelProps {
  voice: 'jackal' | 'giraffe'
  name: string
  image: string
  lines: ReadonlyArray<{ move: string; line: string }>
  outcome: string
}

/**
 * One voice saying the whole message. The animal stands at the top like the
 * speaker; each line carries a small label naming the move it makes.
 */
function VoicePanel({ voice, name, image, lines, outcome }: VoicePanelProps) {
  const isGiraffe = voice === 'giraffe'
  return (
    <figure
      className={`flex flex-col rounded-lg border-2 overflow-hidden ${
        isGiraffe
          ? 'bg-white border-giraffe-300'
          : 'bg-brown-50 border-brown-100'
      }`}
    >
      <div
        className={`flex items-end gap-5 px-6 sm:px-8 pt-6 border-b-2 ${
          isGiraffe
            ? 'bg-giraffe-100 border-giraffe-200'
            : 'bg-brown-100 border-brown-200'
        }`}
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-32 sm:h-40 w-auto object-contain object-bottom"
        />
        <figcaption className="pb-5">
          <p className="text-xl font-bold text-brown-900">{name}</p>
          <p className="text-sm text-brown-700">
            {isGiraffe
              ? 'Says what happened and what would help'
              : 'Judges, blames and demands'}
          </p>
        </figcaption>
      </div>

      <ol className="flex-1 px-6 sm:px-8 py-6 space-y-5">
        {lines.map((item) => (
          <li key={item.move}>
            <p
              className={`text-xs font-semibold mb-1 ${
                isGiraffe ? 'text-giraffe-800' : 'text-brown-600'
              }`}
            >
              {item.move}
            </p>
            <p
              className={`text-pretty ${
                isGiraffe
                  ? 'text-lg font-semibold text-brown-900'
                  : 'text-lg text-brown-700'
              }`}
            >
              {item.line}
            </p>
          </li>
        ))}
      </ol>

      <p
        className={`px-6 sm:px-8 py-4 text-sm border-t-2 ${
          isGiraffe
            ? 'border-giraffe-100 text-brown-800'
            : 'border-brown-100 text-brown-600'
        }`}
      >
        {outcome}
      </p>
    </figure>
  )
}
