# Cloudflare Workers Deployment Guide

This document explains how to deploy the NVC Learning Platform to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account** - Create one at https://dash.cloudflare.com
2. **Wrangler CLI** - Already installed as dev dependency
3. **Cloudflare API Token** - Generate from https://dash.cloudflare.com/profile/api-tokens

## Step 1: Authenticate with Cloudflare

Run the login command:

```bash
npx wrangler login
```

This will open a browser window to create an API token. Copy the token and paste it when prompted.

## Step 2: Set Environment Secrets

Your app uses Convex and potentially the Anthropic API. Set these as secrets:

```bash
# Set Convex URL
npx wrangler secret put VITE_CONVEX_URL
# Paste: https://good-vole-921.convex.cloud

# Set Anthropic API key (if using AI features)
npx wrangler secret put ANTHROPIC_API_KEY
# Paste your API key from https://console.anthropic.com

# For production environment
npx wrangler secret put VITE_CONVEX_URL --env production
npx wrangler secret put ANTHROPIC_API_KEY --env production
```

## Step 3: Deploy

### Development Deployment

```bash
npx wrangler deploy
```

### Production Deployment

```bash
npx wrangler deploy --env production
```

## Step 4: Configure Custom Domain (Optional)

1. Go to https://dash.cloudflare.com
2. Select your Workers project
3. Go to **Triggers** → **Routes**
4. Add your custom domain route
5. Configure DNS to point to Cloudflare Workers

## Deployment Structure

```
dist/
├── client/              # Static assets (CSS, JS, images)
│   └── assets/         # Bundled assets
└── server/
    ├── server.js       # Main Worker script
    └── assets/         # Server-side assets
```

- **dist/server/server.js** - Main entry point (specified in wrangler.toml)
- **dist/client/** - Static files served by the Worker

## Environment Configuration

### Development (.env.local)
```
VITE_CONVEX_URL=https://good-vole-921.convex.cloud
```

### Production (.env.production)
```
VITE_CONVEX_URL=https://good-vole-921.convex.cloud
NODE_ENV=production
```

Secrets are set via `wrangler secret put` command (not in .env files).

## Monitoring Deployments

View real-time logs:

```bash
npx wrangler tail
```

View recent deployments:

```bash
npx wrangler deployments list
```

## Troubleshooting

### Build Errors
```bash
npm run build  # Test build locally first
```

### Deploy Errors
```bash
npx wrangler publish --verbose  # Use verbose flag for debugging
```

### Clear Cache
```bash
npx wrangler deployments list  # See all versions
npx wrangler rollback --message "Rolling back to previous version"
```

## Performance Tips

1. **Static Asset Caching** - Use Cloudflare's cache rules
2. **KV Storage** - For session data or caching (configured in wrangler.toml)
3. **Durable Objects** - For rate limiting and state management (future enhancement)

## Additional Resources

- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [TanStack Start Deployment](https://tanstack.com/start/latest/docs/guide/deployment)

---

**Last Updated**: October 25, 2025
**Status**: Ready for deployment
