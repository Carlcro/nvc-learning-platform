import { useState } from 'react'

/**
 * The two chart forms the admin panel needs, drawn with plain elements.
 *
 * Both show a single series, so one hue carries the marks and the title names
 * what they are; no legend is needed. Numbers and labels stay in ink colors,
 * never the bar color.
 */

interface TimeBarsProps {
  /** Oldest first. */
  data: Array<{ date: string; value: number }>
  formatValue: (value: number) => string
  formatDate: (date: string) => string
  /** Shown when nothing is hovered, for example the total for the range. */
  summary: string
}

/** Change over time: one bar per day, rising from a shared baseline. */
export function TimeBars({
  data,
  formatValue,
  formatDate,
  summary,
}: TimeBarsProps) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.value), 0)
  const hovered = active === null ? null : data[active]

  return (
    <div>
      {/* The readout stands in for a floating tooltip: it never covers a bar
          and works the same with a keyboard. */}
      <p className="text-sm text-brown-700 mb-3 h-5" aria-live="polite">
        {hovered ? (
          <>
            <span className="font-semibold tabular-nums">
              {formatValue(hovered.value)}
            </span>
            <span className="text-brown-400"> on {formatDate(hovered.date)}</span>
          </>
        ) : (
          <span className="text-brown-500">{summary}</span>
        )}
      </p>

      <div className="flex gap-2">
        <div className="flex flex-col justify-between text-xs text-brown-400 tabular-nums text-right h-36 w-14 shrink-0">
          <span>{formatValue(max)}</span>
          <span>0</span>
        </div>

        <div
          className="flex-1 min-w-0 flex items-end gap-0.5 h-36 border-b border-brown-200"
          onMouseLeave={() => setActive(null)}
        >
          {data.map((point, index) => (
            // The hit target is the whole column, so a day with a tiny bar (or
            // none) is as easy to point at as a tall one.
            <button
              key={point.date}
              type="button"
              aria-label={`${formatDate(point.date)}: ${formatValue(point.value)}`}
              className="group flex-1 min-w-0 h-full flex items-end justify-center cursor-default focus:outline-none"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
            >
              <span
                className={`block w-full max-w-10 rounded-t transition-colors ${
                  active === index
                    ? 'bg-giraffe-600'
                    : 'bg-giraffe-400 group-focus-visible:bg-giraffe-600'
                }`}
                style={{
                  height:
                    max > 0 && point.value > 0
                      ? `max(2px, ${(point.value / max) * 100}%)`
                      : '0',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-xs text-brown-400 mt-1 pl-16">
        <span>{data.length > 0 ? formatDate(data[0].date) : ''}</span>
        <span>
          {data.length > 0 ? formatDate(data[data.length - 1].date) : ''}
        </span>
      </div>
    </div>
  )
}

interface RankedBarsProps {
  rows: Array<{
    label: string
    value: number
    /** What to print at the end of the row. Defaults to the value. */
    display?: string
    /** A second, quieter line under the label. */
    detail?: string
  }>
  /** Scale bars against this instead of the largest row, for example 100. */
  max?: number
}

/** Comparing amounts across named things: one horizontal bar per row. */
export function RankedBars({ rows, max }: RankedBarsProps) {
  const scale = max ?? Math.max(...rows.map((r) => r.value), 0)

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-brown-700 min-w-0">
              {row.label}
              {row.detail && (
                <span className="block text-xs text-brown-400">
                  {row.detail}
                </span>
              )}
            </span>
            <span className="font-semibold text-brown-800 tabular-nums shrink-0">
              {row.display ?? row.value.toLocaleString('en-US')}
            </span>
          </div>
          <div className="h-2 mt-1 rounded-full bg-giraffe-50">
            <div
              className="h-2 rounded-full bg-giraffe-400"
              style={{
                width:
                  scale > 0 && row.value > 0
                    ? `max(4px, ${Math.min(100, (row.value / scale) * 100)}%)`
                    : '0',
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
