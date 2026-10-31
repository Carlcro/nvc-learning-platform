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
import { getMessages } from '~/i18n/messages'
import { useLocale, useT } from '~/i18n/useT'

export const Route = createFileRoute('/challenges/daily')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.challenges.meta) }
  },
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
  const t = useT()

  return (
    <main className="min-h-screen bg-paper">
      <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 text-balance tracking-tight">
            {t.challenges.hero.title}
          </h1>
          <p className="mt-4 text-lg text-brown-700 max-w-prose text-pretty">
            {t.challenges.hero.body}
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
  const t = useT()
  const locale = useLocale()
  const myChallenge = useQuery(api.dailyChallenges.getMyChallenge, { locale })
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
    myChallenge?.scenarioId
      ? { scenarioId: myChallenge.scenarioId, locale }
      : 'skip',
  )

  if (myChallenge === undefined) {
    return <GiraffeLoader message={t.challenges.loading} />
  }

  if (myChallenge === null) {
    return (
      <DailyShell>
        <section className="rounded-lg border-2 border-giraffe-100 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-brown-800">
            {t.challenges.pending.title}
          </h2>
          <p className="mt-2 max-w-prose text-brown-700 text-pretty">
            {t.challenges.pending.body}
          </p>
          <Link to="/practice" className={`${PRIMARY_LINK_CLASS} mt-6`}>
            {t.challenges.pending.browse}
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
        <h2 id="suggested-heading" className="text-lg font-bold text-brown-800">
          {t.challenges.suggested.title}
        </h2>
        <p className="mt-1 mb-4 text-sm text-brown-600">
          {t.challenges.suggested.chosenFor(myChallenge.userLevel)}
          {myChallenge.alternatives.length > 0 &&
            t.challenges.suggested.othersOpen}
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
            {t.challenges.alternatives.title}
          </h2>
          <ul className="mt-2 divide-y-2 divide-giraffe-100">
            {myChallenge.alternatives.map((alt) => {
              const label = challengeDifficultyLabel(
                alt.difficulty,
                t.challenges.difficulty,
              )
              return (
                <li key={alt._id} className="py-5">
                  <p className="max-w-prose text-brown-700 leading-relaxed text-pretty break-words">
                    {alt.description}
                  </p>
                  <p className="mt-2 text-sm text-brown-600">
                    {t.challenges.alternatives.worth(label, alt.bonusPoints)}{' '}
                    <Link
                      to="/practice/$scenarioId/brief"
                      params={{ scenarioId: alt.scenarioId }}
                      search={{ dailyChallengeId: alt._id }}
                      className={QUIET_LINK_CLASS}
                    >
                      {t.challenges.alternatives.choose}
                      <span className="sr-only">
                        {t.challenges.alternatives.chooseLabel(label)}
                      </span>
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
