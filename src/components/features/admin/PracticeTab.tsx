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
import type { RangeDays } from './range'
import {
  formatCount,
  formatDecimal,
  formatPercent,
  humanize,
} from '~/lib/adminFormat'

const SOURCE_LABELS: Record<string, string> = {
  builtin: 'Built-in scenarios',
  user_created: 'Custom scenarios',
  daily: 'Daily challenges',
  removed: 'Scenarios since removed',
}

/** How conversations go, where people stop, and what they choose to practice. */
export function PracticeTab({ days }: { days: RangeDays }) {
  const data = useQuery(api.admin.practice, { days })
  const popularity = useQuery(api.admin.scenarioPopularity)
  if (data === undefined || popularity === undefined) return <AdminLoading />

  const { totals } = data
  const choiceRows = (
    rows: Array<{ label: string; started: number; completed: number }>,
    labelOf: (label: string) => string,
  ) =>
    rows.map((row) => ({
      label: labelOf(row.label),
      value: row.started,
      display: `${row.started} started`,
      detail: `${row.completed} wrapped up`,
    }))

  return (
    <div className="space-y-6">
      {data.truncated && (
        <EmptyNote>
          This range holds more conversations than one read can cover, so the
          figures below describe the most recent {formatCount(totals.opened)}.
          A shorter range gives the full picture.
        </EmptyNote>
      )}

      <StatGrid>
        <StatTile
          label="Conversations started"
          value={formatCount(totals.started)}
          hint={`${formatCount(totals.opened - totals.started)} more were opened and left before a first message`}
        />
        <StatTile
          label="Wrapped up"
          value={formatPercent(totals.completionRate)}
          hint={`${formatCount(totals.completed)} finished, ${formatCount(totals.stillOpen)} still open, ${formatCount(totals.abandoned)} started over`}
        />
        <StatTile
          label="Average final score"
          value={formatDecimal(totals.averageFinalScore)}
          hint="Out of 100, finished conversations"
        />
        <StatTile
          label="Turns to finish"
          value={formatDecimal(totals.averageTurns)}
          hint={`${formatCount(totals.hitTurnCap)} ran into the turn limit`}
        />
      </StatGrid>

      {totals.started === 0 ? (
        <EmptyNote>No conversations were started in this range.</EmptyNote>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section
              title="How far people get"
              description="Of the conversations with at least one message, the share that reached each point."
            >
              <RankedBars
                max={100}
                rows={data.milestones.map((m) => ({
                  label: m.label,
                  value: m.rate,
                  display: `${formatPercent(m.rate)} (${formatCount(m.count)})`,
                }))}
              />
            </Section>

            <Section
              title="Where unfinished conversations stop"
              description="Conversations left open for more than a day, by how many messages the person had sent. A pile-up early on points at the opening; later, at fatigue."
            >
              {data.dropOff.every((d) => d.count === 0) ? (
                <EmptyNote>
                  Nobody has left a conversation unfinished in this range.
                </EmptyNote>
              ) : (
                <RankedBars
                  rows={data.dropOff
                    .filter((d) => d.count > 0)
                    .map((d) => ({
                      label: `After ${d.turns} ${d.turns === 1 ? 'message' : 'messages'}`,
                      value: d.count,
                    }))}
                />
              )}
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section
              title="Which piece is hardest"
              description="Average score out of 25, counted only in messages that attempted the piece. The lowest bar is where lessons and hints could help most."
            >
              <RankedBars
                max={25}
                rows={data.skills.map((s) => ({
                  label: humanize(s.component),
                  value: s.averageScore,
                  display: `${formatDecimal(s.averageScore)} of 25`,
                  detail: `Attempted in ${formatCount(s.attempts)} messages`,
                }))}
              />
            </Section>

            <Section
              title="Stars earned"
              description="Finished conversations by result."
            >
              <RankedBars
                rows={[...data.stars].reverse().map((s) => ({
                  label:
                    s.stars === 0
                      ? 'No stars (below 60)'
                      : `${s.stars} ${s.stars === 1 ? 'star' : 'stars'}`,
                  value: s.count,
                }))}
              />
              <p className="text-sm text-brown-500 mt-4">
                {formatPercent(totals.jackalRate)} of{' '}
                {formatCount(totals.scoredMessages)} scored messages leaned on
                blame or judgment. People took a message back{' '}
                {formatDecimal(totals.rewindsPerConversation)} times per
                conversation on average.
              </p>
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Section title="By kind of scenario">
              <RankedBars
                rows={choiceRows(
                  data.bySource,
                  (label) => SOURCE_LABELS[label] ?? humanize(label),
                )}
              />
            </Section>
            <Section title="By difficulty">
              <RankedBars rows={choiceRows(data.byDifficulty, humanize)} />
            </Section>
            <Section title="By topic">
              <RankedBars rows={choiceRows(data.byCategory, humanize)} />
            </Section>
          </div>
        </>
      )}

      <Section
        title="Scenario popularity, all time"
        description="Built-in scenarios by name. Custom scenarios come from real situations in people's lives, so they are counted together and never named."
      >
        {popularity.length === 0 ? (
          <EmptyNote>Nobody has started a scenario yet.</EmptyNote>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <th className={thClass}>Scenario</th>
                <th className={thClass}>Difficulty</th>
                <th className={`${thClass} ${numClass}`}>People started</th>
                <th className={`${thClass} ${numClass}`}>People finished</th>
                <th className={`${thClass} ${numClass}`}>Attempts</th>
                <th className={`${thClass} ${numClass}`}>Mastered</th>
                <th className={`${thClass} ${numClass}`}>Avg best score</th>
              </tr>
            </thead>
            <tbody>
              {popularity.map((row) => (
                <tr key={row.key}>
                  <td className={`${tdClass} font-medium`}>{row.title}</td>
                  <td className={tdClass}>
                    {row.difficulty ? humanize(row.difficulty) : ''}
                  </td>
                  <td className={`${tdClass} ${numClass}`}>
                    {formatCount(row.usersStarted)}
                  </td>
                  <td className={`${tdClass} ${numClass}`}>
                    {formatCount(row.usersFinished)}
                  </td>
                  <td className={`${tdClass} ${numClass}`}>
                    {formatCount(row.attempts)}
                  </td>
                  <td className={`${tdClass} ${numClass}`}>
                    {formatCount(row.mastered)}
                  </td>
                  <td className={`${tdClass} ${numClass}`}>
                    {row.usersFinished > 0
                      ? formatDecimal(row.averageBestScore)
                      : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Section>
    </div>
  )
}
