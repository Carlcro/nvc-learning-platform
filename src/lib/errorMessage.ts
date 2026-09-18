/**
 * Pull out a message the server wrote for the person using the app.
 *
 * Only errors raised through `userError` on the server carry one. Everything
 * else is an internal failure whose details are redacted in production and
 * would not help anyone, so those fall back to the caller's warm default.
 */
export function userFacingMessage(error: unknown, fallback: string): string {
  const data = (error as { data?: unknown } | null | undefined)?.data

  if (typeof data === 'object' && data !== null) {
    const payload = data as { kind?: unknown; message?: unknown }
    if (payload.kind === 'user' && typeof payload.message === 'string') {
      return payload.message
    }
  }

  return fallback
}
