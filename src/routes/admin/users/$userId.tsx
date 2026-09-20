import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import { pageMeta } from '~/lib/seo'
import { BackButton } from '~/components/ui/BackButton'
import { Badge } from '~/components/ui/Badge'
import {
  AdminGate,
  AdminLoading,
} from '~/components/features/admin/AdminGate'
import {
  EmptyNote,
  Section,
  StatGrid,
  StatTile,
  TableShell,
  numClass,
  tdClass,
  thClass,
} from '~/components/features/admin/AdminParts'
import { RankedBars, TimeBars } from '~/components/features/admin/Charts'
import {
  formatCount,
  formatDay,
  formatDecimal,
  formatTimestamp,
  formatUsd,
  humanize,
  kindLabel,
  plural,
} from '~/lib/adminFormat'

export const Route = createFileRoute('/admin/users/$userId')({
  head: () => ({
    meta: [
      ...pageMeta({
        title: 'Admin',
        description: 'Usage and cost for one person.',
      }),
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminUserPage,
})

function AdminUserPage() {
  return (
    <AdminGate>
      <AdminUserContent />
    </AdminGate>
  )
}

const STATUS_LABELS: Record<string, string> = {
  in_progress: 'Open',
  completed: 'Wrapped up',
  abandoned: 'Started over',
}

function AdminUserContent() {
  const { userId } = Route.useParams()
  const data = useQuery(api.admin.userDetail, {
    userId: userId as Id<'users'>,
  })

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-6">
        <BackButton to="/admin" search={{ tab: 'users' }} label="Everyone" />

        {data === undefined ? (
          <AdminLoading />
        ) : data === null ? (
          <EmptyNote>There is no person with that id.</EmptyNote>
        ) : (
          <UserDetail data={data} />
        )}
      </section>
    </main>
  )
}

type UserDetailData = NonNullable<
  ReturnType<typeof useQuery<typeof api.admin.userDetail>>
>

function UserDetail({ data }: { data: UserDetailData }) {
  const { user, progress, cost } = data
  const turns30 = data.daily.reduce((n, d) => n + d.turns, 0)

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-brown-800 tracking-tight">
          {user.name || user.email || 'Unnamed learner'}
        </h1>
        <p className="text-brown-500 mt-2">
          {[
            user.name ? user.email : null,
            `Joined ${formatTimestamp(user.joinedAt)}`,
            user.signsInWith.length > 0
              ? `Signs in with ${user.signsInWith.map(humanize).join(' and ')}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      <StatGrid>
        <StatTile
          label="Lifetime model cost"
          value={formatUsd(cost.lifetimeMicros)}
          hint={
            cost.firstCallAt
              ? `Measured since ${formatTimestamp(cost.firstCallAt)}`
              : 'Nothing measured yet'
          }
        />
        <StatTile
          label="Cost, last 30 days"
          value={formatUsd(cost.last30Micros)}
          hint={plural(turns30, 'practice turn', 'practice turns')}
        />
        <StatTile
          label="Cost per turn"
          value={
            cost.measuredTurns > 0
              ? formatUsd(cost.lifetimeMicros / cost.measuredTurns)
              : '$0'
          }
          hint={`${plural(cost.modelCalls, 'model call', 'model calls')} on ${plural(cost.activeDays, 'day', 'days')}`}
        />
        <StatTile
          label="Tokens"
          value={formatCount(cost.inputTokens + cost.outputTokens)}
          hint={`${formatCount(cost.inputTokens)} in, ${formatCount(cost.outputTokens)} out`}
        />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Model cost per day, last 30 days">
          <TimeBars
            data={data.daily.map((d) => ({
              date: d.date,
              value: d.costMicros,
            }))}
            formatValue={formatUsd}
            formatDate={formatDay}
            summary={`${formatUsd(cost.last30Micros)} in total`}
          />
        </Section>
        <Section title="Practice turns per day, last 30 days">
          <TimeBars
            data={data.daily.map((d) => ({ date: d.date, value: d.turns }))}
            formatValue={formatCount}
            formatDate={formatDay}
            summary={`${formatCount(turns30)} turns in total`}
          />
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Progress">
          {progress ? (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Level', `${progress.level}`],
                ['Points', formatCount(progress.totalPoints)],
                ['Current streak', plural(progress.currentStreak, 'day', 'days')],
                ['Longest streak', plural(progress.longestStreak, 'day', 'days')],
                ['Conversations finished', `${progress.scenariosCompleted}`],
                ['Mastered', `${progress.scenariosMastered}`],
                ['Stars', `${progress.totalStars}`],
                ['Achievements', `${progress.achievements}`],
                ['Custom scenarios built', `${data.customScenarios}`],
                ['Last practiced', progress.lastPracticeDate ?? 'Not yet'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-brown-500">{label}</dt>
                  <dd className="font-semibold text-brown-800 tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <EmptyNote>No progress recorded yet.</EmptyNote>
          )}
        </Section>

        <Section
          title="Skill averages"
          description="Out of 25, across finished conversations."
        >
          {progress && progress.scenariosCompleted > 0 ? (
            <RankedBars
              max={25}
              rows={(['observation', 'feeling', 'need', 'request'] as const).map(
                (component) => ({
                  label: humanize(component),
                  value: progress.averageScores[component],
                  display: `${formatDecimal(progress.averageScores[component])} of 25`,
                }),
              )}
            />
          ) : (
            <EmptyNote>No finished conversations yet.</EmptyNote>
          )}
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Lessons">
          {data.lessons.length === 0 ? (
            <EmptyNote>No lesson quizzes taken yet.</EmptyNote>
          ) : (
            <TableShell>
              <thead>
                <tr>
                  <th className={thClass}>Lesson</th>
                  <th className={`${thClass} ${numClass}`}>Score</th>
                  <th className={`${thClass} ${numClass}`}>Attempts</th>
                  <th className={thClass}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.lessons.map((lesson) => (
                  <tr key={lesson.lessonId}>
                    <td className={tdClass}>{lesson.title}</td>
                    <td className={`${tdClass} ${numClass}`}>{lesson.score}</td>
                    <td className={`${tdClass} ${numClass}`}>
                      {lesson.attempts}
                    </td>
                    <td className={tdClass}>
                      <Badge
                        size="sm"
                        variant={lesson.completed ? 'success' : 'default'}
                      >
                        {lesson.completed ? 'Completed' : 'In progress'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </Section>

        <Section
          title="Feelings section"
          description="Counts only. Which feelings someone checked in with, and anything they wrote, stay theirs."
        >
          {data.feelings ? (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Check-ins', `${data.feelings.checkIns}`],
                ['Check-in streak', plural(data.feelings.checkInStreak, 'day', 'days')],
                ['Quiz answers', `${data.feelings.quizAnswered}`],
                ['Quiz score', `${Math.round(data.feelings.quizScore)}%`],
                ['Feelings explored', `${data.feelings.feelingsExplored}`],
                ['Feelings saved', `${data.feelings.feelingsSaved}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-brown-500">{label}</dt>
                  <dd className="font-semibold text-brown-800 tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <EmptyNote>Has not opened the feelings section yet.</EmptyNote>
          )}
        </Section>
      </div>

      {cost.recentCostByKind.length > 0 && (
        <Section
          title="What their recent calls were for"
          description="From the most recent 200 model calls."
        >
          <RankedBars
            rows={[...cost.recentCostByKind]
              .sort((a, b) => b.costMicros - a.costMicros)
              .map((k) => ({
                label: kindLabel(k.kind),
                value: k.costMicros,
                display: formatUsd(k.costMicros),
                detail: plural(k.calls, 'call', 'calls'),
              }))}
          />
        </Section>
      )}

      <Section
        title="Conversations"
        description="The most recent 50. What was said is never shown here, and custom scenarios are not named."
      >
        {data.conversations.length === 0 ? (
          <EmptyNote>No conversations yet.</EmptyNote>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <th className={thClass}>Scenario</th>
                <th className={thClass}>Started</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} ${numClass}`}>Turns</th>
                <th className={`${thClass} ${numClass}`}>Score</th>
                <th className={`${thClass} ${numClass}`}>Stars</th>
                <th className={`${thClass} ${numClass}`}>Rewinds</th>
                <th className={`${thClass} ${numClass}`}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.conversations.map((c) => (
                <tr key={c.conversationId}>
                  <td className={`${tdClass} font-medium`}>{c.scenario}</td>
                  <td className={tdClass}>{formatTimestamp(c.startedAt)}</td>
                  <td className={tdClass}>
                    <Badge
                      size="sm"
                      variant={c.status === 'completed' ? 'success' : 'default'}
                    >
                      {STATUS_LABELS[c.status] ?? humanize(c.status)}
                    </Badge>
                  </td>
                  <td className={`${tdClass} ${numClass}`}>{c.userTurns}</td>
                  <td className={`${tdClass} ${numClass}`}>
                    {c.finalScore === null ? '' : Math.round(c.finalScore)}
                  </td>
                  <td className={`${tdClass} ${numClass}`}>
                    {c.finalStars === null ? '' : c.finalStars}
                  </td>
                  <td className={`${tdClass} ${numClass}`}>{c.rewindsUsed}</td>
                  <td className={`${tdClass} ${numClass}`}>
                    {c.costMicros === null ? '' : formatUsd(c.costMicros)}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Section>
    </>
  )
}
