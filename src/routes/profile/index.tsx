import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '../../../convex/_generated/api'
import { LevelCard } from '~/components/features/profile/LevelCard'
import { StreakBadge } from '~/components/features/profile/StreakBadge'
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
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-giraffe-600"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-giraffe-200 shadow-md">
              <img
                src="/giraff.png"
                alt="Profile"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-brown-800 mb-2">
                Your{' '}
                <span className="bg-linear-to-r from-giraffe-600 to-giraffe-500 bg-clip-text text-transparent">
                  Progress
                </span>
              </h1>
              <p className="text-lg text-brown-700">
                Keep growing your compassionate communication skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {/* Top Row: Level & Streak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <LevelCard stats={stats} />
          </div>
          <div>
            <StreakBadge stats={stats} />
          </div>
        </div>

        {/* Bottom Row: Skills & Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillStats stats={stats} />
          <ActivityFeed
            completedScenarios={stats.scenariosCompleted}
            masteredScenarios={stats.scenariosMastered}
            totalStars={stats.totalStars}
          />
        </div>
      </section>
    </main>
  )
}
