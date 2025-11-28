import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '../../../convex/_generated/api'
import { LevelCard } from '~/components/features/profile/LevelCard'
import { StreakBadge } from '~/components/features/profile/StreakBadge'
import { SkillStats } from '~/components/features/profile/SkillStats'
import { ActivityFeed } from '~/components/features/profile/ActivityFeed'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  const stats = useQuery(api.userProgress.getStats)
  const getOrCreateProgress = useMutation(api.userProgress.getOrCreate)

  // Ensure progress record exists
  useEffect(() => {
    getOrCreateProgress()
  }, [getOrCreateProgress])

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-giraffe-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-12 pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-giraffe-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <img
              src="/giraff.png"
              alt="Profile"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brown-800">Your Progress</h1>
            <p className="text-brown-600">
              Keep growing your compassionate communication skills!
            </p>
          </div>
        </div>

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
      </div>
    </div>
  )
}
