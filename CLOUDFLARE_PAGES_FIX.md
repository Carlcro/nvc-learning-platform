# Cloudflare Pages Deployment Fix

## The Problem

You're getting an error about Wrangler assets because Cloudflare Pages is detecting the `dist/server` folder and trying to deploy it as a Cloudflare Worker (which uses wrangler).

The error message indicates Cloudflare is attempting to use `wrangler deploy` instead of just deploying static files.

## The Solution

You need to configure Cloudflare Pages to **ONLY** use `dist/client` and ignore the server folder.

### Step 1: Go to Your Cloudflare Pages Project Settings

1. Visit https://dash.cloudflare.com
2. Click **Workers & Pages** → **Pages**
3. Select your project: `nvc-learning-platform`
4. Click on the project name to open it
5. Click **Settings**

### Step 2: Update Build Settings

In the **Build configuration** section, make sure these values are EXACTLY:

| Field | Value |
|-------|-------|
| **Build command** | `npm run build` |
| **Build output directory** | `dist/client` |
| **Root directory** | (leave blank/empty) |

**IMPORTANT**: The build output directory MUST be `dist/client` (not just `dist`)

### Step 3: Verify Settings

Click **Save** to save your settings.

### Step 4: Trigger New Deployment

1. Click **Deployments**
2. Click **Create deployment** to manually trigger a new build
3. Watch the build progress
4. It should now succeed and deploy only the client files

## Why This Works

- `dist/client/` contains ONLY static frontend files → Cloudflare Pages deploys these
- `dist/server/` contains server code → This is NOT deployed to Pages (it's for SSR, which we don't need on Pages)
- By specifying `dist/client` as the output, Cloudflare ignores the server folder entirely

## Cloudflare Pages vs Workers

| Aspect | Pages | Workers |
|--------|-------|---------|
| Use case | Static sites, frontend apps | Backend APIs, serverless functions |
| Configuration | Dashboard only | wrangler.toml or wrangler.jsonc |
| Deployment | Git-based auto-deploy | Manual or CI/CD |
| File types | HTML, CSS, JS, images | JavaScript/TypeScript functions |

Your NVC Learning Platform is a **Pages** project (frontend + Convex backend), not a Workers project.

## If You Continue Getting Errors

1. **Check build output directory** - Make ABSOLUTELY sure it says `dist/client` (not `dist`)
2. **Clear Cloudflare cache** - Sometimes old settings persist
3. **Delete and recreate** - Delete the Pages project and reconnect your GitHub repo
4. **Check git** - Make sure your code is pushed to GitHub with the latest changes

## Important Files

You can remove these files if they exist (they're not needed for Pages):
- `wrangler.toml` (unless you're using Cloudflare Workers for the backend)
- `wrangler.jsonc`

For Pages deployment, you only need:
- `package.json` (with build script)
- `vite.config.ts` (with build config)
- Your source code

## Testing After Deployment

Once deployment succeeds:
1. Visit your Pages URL (e.g., `https://nvc-learning-platform.pages.dev`)
2. Verify pages load
3. Check browser console (F12) for any errors
4. Test that Convex API calls work

## Further Help

If you're still having issues:
1. Check Cloudflare Pages build logs (in Deployments section)
2. Review the error messages carefully
3. Make sure `dist/client` directory exists locally after running `npm run build`
4. Verify your GitHub repo has the latest code pushed
