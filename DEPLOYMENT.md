# Deployment Guide: NVC Learning Platform to Cloudflare Pages

## Overview

Your NVC Learning Platform uses:
- **Frontend**: TanStack Start + React (deployed to Cloudflare Pages)
- **Backend**: Convex (serverless functions - deployed to Convex Cloud)

This guide covers deploying both to production.

---

## Prerequisites

1. **GitHub Account** - For version control and CI/CD
2. **Cloudflare Account** - Free tier is sufficient
3. **Convex Account** - Already set up (check `convex.json`)
4. **Git** - Installed locally

---

## Step 1: Prepare for Deployment

### 1.1 Clean up any uncommitted changes
```bash
git status
git add .
git commit -m "fix: resolve TypeScript errors and prepare for deployment"
```

### 1.2 Verify build succeeds locally
```bash
npm run build
```

You should see:
- ✓ Client build succeeded (~402 KB gzip)
- ✓ Server build succeeded

---

## Step 2: Push Code to GitHub

### 2.1 Create a new GitHub repository (if you don't have one)
1. Go to https://github.com/new
2. Repository name: `nvc-learning-platform`
3. Description: "Interactive web app for learning Non-Violent Communication"
4. Make it **Public** (so Cloudflare Pages can access it)
5. Don't initialize with README (you have one locally)
6. Click "Create repository"

### 2.2 Push your local code
```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/nvc-learning-platform.git

# Create main branch and push
git branch -M main
git push -u origin main
```

---

## Step 3: Configure Convex for Production

### 3.1 Set up production deployment
```bash
npx convex deploy
```

This will:
1. Ask you to log in (if not already)
2. Create a production deployment
3. Generate `.env.local` with production keys

### 3.2 Store production Convex URL
The command will output your production URL. You'll need this for environment variables:
```
https://YOUR_DEPLOYMENT.convex.cloud
```

### 3.3 Store the Convex key
```bash
cat .env.local
# Look for: CONVEX_URL=...
```

Save these values - you'll need them in Cloudflare Pages settings.

---

## Step 4: Deploy to Cloudflare Pages

### 4.1 Connect Cloudflare Pages to GitHub
1. Go to https://dash.cloudflare.com
2. Click **Workers & Pages** → **Pages**
3. Click **Connect to Git**
4. Authorize Cloudflare to access GitHub
5. Select your `nvc-learning-platform` repository
6. Click **Install & Authorize**

### 4.2 Configure build settings
When the integration redirects you to set up the project:

**Project name**: `nvc-learning-platform`

**Build settings**:
- **Framework preset**: None (we use Vite)
- **Build command**: `npm run build`
- **Build output directory**: `dist/client`
- **Root directory**: `/` (leave blank)

### 4.3 Set environment variables
1. After deployment is created, go to **Settings** → **Environment variables**
2. Add for production environment:
   - `CONVEX_URL`: (from Step 3.2)
   - `CONVEX_API_KEY`: (from Step 3.2, if needed)

If you also use other env vars:
```
PUBLIC_API_ENDPOINT=https://api.example.com
```

### 4.4 Trigger first deployment
1. Go to **Deployments**
2. Click **Create deployment** (or just wait - it auto-deploys when you push)
3. Watch the build progress

---

## Step 5: Test Your Deployment

### 5.1 Check deployment status
1. In Cloudflare Pages dashboard, check if build succeeded
2. Look for the **Production URL**: `https://nvc-learning-platform.pages.dev`

### 5.2 Test the site
1. Visit https://nvc-learning-platform.pages.dev
2. Test main functionality:
   - ✅ Page loads without errors
   - ✅ Navigation works
   - ✅ Learning lessons display
   - ✅ Quiz functionality works
   - ✅ API calls to Convex succeed

### 5.3 Check browser console for errors
Open DevTools (F12) → Console tab and verify there are no red errors

---

## Step 6: Configure Custom Domain (Optional)

If you have a custom domain:

1. Go to Cloudflare dashboard
2. **Workers & Pages** → **Pages** → Your project → **Custom domain**
3. Add your domain (e.g., `nvc-learning.com`)
4. Follow DNS instructions from Cloudflare

---

## Step 7: Set Up Automatic Deployments

Your Cloudflare Pages should now auto-deploy whenever you push to the `main` branch:

```bash
# Make changes locally
git add .
git commit -m "feature: add new lesson"
git push origin main

# Cloudflare will automatically:
# 1. Clone your repo
# 2. Run: npm run build
# 3. Deploy dist/client to Cloudflare Pages
```

---

## Troubleshooting

### Build fails with "cannot find module"

**Solution**: Make sure all dependencies are in `package.json`
```bash
npm install --save missing-package
git add package.json package-lock.json
git commit -m "add missing dependency"
git push
```

### Site loads but API calls fail

**Check**:
1. `CONVEX_URL` is set correctly in Cloudflare Pages environment variables
2. CORS is enabled in Convex (should be by default)
3. Check browser Network tab to see actual error response

### Blank page or routing issues

**Check**:
1. Build output directory is correct: `dist/client`
2. Run `npm run build` locally and verify no errors
3. Check Cloudflare Pages build logs for errors
4. Verify all required files are in git (not in `.gitignore`)

### SSR Issues with TanStack Start

If you're having server-side rendering issues:
1. Check that `dist/server` exists after build
2. Verify `vite.config.ts` includes TanStack Start plugin
3. Note: Cloudflare Pages may require different SSR configuration

---

## Monitoring & Maintenance

### Weekly checks:
```bash
# Keep dependencies updated
npm update

# Check for security vulnerabilities
npm audit

# Run tests before deploying
npm run lint
npm run build
```

### Monitor Cloudflare Pages:
- Go to your project → **Analytics**
- Watch for build failures or performance issues

### Monitor Convex:
- Go to https://dashboard.convex.dev
- Check database storage and API call usage
- Review function logs for errors

---

## Rollback to Previous Version

If something breaks:

1. **Find the commit**:
```bash
git log --oneline
git revert COMMIT_HASH
```

2. **Push the revert**:
```bash
git push origin main
```

3. **Cloudflare Pages will automatically deploy** the reverted version

---

## Updating Environment Variables After Deployment

If you need to change env variables:

1. Go to Cloudflare Pages → Your project → **Settings** → **Environment variables**
2. Update the variable
3. Go to **Deployments** and click **Create deployment** to redeploy with new vars

Or just commit any change to `main` branch to trigger a new deployment.

---

## Next Steps

### Performance Optimization:
- Enable Brotli compression in Cloudflare
- Set up caching rules for static assets
- Use Cloudflare's analytics to monitor performance

### Advanced Features:
- Add Cloudflare Workers for custom API routes
- Set up analytics tracking
- Enable rate limiting for security

### Scaling:
- Monitor Convex database usage
- Set up alerts for high usage
- Consider upgrading plan if needed

---

## Support

If you encounter issues:

1. **Check Cloudflare Pages logs**: Dashboard → Your project → Recent deployments
2. **Check Convex logs**: https://dashboard.convex.dev → Functions → Logs
3. **Check browser DevTools**: F12 → Network and Console tabs
4. **Read the docs**:
   - Cloudflare Pages: https://developers.cloudflare.com/pages/
   - Convex: https://docs.convex.dev
   - TanStack Start: https://tanstack.com/start

---

## Questions?

See the CLAUDE.md file for more development guidelines and the PROJECT_SPEC.md for feature details.

Good luck with your deployment! 🦒💚
