import { convexAuth } from '@convex-dev/auth/server'
import GitHub from '@auth/core/providers/github'
import { Password } from '@convex-dev/auth/providers/Password'

/**
 * Convex Auth configuration for the NVC Learning Platform
 *
 * Currently configured with:
 * - GitHub OAuth (requires AUTH_GITHUB_ID and AUTH_GITHUB_SECRET in env)
 * - Email/Password (Password provider)
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
    Password, // Add this for email/password auth

    // Google OAuth (enable when you add credentials)
    // To enable Google OAuth:
    // 1. Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET to Convex env
    // 2. Uncomment the Google provider below
    // 3. Uncomment the Google sign-in button in SignInForm.tsx
    // Google,
  ],
})
