import { Link } from '@tanstack/react-router'
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
import { RankedBars, TimeBars } from './Charts'
import type { RangeDays } from './range'
import {
  formatCount,
  formatDay,
  formatDecimal,
  formatUsd,
  kindLabel,
  plural,
} from '~/lib/adminFormat'

/** Growth, activity and spend over the chosen range. */
export function OverviewTab({ days }: { days: RangeDays }) {
  const data = useQuery(api.admin.overview, { days })
  if (data === undefined) return <AdminLoading />

  const { cost, series, allowance } = data
  const total = (key: 'signups' | 'turns' | 'costMicros') =>
    series.reduce((n, day) => n + day[key], 0)
  const paidKinds = data.costByKind.filter((k) => k.calls > 0)

  return (
    <div className="space-y-6">
      {data.costTrackingSince === null ? (
        <EmptyNote>
          No model calls have been measured yet. Costs appear here from the
          first practice turn taken after this panel was deployed. Earlier
          usage was never metered, so it cannot be priced after the fact.
        </EmptyNote>
      ) : (
        data.costTrackingSince > data.range.from && (
          <EmptyNote>
            Cost has been measured since {formatDay(data.costTrackingSince)}.
            Days before that show activity but no spend.
          </EmptyNote>
        )
      )}

      <StatGrid>
        <StatTile
          label="People signed up"
          value={formatCount(data.users.total)}
          hint={`${formatCount(data.users.newInRange)} new in this range`}
        />
        <StatTile
          label="Practiced in this range"
          value={formatCount(data.active.inRange)}
          hint={`${data.active.today} today, ${data.active.last7} this week, ${data.active.last30} this month`}
        />
        <StatTile
          label="Model cost in this range"
          value={formatUsd(cost.totalMicros)}
          hint={`${formatUsd(cost.todayMicros)} so far today`}
        />
        <StatTile
          label="Projected per month"
          value={formatUsd(cost.projectedMonthMicros)}
          hint="At the pace of the last 7 days"
        />
      </StatGrid>

      <StatGrid>
        <StatTile
          label="Cost per practice turn"
          value={formatUsd(cost.perTurnMicros)}
          hint="Scoring plus the character reply"
        />
        <StatTile
          label="Cost per active person"
          value={formatUsd(cost.perActiveUserMicros)}
          hint="In this range, nightly job left out"
        />
        <StatTile
          label="Practice turns"
          value={formatCount(total('turns'))}
          hint="In this range"
        />
        <StatTile
          label="Nightly challenges job"
          value={formatUsd(cost.cronMicros)}
          hint="Runs whether or not anyone practices"
        />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Model cost per day">
          <TimeBars
            data={series.map((d) => ({ date: d.date, value: d.costMicros }))}
            formatValue={formatUsd}
            formatDate={formatDay}
            summary={`${formatUsd(total('costMicros'))} in total`}
          />
        </Section>
        <Section
          title="People practicing per day"
          description="Anyone who took a practice turn or shaped a scenario that day."
        >
          <TimeBars
            data={series.map((d) => ({ date: d.date, value: d.activeUsers }))}
            formatValue={formatCount}
            formatDate={formatDay}
            summary={`${formatCount(data.active.inRange)} ${data.active.inRange === 1 ? 'person' : 'different people'} in total`}
          />
        </Section>
        <Section title="Practice turns per day">
          <TimeBars
            data={series.map((d) => ({ date: d.date, value: d.turns }))}
            formatValue={formatCount}
            formatDate={formatDay}
            summary={`${formatCount(total('turns'))} turns in total`}
          />
        </Section>
        <Section title="Sign-ups per day">
          <TimeBars
            data={series.map((d) => ({ date: d.date, value: d.signups }))}
            formatValue={formatCount}
            formatDate={formatDay}
            summary={`${formatCount(total('signups'))} new ${total('signups') === 1 ? 'person' : 'people'}`}
          />
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="Where the money goes"
          description="Spend by what the model was asked to do. This is where a cheaper model or a shorter prompt would pay off most."
        >
          {paidKinds.length === 0 ? (
            <EmptyNote>Nothing measured in this range yet.</EmptyNote>
          ) : (
            <RankedBars
              rows={[...paidKinds]
                .sort((a, b) => b.costMicros - a.costMicros)
                .map((k) => ({
                  label: kindLabel(k.kind),
                  value: k.costMicros,
                  display: formatUsd(k.costMicros),
                  detail: `${plural(k.calls, 'call', 'calls')}, ${formatCount(k.inputTokens / k.calls)} tokens in and ${formatCount(k.outputTokens / k.calls)} out on average`,
                }))}
            />
          )}
        </Section>

        <Section
          title="How much of the daily allowance people use"
          description={`Each person may take ${allowance.maxTurnsPerDay} practice turns a day. Counted per person per day they practiced.`}
        >
          {allowance.userDays === 0 ? (
            <EmptyNote>No practice in this range yet.</EmptyNote>
          ) : (
            <>
              <p className="text-sm text-brown-700 mb-4">
                A typical day is{' '}
                <strong>{plural(allowance.median, 'turn', 'turns')}</strong>, a
                heavy day (9 in 10 are below it) is{' '}
                <strong>{formatDecimal(allowance.p90)}</strong>, and the most
                anyone took was <strong>{allowance.max}</strong>. The limit was
                reached {allowance.capHits}{' '}
                {allowance.capHits === 1 ? 'time' : 'times'}.
              </p>
              <RankedBars
                rows={allowance.buckets.map((b) => ({
                  label: `${b.label} turns`,
                  value: b.count,
                  display: `${b.count} ${b.count === 1 ? 'day' : 'days'}`,
                }))}
              />
            </>
          )}
        </Section>
      </div>

      <Section
        title="Who costs the most in this range"
        description="The ten people with the highest measured model cost."
      >
        {data.topSpenders.length === 0 ? (
          <EmptyNote>No practice in this range yet.</EmptyNote>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <th className={thClass}>Person</th>
                <th className={`${thClass} ${numClass}`}>Turns</th>
                <th className={`${thClass} ${numClass}`}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.topSpenders.map((person) => (
                <tr key={person.userId}>
                  <td className={tdClass}>
                    <Link
                      to="/admin/users/$userId"
                      params={{ userId: person.userId }}
                      className="font-medium text-giraffe-700 hover:underline"
                    >
                      {person.name || person.email || 'Unnamed learner'}
                    </Link>
                  </td>
                  <td className={`${tdClass} ${numClass}`}>
                    {formatCount(person.turns)}
                  </td>
                  <td className={`${tdClass} ${numClass}`}>
                    {formatUsd(person.costMicros)}
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
