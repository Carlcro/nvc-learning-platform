// convex/auth.config.ts

/**
 * Authentication configuration for Convex Auth
 * This file configures the authentication providers that can verify tokens
 */
export default {
  providers: [
    {
      // Your Convex deployment URL
      domain: process.env.CONVEX_SITE_URL,
      applicationID: 'convex',
    },
  ],
}
