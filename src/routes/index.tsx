import { Link, createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { Button } from '~/components/ui/Button'
import { LanguagePicker } from '~/components/ui/LanguagePicker'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
import { DailyChallengeTeaser } from '~/components/features/dashboard/DailyChallengeTeaser'
import { PracticePreview } from '~/components/features/landing/PracticePreview'
import { getMessages } from '~/i18n/messages'
import { useT } from '~/i18n/useT'

export const Route = createFileRoute('/')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.home.meta) }
  },
  component: Home,
})

function Home() {
  const t = useT()
  const home = t.home
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-800 mb-6 text-balance tracking-tight leading-[1.08]">
              {home.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-brown-700 mb-8 leading-relaxed max-w-prose mx-auto md:mx-0 text-pretty">
              {home.hero.intro}
            </p>
            <div className="flex flex-col gap-4 items-center md:items-start">
              <Link to="/practice">
                <Button
                  size="lg"
                  variant="primary"
                  className="px-8 whitespace-nowrap"
                >
                  {home.hero.primaryAction}
                </Button>
              </Link>
              <Link
                to="/learn"
                className="font-semibold text-brown-700 underline decoration-giraffe-500 decoration-2 underline-offset-4 hover:text-brown-900 hover:decoration-brown-700 transition-colors"
              >
                {home.hero.secondaryAction}
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <SpeechBubble className="mb-6 max-w-xs">
              <p className="text-lg text-brown-800 text-center font-medium text-pretty">
                {home.hero.bubble}
              </p>
            </SpeechBubble>
            <img
              src="/giraff.png"
              alt={t.layout.guideAlt}
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
              {home.showcase.title}
            </h2>
            <div className="space-y-4 text-lg text-brown-700 leading-relaxed max-w-prose text-pretty">
              <p>{home.showcase.partners}</p>
              <p>{home.showcase.hints}</p>
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
              {home.voices.title}
            </h2>
            <p className="text-lg text-brown-700 leading-relaxed max-w-prose text-pretty">
              {home.voices.intro}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <VoicePanel
              voice="jackal"
              name={home.voices.jackal.name}
              tagline={home.voices.jackal.tagline}
              image="/jakyll.webp"
              lines={home.voices.jackal.lines}
              outcome={home.voices.jackal.outcome}
            />
            <VoicePanel
              voice="giraffe"
              name={home.voices.giraffe.name}
              tagline={home.voices.giraffe.tagline}
              image="/giraff.png"
              lines={home.voices.giraffe.lines}
              outcome={home.voices.giraffe.outcome}
            />
          </div>

          <p className="mt-10 max-w-prose text-brown-700 text-pretty">
            {home.voices.lessonsNote}{' '}
            <Link
              to="/learn"
              className="font-semibold text-brown-800 underline decoration-giraffe-500 decoration-2 underline-offset-4 hover:decoration-brown-700"
            >
              {home.voices.seeLessons}
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
            {home.closing.title}
          </h2>
          <p className="text-lg text-giraffe-100 mb-8 max-w-prose mx-auto text-pretty">
            {home.closing.body}
          </p>
          <Link to="/practice">
            <Button size="lg" variant="primary" className="px-8">
              {home.closing.action}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-brown-900 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm">
          <p className="text-brown-200">
            {home.footer.creditBefore}
            <a
              href="https://www.cnvc.org"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-cream"
            >
              {home.footer.creditLink}
            </a>
            {home.footer.creditAfter}
          </p>
          <nav aria-label={home.footer.navLabel} className="flex gap-6 text-brown-200">
            <Link to="/learn" className="hover:text-cream">
              {home.footer.lessons}
            </Link>
            <Link to="/practice" className="hover:text-cream">
              {home.footer.practice}
            </Link>
            <Link to="/feelings" className="hover:text-cream">
              {home.footer.feelings}
            </Link>
          </nav>
          <LanguagePicker tone="dark" />
        </div>
      </footer>
    </main>
  )
}

interface VoicePanelProps {
  voice: 'jackal' | 'giraffe'
  name: string
  /** One line under the name saying what this voice does. */
  tagline: string
  image: string
  lines: ReadonlyArray<{ move: string; line: string }>
  outcome: string
}

/**
 * One voice saying the whole message. The animal stands at the top like the
 * speaker; each line carries a small label naming the move it makes.
 */
function VoicePanel({
  voice,
  name,
  tagline,
  image,
  lines,
  outcome,
}: VoicePanelProps) {
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
          <p className="text-sm text-brown-700">{tagline}</p>
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
