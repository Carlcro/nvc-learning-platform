import { convexAuth } from '@convex-dev/auth/server'
import GitHub from '@auth/core/providers/github'
import { Password } from '@convex-dev/auth/providers/Password'
import { ResendPasswordReset } from './passwordReset'

/**
 * Convex Auth configuration for the NVC Learning Platform
 *
 * Currently configured with:
 * - GitHub OAuth (requires AUTH_GITHUB_ID and AUTH_GITHUB_SECRET in env)
 * - Email/Password, with password reset by emailed code (requires
 *   RESEND_API_KEY and AUTH_EMAIL_FROM in env)
 * - Google OAuth (uncomment when credentials are added)
 *
 * The convexAuth function automatically registers:
 * - auth:signIn action
 * - auth:signOut action
 * - auth:store mutation
 * These are available to the frontend automatically.
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    GitHub,
    // Email and password, with reset by emailed code so a forgotten password
    // is recoverable instead of locking someone out of their progress.
    Password({ reset: ResendPasswordReset }),

    // Google OAuth (enable when you add credentials)
    // To enable Google OAuth:
    // 1. Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET to Convex env
    // 2. Uncomment the Google provider below
    // 3. Uncomment the Google sign-in button in SignInForm.tsx
    // Google,
  ],
})
