import { Link, createFileRoute } from '@tanstack/react-router'
import { pageMeta } from '~/lib/seo'
import { AdminGate } from '~/components/features/admin/AdminGate'
import { OverviewTab } from '~/components/features/admin/OverviewTab'
import { PracticeTab } from '~/components/features/admin/PracticeTab'
import { EngagementTab } from '~/components/features/admin/EngagementTab'
import { UsersTab } from '~/components/features/admin/UsersTab'
import {
  RANGE_OPTIONS,
  isRangeDays,
} from '~/components/features/admin/range'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'practice', label: 'Practice' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'users', label: 'People' },
] as const

type TabId = (typeof TABS)[number]['id']

function isTabId(value: unknown): value is TabId {
  return TABS.some((tab) => tab.id === value)
}

export const Route = createFileRoute('/admin/')({
  head: () => ({
    meta: [
      ...pageMeta({
        title: 'Admin',
        description: 'Usage and cost overview.',
      }),
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  // The tab and range live in the URL so coming back from a person's page
  // lands where you left off.
  validateSearch: (search: Record<string, unknown>) => ({
    tab: isTabId(search.tab) ? search.tab : undefined,
    days: isRangeDays(search.days) ? search.days : undefined,
  }),
  component: AdminPage,
})

function AdminPage() {
  return (
    <AdminGate>
      <AdminContent />
    </AdminGate>
  )
}

function AdminContent() {
  const search = Route.useSearch()
  const tab = search.tab ?? 'overview'
  const days = search.days ?? 30
  const usesRange = tab === 'overview' || tab === 'practice'

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brown-800 tracking-tight">
            Admin
          </h1>
          <p className="text-brown-500 mt-2 max-w-prose">
            How people use the app and what it costs to run. Figures only:
            nothing anyone wrote is shown here.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Admin sections" className="flex flex-wrap gap-1">
            {TABS.map((item) => (
              <Link
                key={item.id}
                to="/admin"
                search={{ tab: item.id, days: search.days }}
                aria-current={tab === item.id ? 'page' : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === item.id
                    ? 'bg-giraffe-400 text-brown-800 shadow-sm'
                    : 'text-brown-600 hover:bg-giraffe-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {usesRange && (
            <div
              role="group"
              aria-label="Date range"
              className="flex gap-1 bg-white rounded-lg border-2 border-giraffe-100 p-1"
            >
              {RANGE_OPTIONS.map((option) => (
                <Link
                  key={option}
                  to="/admin"
                  search={{ tab: search.tab, days: option }}
                  aria-current={days === option ? 'true' : undefined}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    days === option
                      ? 'bg-giraffe-100 text-brown-800'
                      : 'text-brown-500 hover:text-brown-800'
                  }`}
                >
                  {option} days
                </Link>
              ))}
            </div>
          )}
        </div>

        {tab === 'overview' && <OverviewTab days={days} />}
        {tab === 'practice' && <PracticeTab days={days} />}
        {tab === 'engagement' && <EngagementTab />}
        {tab === 'users' && <UsersTab />}
      </section>
    </main>
  )
}
