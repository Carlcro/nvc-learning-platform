import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { ReactNode } from 'react'
import { DailyChallengeCard } from '~/components/features/challenges/DailyChallengeCard'
import { ChallengeStats } from '~/components/features/challenges/ChallengeStats'
import {
  PRIMARY_LINK_CLASS,
  QUIET_LINK_CLASS,
  challengeDifficultyLabel,
} from '~/components/features/challenges/challengeDisplay'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { pageMeta } from '~/lib/seo'

export const Route = createFileRoute('/challenges/daily')({
  head: () => ({
    meta: pageMeta({
      title: 'Daily Challenge',
      description: 'A new practice situation each day, if you would like one.',
    }),
  }),
  component: DailyChallengePage,
})

function DailyChallengePage() {
  return (
    <ProtectedRoute>
      <DailyChallengeContent />
    </ProtectedRoute>
  )
}

/** The page shell shared by every state: paper, with a giraffe-100 band. */
function DailyShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-paper">
      <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 text-balance tracking-tight">
            One conversation for today.
          </h1>
          <p className="mt-4 text-lg text-brown-700 max-w-prose text-pretty">
            A new situation each day, if you would like one. It plays like any
            other practice conversation, and finishing it adds a few bonus
            points.
          </p>
        </div>
      </section>
      <div className="px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="max-w-3xl mx-auto space-y-12">{children}</div>
      </div>
    </main>
  )
}

function DailyChallengeContent() {
  const myChallenge = useQuery(api.dailyChallenges.getMyChallenge)
  const stats = useQuery(api.dailyChallenges.getUserChallengeStats)
  const getOrCreateProgress = useMutation(api.userProgress.getOrCreate)

  // Ensure userProgress exists
  useEffect(() => {
    if (myChallenge === null) {
      getOrCreateProgress().catch(console.error)
    }
  }, [myChallenge, getOrCreateProgress])

  const scenario = useQuery(
    api.scenarios.getById,
    myChallenge?.scenarioId ? { scenarioId: myChallenge.scenarioId } : 'skip',
  )

  if (myChallenge === undefined) {
    return <GiraffeLoader message="Finding today's challenge for you..." />
  }

  if (myChallenge === null) {
    return (
      <DailyShell>
        <section className="rounded-lg border-2 border-giraffe-100 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-brown-800">
            Today's situation is still on its way.
          </h2>
          <p className="mt-2 max-w-prose text-brown-700 text-pretty">
            A new one is prepared every day. In the meantime, every practice
            scenario is open to you.
          </p>
          <Link to="/practice" className={`${PRIMARY_LINK_CLASS} mt-6`}>
            Browse practice scenarios
          </Link>
        </section>
      </DailyShell>
    )
  }

  // While the scenario loads, the card shows the description calmly and
  // leaves the title and character to arrive, rather than flashing defaults.
  const scenarioLoaded = scenario !== undefined && scenario !== null

  return (
    <DailyShell>
      <section aria-labelledby="suggested-heading">
        <h2
          id="suggested-heading"
          className="text-lg font-bold text-brown-800"
        >
          Suggested for you
        </h2>
        <p className="mt-1 mb-4 text-sm text-brown-600">
          Chosen for level {myChallenge.userLevel}.
          {myChallenge.alternatives.length > 0 &&
            ' The others below are just as open to you.'}
        </p>
        <DailyChallengeCard
          title={scenarioLoaded ? scenario.title : undefined}
          description={myChallenge.description}
          difficulty={myChallenge.difficulty}
          characterName={scenarioLoaded ? scenario.characterName : undefined}
          learningObjectives={
            scenarioLoaded ? scenario.learningObjectives : undefined
          }
          completed={myChallenge.completed}
          bonusPoints={myChallenge.bonusPoints}
          scenarioId={myChallenge.scenarioId}
          challengeId={myChallenge._id}
        />
      </section>

      {myChallenge.alternatives.length > 0 && (
        <section aria-labelledby="alternatives-heading">
          <h2
            id="alternatives-heading"
            className="text-lg font-bold text-brown-800"
          >
            Or choose another
          </h2>
          <ul className="mt-2 divide-y-2 divide-giraffe-100">
            {myChallenge.alternatives.map((alt) => {
              const label = challengeDifficultyLabel(alt.difficulty)
              return (
                <li key={alt._id} className="py-5">
                  <p className="max-w-prose text-brown-700 leading-relaxed text-pretty break-words">
                    {alt.description}
                  </p>
                  <p className="mt-2 text-sm text-brown-600">
                    {label}, worth {alt.bonusPoints} bonus points.{' '}
                    <Link
                      to="/practice/$scenarioId/brief"
                      params={{ scenarioId: alt.scenarioId }}
                      search={{ dailyChallengeId: alt._id }}
                      className={QUIET_LINK_CLASS}
                    >
                      Choose this one
                      <span className="sr-only">: the {label} challenge</span>
                    </Link>
                  </p>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {stats && (
        <ChallengeStats
          completedCount={stats.completedCount}
          longestStreak={stats.longestStreak}
        />
      )}
    </DailyShell>
  )
}
