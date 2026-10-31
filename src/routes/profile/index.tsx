import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { pageMeta } from '~/lib/seo'
import { ProfileHero } from '~/components/features/profile/ProfileHero'
import { GrowthSummary } from '~/components/features/profile/GrowthSummary'
import { ActivityFeed } from '~/components/features/profile/ActivityFeed'
import { AchievementsGrid } from '~/components/features/profile/AchievementsGrid'
import { FeelingsStats } from '~/components/features/profile/FeelingsStats'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { Button } from '~/components/ui/Button'

export const Route = createFileRoute('/profile/')({
  head: () => ({
    meta: pageMeta({
      title: 'Your Profile',
      description:
        'Your level, streak, achievements and how your skills are growing.',
    }),
  }),
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const stats = useQuery(api.userProgress.getStats)
  const getOrCreateProgress = useMutation(api.userProgress.getOrCreate)
  const [setupFailed, setSetupFailed] = useState(false)

  // Make sure a progress record exists. getStats is null until it does, so a
  // failure here would otherwise leave the loader up forever.
  const ensureProgress = useCallback(() => {
    setSetupFailed(false)
    getOrCreateProgress().catch(() => setSetupFailed(true))
  }, [getOrCreateProgress])

  useEffect(() => {
    ensureProgress()
  }, [ensureProgress])

  if (!stats) {
    if (setupFailed) {
      return (
        <main className="min-h-screen bg-paper flex items-center justify-center px-4">
          <div className="max-w-md text-center" role="alert">
            <h1 className="text-2xl font-bold text-brown-800 text-balance">
              Your progress is taking a moment
            </h1>
            <p className="mt-3 text-brown-700 text-pretty">
              We could not load it just now. Your practice is safe, and trying
              again usually helps.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="mt-6"
              onClick={ensureProgress}
            >
              Try again
            </Button>
          </div>
        </main>
      )
    }
    return <GiraffeLoader message="Gathering your progress..." />
  }

  return (
    <main className="min-h-screen bg-paper">
      <ProfileHero stats={stats} />

      <div className="px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="max-w-3xl mx-auto divide-y divide-brown-100 [&>*]:py-10 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
          <GrowthSummary stats={stats} />
          <ActivityFeed
            completedScenarios={stats.scenariosCompleted}
            threeStarScenarios={stats.scenariosMastered}
            totalStars={stats.totalStars}
          />
          <FeelingsStats />
          <AchievementsGrid />
        </div>
      </div>
    </main>
  )
}
