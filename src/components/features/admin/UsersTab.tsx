import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { AdminLoading } from './AdminGate'
import {
  EmptyNote,
  Section,
  TableShell,
  numClass,
  tdClass,
  thClass,
} from './AdminParts'
import {
  formatAgo,
  formatCount,
  formatDecimal,
  formatTimestamp,
  formatUsd,
} from '~/lib/adminFormat'

type SortKey =
  | 'costMicros'
  | 'lastActiveAt'
  | 'joinedAt'
  | 'measuredTurns'
  | 'scenariosCompleted'
  | 'lessonsCompleted'
  | 'averageScore'
  | 'level'

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: 'costMicros', label: 'Cost' },
  { key: 'measuredTurns', label: 'Turns' },
  { key: 'scenariosCompleted', label: 'Finished' },
  { key: 'averageScore', label: 'Avg score' },
  { key: 'lessonsCompleted', label: 'Lessons' },
  { key: 'level', label: 'Level' },
  { key: 'lastActiveAt', label: 'Last active' },
  { key: 'joinedAt', label: 'Joined' },
]

/** Everyone, sortable by what they cost and how they use the app. */
export function UsersTab() {
  const users = useQuery(api.admin.listUsers)
  const [sortKey, setSortKey] = useState<SortKey>('costMicros')
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    if (!users) return []
    const needle = search.trim().toLowerCase()
    return users
      .filter(
        (u) =>
          !needle ||
          (u.name ?? '').toLowerCase().includes(needle) ||
          (u.email ?? '').toLowerCase().includes(needle),
      )
      .sort((a, b) => b[sortKey] - a[sortKey] || b.joinedAt - a.joinedAt)
  }, [users, sortKey, search])

  if (users === undefined) return <AdminLoading />

  return (
    <Section
      title={`Everyone (${formatCount(users.length)})`}
      description="Cost and turns are lifetime figures, measured since cost tracking began. Choose a column to sort by it, highest first."
      aside={
        <label className="block">
          <span className="sr-only">Search by name or email</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-56 px-3 py-2 text-sm rounded-lg border-2 border-giraffe-100 bg-white text-brown-800 placeholder:text-brown-300 focus:outline-none focus:border-giraffe-400"
          />
        </label>
      }
    >
      {rows.length === 0 ? (
        <EmptyNote>
          {users.length === 0
            ? 'Nobody has signed up yet.'
            : 'No one matches that search.'}
        </EmptyNote>
      ) : (
        <TableShell>
          <thead>
            <tr>
              <th className={thClass}>Person</th>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className={`${thClass} ${numClass}`}
                  aria-sort={sortKey === column.key ? 'descending' : 'none'}
                >
                  <button
                    type="button"
                    onClick={() => setSortKey(column.key)}
                    className={`cursor-pointer hover:text-brown-800 ${
                      sortKey === column.key
                        ? 'text-brown-800 underline underline-offset-4 decoration-giraffe-400 decoration-2'
                        : ''
                    }`}
                  >
                    {column.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.userId} className="hover:bg-giraffe-50">
                <td className={tdClass}>
                  <Link
                    to="/admin/users/$userId"
                    params={{ userId: user.userId }}
                    className="font-medium text-giraffe-700 hover:underline"
                  >
                    {user.name || user.email || 'Unnamed learner'}
                  </Link>
                  {user.name && user.email && (
                    <span className="block text-xs text-brown-400">
                      {user.email}
                    </span>
                  )}
                </td>
                <td className={`${tdClass} ${numClass} font-semibold`}>
                  {formatUsd(user.costMicros)}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {formatCount(user.measuredTurns)}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {formatCount(user.scenariosCompleted)}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {user.scenariosCompleted > 0
                    ? formatDecimal(user.averageScore)
                    : ''}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {formatCount(user.lessonsCompleted)}
                </td>
                <td className={`${tdClass} ${numClass}`}>{user.level}</td>
                <td className={`${tdClass} ${numClass}`}>
                  {formatAgo(user.lastActiveAt)}
                </td>
                <td className={`${tdClass} ${numClass}`}>
                  {formatTimestamp(user.joinedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </Section>
  )
}
