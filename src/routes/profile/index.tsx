import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { pageMeta } from '~/lib/seo'
import { getMessages } from '~/i18n/messages'
import { useT } from '~/i18n/useT'
import { SELECTABLE_LOCALES } from '~/i18n/config'
import { ProfileHero } from '~/components/features/profile/ProfileHero'
import { GrowthSummary } from '~/components/features/profile/GrowthSummary'
import { ActivityFeed } from '~/components/features/profile/ActivityFeed'
import { AchievementsGrid } from '~/components/features/profile/AchievementsGrid'
import { FeelingsStats } from '~/components/features/profile/FeelingsStats'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { Button } from '~/components/ui/Button'
import { LanguagePicker } from '~/components/ui/LanguagePicker'

export const Route = createFileRoute('/profile/')({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.profile.meta) }
  },
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
  const t = useT()
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
              {t.profile.setupFailed.title}
            </h1>
            <p className="mt-3 text-brown-700 text-pretty">
              {t.profile.setupFailed.body}
            </p>
            <Button
              variant="primary"
              size="lg"
              className="mt-6"
              onClick={ensureProgress}
            >
              {t.profile.setupFailed.retry}
            </Button>
          </div>
        </main>
      )
    }
    return <GiraffeLoader message={t.profile.loading} />
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
          <SettingsSection />
        </div>
      </div>
    </main>
  )
}

/**
 * Personal settings at the end of the page. Today that is only the language,
 * and the picker hides itself while English is the one choice, so the whole
 * section stays out of the way until there is something to choose.
 */
function SettingsSection() {
  const t = useT()

  if (SELECTABLE_LOCALES.length < 2) return null

  return (
    <section aria-labelledby="settings-heading">
      <h2
        id="settings-heading"
        className="text-xl font-bold text-brown-800 text-balance"
      >
        {t.profile.settings.title}
      </h2>
      <div className="mt-4 max-w-sm rounded-lg border-2 border-giraffe-100 bg-white p-4">
        <LanguagePicker />
      </div>
    </section>
  )
}
