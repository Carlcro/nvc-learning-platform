import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import { useT } from '~/i18n/useT'
import { localDateString } from '~/lib/localDate'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
import {
  FeelingsPage,
  focusRing,
  primaryLinkClass,
} from '~/components/features/feelings/FeelingsPage'

export const Route = createFileRoute('/feelings/')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.feelings.hub.meta) }
  },
  component: FeelingHub,
})

/** The quieter tools, after the daily check-in. */
const TOOLS = [
  { to: '/feelings/wheel', key: 'wheel' },
  { to: '/feelings/intensity', key: 'intensity' },
  { to: '/feelings/library', key: 'library' },
  { to: '/feelings/quiz', key: 'quiz' },
] as const

function FeelingHub() {
  const t = useT()
  const copy = t.feelings.hub
  const currentUser = useQuery(api.users.getCurrentUser)
  const todayCheckIn = useQuery(
    api.feelingsProgress.getTodayCheckIn,
    currentUser ? { localDate: localDateString() } : 'skip',
  )
  const checkedInToday = Boolean(todayCheckIn)

  return (
    <FeelingsPage
      back={false}
      title={copy.title}
      intro={<p>{copy.intro}</p>}
      aside={
        <div className="hidden md:flex flex-col items-center">
          <SpeechBubble className="mb-6 max-w-xs">
            <p className="text-lg text-brown-800 text-center font-medium text-pretty">
              {copy.guide}
            </p>
          </SpeechBubble>
          <img
            src="/giraff.png"
            alt=""
            aria-hidden="true"
            className="h-48 lg:h-56 w-auto object-contain"
          />
        </div>
      }
    >
      <div className="max-w-3xl space-y-12">
        <section
          aria-labelledby="today-heading"
          className="rounded-lg border-2 border-giraffe-300 bg-white px-5 py-6 sm:px-8"
        >
          <h2
            id="today-heading"
            className="text-2xl font-bold text-brown-800 text-balance"
          >
            {checkedInToday
              ? copy.today.doneHeading
              : copy.today.notDoneHeading}
          </h2>
          <p className="mt-2 text-brown-700 max-w-prose text-pretty">
            {checkedInToday ? copy.today.doneText : copy.today.notDoneText}
          </p>
          <Link to="/feelings/check-in" className={`${primaryLinkClass} mt-5`}>
            {checkedInToday ? copy.today.doneAction : copy.today.notDoneAction}
          </Link>
        </section>

        <section aria-labelledby="tools-heading">
          <h2
            id="tools-heading"
            className="text-xl font-bold text-brown-800 mb-4"
          >
            {copy.toolsHeading}
          </h2>
          <ul className="border-t-2 border-brown-100">
            {TOOLS.map((tool) => (
              <li key={tool.to} className="border-b-2 border-brown-100">
                <Link
                  to={tool.to}
                  className={`group flex items-center gap-4 py-4 px-1 rounded-sm ${focusRing}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold text-brown-800 group-hover:underline decoration-giraffe-400 decoration-2 underline-offset-4">
                      {copy.tools[tool.key].title}
                    </span>
                    <span className="block mt-0.5 text-brown-700 text-pretty">
                      {copy.tools[tool.key].text}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-brown-700"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-brown-700 max-w-prose text-pretty">
          {copy.whyItHelps}
        </p>
      </div>
    </FeelingsPage>
  )
}
