import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '../../../convex/_generated/api'
import { ProfileHero } from '~/components/features/profile/ProfileHero'
import { OverallScoreRing } from '~/components/features/profile/OverallScoreRing'
import { SkillStats } from '~/components/features/profile/SkillStats'
import { ActivityFeed } from '~/components/features/profile/ActivityFeed'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/profile/')({
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

  useEffect(() => {
    getOrCreateProgress()
  }, [getOrCreateProgress])

  if (!stats) {
    return (
      <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
        <div className="flex items-center justify-center py-24" role="status">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-giraffe-600"></div>
          <span className="sr-only">Loading your progress</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-6">
        {/* Focal band: who you are and how far you've come */}
        <ProfileHero stats={stats} />

        {/* The heart of NVC practice: overall empathy + the four skills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <OverallScoreRing score={stats.averageScores.overall} />
          </div>
          <div className="md:col-span-2">
            <SkillStats stats={stats} />
          </div>
        </div>

        {/* Milestones earned, and the next step */}
        <ActivityFeed
          completedScenarios={stats.scenariosCompleted}
          masteredScenarios={stats.scenariosMastered}
          totalStars={stats.totalStars}
        />
      </section>
    </main>
  )
}
