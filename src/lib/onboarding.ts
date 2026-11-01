/** Where the welcome tour lives. */
export const WELCOME_PATH = '/welcome'

/**
 * A safe place to return to after the tour: an internal path only, never the
 * tour itself or the sign-in page, so a crafted link cannot send anyone off
 * the site or into a loop.
 */
export function safeReturnPath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  if (!value.startsWith('/') || value.startsWith('//')) return undefined
  if (value.startsWith(WELCOME_PATH) || value.startsWith('/auth')) {
    return undefined
  }
  return value
}

/** Pages the tour never interrupts: itself, and sign-in while it hands off. */
export function skipsOnboardingRedirect(pathname: string): boolean {
  return pathname.startsWith(WELCOME_PATH) || pathname.startsWith('/auth')
}
