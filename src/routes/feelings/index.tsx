import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { pageMeta } from '~/lib/seo'
import { localDateString } from '~/lib/localDate'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
import {
  FeelingsPage,
  focusRing,
  primaryLinkClass,
} from '~/components/features/feelings/FeelingsPage'

export const Route = createFileRoute('/feelings/')({
  head: () => ({
    meta: pageMeta({
      title: 'Feelings',
      description: 'Build the vocabulary to name what you feel precisely.',
    }),
  }),
  component: FeelingHub,
})

/** The quieter tools, after the daily check-in. */
const TOOLS = [
  {
    to: '/feelings/wheel',
    title: 'Browse feelings',
    text: 'Feelings grouped by family, each with a definition, examples and close relatives.',
  },
  {
    to: '/feelings/intensity',
    title: 'How strong is it',
    text: 'See how one feeling shifts as it grows softer or stronger, so you can name how much.',
  },
  {
    to: '/feelings/library',
    title: 'Your saved feelings',
    text: 'The words you have kept to come back to.',
  },
  {
    to: '/feelings/quiz',
    title: 'Feeling or thought',
    text: 'Short sentences to sort: is this a feeling, or a thought about someone else?',
  },
] as const

function FeelingHub() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const todayCheckIn = useQuery(
    api.feelingsProgress.getTodayCheckIn,
    currentUser ? { localDate: localDateString() } : 'skip',
  )
  const checkedInToday = Boolean(todayCheckIn)

  return (
    <FeelingsPage
      back={false}
      title="Find the words for what you feel."
      intro={
        <p>
          Feelings are the second piece of a compassionate message. The more
          words you have for them, the easier it is to say what is really going
          on, and to tell a feeling apart from a thought about someone else.
        </p>
      }
      aside={
        <div className="hidden md:flex flex-col items-center">
          <SpeechBubble className="mb-6 max-w-xs">
            <p className="text-lg text-brown-800 text-center font-medium text-pretty">
              Naming what you feel is where compassion begins. Take your time
              here. There are no wrong answers.
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
              ? 'You have checked in today.'
              : 'How are you today?'}
          </h2>
          <p className="mt-2 text-brown-700 max-w-prose text-pretty">
            {checkedInToday
              ? 'You can look back at what you noticed, or change it if the day has moved on.'
              : 'Pause for a minute and pick the words that fit. A short note is welcome, and only you can see it.'}
          </p>
          <Link to="/feelings/check-in" className={`${primaryLinkClass} mt-5`}>
            {checkedInToday ? 'Open today’s check-in' : 'Check in for today'}
          </Link>
        </section>

        <section aria-labelledby="tools-heading">
          <h2
            id="tools-heading"
            className="text-xl font-bold text-brown-800 mb-4"
          >
            Other ways to explore
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
                      {tool.title}
                    </span>
                    <span className="block mt-0.5 text-brown-700 text-pretty">
                      {tool.text}
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
          Why it helps: a feeling named precisely is easier to share without
          blame, and easier for the other person to hear. Words like
          &ldquo;ignored&rdquo; or &ldquo;judged&rdquo; describe what you think
          someone did. The feelings underneath, perhaps lonely or hurt, are
          yours to share.
        </p>
      </div>
    </FeelingsPage>
  )
}
