import type { ReactNode } from 'react'
import { Card } from '~/components/ui/Card'

/** A titled card: the unit every admin page is built from. */
export function Section({
  title,
  description,
  aside,
  children,
}: {
  title: string
  description?: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 mb-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-brown-800">{title}</h2>
          {description && (
            <p className="text-sm text-brown-500 mt-1 max-w-prose">
              {description}
            </p>
          )}
        </div>
        {aside}
      </div>
      {children}
    </Card>
  )
}

/** One headline number. Used where a chart would say less than the figure. */
export function StatTile({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-brown-500">{label}</p>
      <p className="text-2xl font-bold text-brown-800 mt-1 tabular-nums">
        {value}
      </p>
      {hint && <p className="text-xs text-brown-400 mt-1">{hint}</p>}
    </Card>
  )
}

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{children}</div>
  )
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-brown-500 bg-giraffe-50 rounded-lg px-4 py-3">
      {children}
    </p>
  )
}

/** Shared table styling. Wide tables scroll inside their card, never the page. */
export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  )
}

export const thClass =
  'py-2 pr-4 font-semibold text-brown-500 border-b-2 border-giraffe-100 whitespace-nowrap'
export const tdClass =
  'py-2 pr-4 text-brown-700 border-b border-giraffe-50 whitespace-nowrap'
export const numClass = 'text-right tabular-nums'
