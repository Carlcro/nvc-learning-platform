/**
 * The user's local calendar date as YYYY-MM-DD.
 *
 * Sent along with practice events so streaks and check-ins follow the user's
 * own day instead of UTC (an evening session should not count as tomorrow).
 * The server validates it and only trusts it within one day of server time.
 */
export function localDateString(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
