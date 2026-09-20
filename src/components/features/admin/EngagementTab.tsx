import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { AdminLoading } from './AdminGate'
import {
  EmptyNote,
  Section,
  StatGrid,
  StatTile,
  TableShell,
  numClass,
  tdClass,
  thClass,
} from './AdminParts'
import { RankedBars } from './Charts'
import {
  formatCount,
  formatDecimal,
  formatPercent,
  humanize,
} from '~/lib/adminFormat'

/** Who gets how far, and which parts of the app people actually use. All time. */
export function EngagementTab() {
  const data = useQuery(api.admin.engagement)
  if (data === undefined) return <AdminLoading />

  if (data.totalUsers === 0) {
    return <EmptyNote>Nobody has signed up yet.</EmptyNote>
  }

  const share = (row: { label: string; count: number; rate: number }) => ({
    label: row.label,
    value: row.rate,
    display: `${formatPercent(row.rate)} (${formatCount(row.count)})`,
  })
  const measuredPeople = data.activeDays.reduce((n, b) => n + b.count, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="From signing up to a habit"
          description={`Share of all ${formatCount(data.totalUsers)} people who have reached each milestone. They are not strictly in order: plenty of people practice before finishing a lesson. A low bar is a part of the journey worth a closer look.`}
        >
          <RankedBars max={100} rows={data.funnel.map(share)} />
        </Section>

        <Section
          title="Which parts of the app people use"
          description="Share of everyone who has used each part at least once."
        >
          <RankedBars max={100} rows={data.adoption.map(share)} />
        </Section>
      </div>

      <Section
        title="Lessons"
        description="A lesson counts as completed at a quiz score of 60 or more."
      >
        <TableShell>
          <thead>
            <tr>
              <th className={thClass}>Lesson</th>
              <th className={`${thClass} ${numClass}`}>Took the quiz</th>
              <th className={`${thClass} ${numClass}`}>Completed</th>
              <th className={`${thClass} ${numClass}`}>Pass rate</th>
              <th className={`${thClass} ${numClass}`}>Avg score</th>
              <th className={`${thClass} ${numClass}`}>Avg attempts</th>
            </tr>
          </thead>
          <tbody>
            {data.lessons.map((lesson) => (
              <tr key={lesson.lessonId}>
                <td className={`${tdClass} font-medium`}>{lesson.title}</td>
                <td className={`${tdClass} ${numClass}`}>
                  {formatCount(lesson.attempted)}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {formatCount(lesson.completed)}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {lesson.attempted > 0
                    ? formatPercent(lesson.completionRate)
                    : ''}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {lesson.attempted > 0
                    ? formatDecimal(lesson.averageScore)
                    : ''}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {lesson.attempted > 0
                    ? formatDecimal(lesson.averageAttempts)
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="Skill averages across everyone"
          description="Out of 25, weighted by how many conversations each person has finished."
        >
          <RankedBars
            max={25}
            rows={data.skills.map((s) => ({
              label: humanize(s.component),
              value: s.averageScore,
              display: `${formatDecimal(s.averageScore)} of 25`,
            }))}
          />
        </Section>

        <Section
          title="Days people have practiced"
          description="Distinct days with at least one practice turn, counted since cost tracking began."
        >
          {measuredPeople === 0 ? (
            <EmptyNote>Nothing measured yet.</EmptyNote>
          ) : (
            <RankedBars
              rows={data.activeDays.map((b) => ({
                label: b.label,
                value: b.count,
                display: `${b.count} ${b.count === 1 ? 'person' : 'people'}`,
              }))}
            />
          )}
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Levels">
          <RankedBars
            rows={data.levels.map((l) => ({
              label: `Level ${l.level}`,
              value: l.users,
              display: `${l.users} ${l.users === 1 ? 'person' : 'people'}`,
            }))}
          />
        </Section>

        <Section
          title="Achievements earned"
          description="How many people hold each one."
        >
          <RankedBars
            rows={data.achievements.map((a) => ({
              label: a.title,
              value: a.users,
            }))}
          />
        </Section>
      </div>

      <StatGrid>
        <StatTile
          label="Feelings check-ins"
          value={formatCount(data.feelings.checkIns)}
          hint="All time, everyone"
        />
        <StatTile
          label="Feelings quiz answers"
          value={formatCount(data.feelings.quizAnswered)}
          hint={`${formatPercent(data.feelings.quizAccuracy)} answered correctly`}
        />
        <StatTile
          label="Feelings explored"
          value={formatDecimal(data.feelings.averageFeelingsExplored)}
          hint="Average per person who opened the feelings section"
        />
        <StatTile
          label="Feelings saved"
          value={formatDecimal(data.feelings.averageFeelingsSaved)}
          hint="Average in a personal library"
        />
      </StatGrid>
    </div>
  )
}
