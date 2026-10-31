import type { UserErrorCode } from '../../convex/lib/errors'

/**
 * Pull out a message the server wrote for the person using the app, in their
 * language.
 *
 * Only errors raised through `userError` on the server carry one. Everything
 * else is an internal failure whose details are redacted in production and
 * would not help anyone, so those fall back to the caller's warm default.
 * Pass `t.errors` as `messages` so a known code reads in the current language.
 */
export function userFacingMessage(
  error: unknown,
  fallback: string,
  messages: Record<UserErrorCode, string>,
): string {
  const data = (error as { data?: unknown } | null | undefined)?.data

  if (typeof data === 'object' && data !== null) {
    const payload = data as { kind?: unknown; code?: unknown; message?: unknown }
    if (payload.kind !== 'user') return fallback
    if (typeof payload.code === 'string' && payload.code in messages) {
      return messages[payload.code as UserErrorCode]
    }
    if (typeof payload.message === 'string') {
      return payload.message
    }
  }

  return fallback
}
