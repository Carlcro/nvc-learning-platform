# Deployment Checklist - NVC Learning Platform

Use this checklist to deploy your app to production on Cloudflare Pages.

## ✅ Pre-Deployment

- [ ] All TypeScript errors resolved (`npm run build` succeeds)
- [ ] All tests pass (if you have tests)
- [ ] No console errors in development (`npm run dev`)
- [ ] `.env.local` is in `.gitignore` (don't commit secrets!)
- [ ] Recent commits pushed to local main branch

## ✅ GitHub Setup

- [ ] GitHub account created
- [ ] New repository created (public)
- [ ] Remote origin added: `git remote add origin https://github.com/USERNAME/nvc-learning-platform.git`
- [ ] Code pushed to main: `git push -u origin main`
- [ ] Can see code in GitHub repository online

## ✅ Convex Production

- [ ] Logged into Convex: `npx convex dev` starts successfully
- [ ] Run `npx convex deploy` to create production deployment
- [ ] Note the production URL (looks like: `https://xxxx.convex.cloud`)
- [ ] Test that Convex queries/mutations work in production

## ✅ Cloudflare Pages Setup

### First-time setup:
- [ ] Cloudflare account created (free tier is fine)
- [ ] Logged into Cloudflare dashboard (https://dash.cloudflare.com)
- [ ] Went to **Workers & Pages**
- [ ] Clicked **Pages** → **Create application** → **Connect to Git**
- [ ] Authorized Cloudflare to access GitHub
- [ ] Selected `nvc-learning-platform` repository
- [ ] Clicked **Install & Authorize**

### Build Configuration:
- [ ] **Build command**: `npm run build`
- [ ] **Build output directory**: `dist/client`
- [ ] **Root directory**: (left blank)

### Environment Variables:
In Cloudflare Pages Settings → Environment variables (Production):
- [ ] `CONVEX_URL`: Set to your production URL from Convex
- [ ] Any other needed variables configured

## ✅ First Deployment

- [ ] Cloudflare Pages shows a deployment in progress
- [ ] Build completes successfully (no red X)
- [ ] Deployment gets a production URL (e.g., `https://nvc-learning-platform.pages.dev`)
- [ ] Can visit the URL in browser
- [ ] Page loads (no blank screen)
- [ ] Navigation works
- [ ] Lessons display correctly
- [ ] API calls to Convex succeed
- [ ] Browser console has no red errors (F12)

## ✅ Verification

- [ ] Home page loads
- [ ] Learn section displays all lessons
- [ ] Clicking a lesson navigates to it
- [ ] Quiz functionality works
- [ ] Test Scoring page functions correctly
- [ ] No 404 errors for routes
- [ ] Mobile responsive design works
- [ ] Styling/colors display correctly

## ✅ Monitoring

- [ ] Bookmarked production URL
- [ ] Checked Cloudflare Analytics
- [ ] Verified no errors in Convex logs (dashboard.convex.dev)
- [ ] Confirmed no errors in Cloudflare Pages logs

## ✅ Future Deployments

For all future changes:
1. Make changes locally
2. Test with `npm run build`
3. Commit: `git commit -m "feature: description"`
4. Push: `git push origin main`
5. Wait ~2-3 minutes for Cloudflare to deploy automatically
6. Verify at your production URL

## ⚠️ Common Issues

**Build fails with missing dependencies**
- Run `npm install`
- Commit `package-lock.json`: `git add package-lock.json && git commit`
- Push again

**Site loads but API calls fail**
- Check `CONVEX_URL` in Cloudflare environment variables
- Verify it exactly matches output from `npx convex deploy`
- Check Convex dashboard for errors
- Make sure your Convex functions are deployed

**Blank page or styles missing**
- Check browser Network tab (F12) for failed requests
- Verify build output directory is `dist/client`
- Run `npm run build` locally - does it work?

**Routing issues (404 on routes)**
- TanStack Start requires specific server handling
- Cloudflare Pages may need additional configuration
- Check if routes are defined in `src/routes/`

## 🎉 Success!

Once all items are checked, you have successfully deployed your NVC Learning Platform to production!

Your app is now live and accessible to anyone with the URL. Share it with others who want to learn NVC! 🦒💚

---

## Next Steps

- [ ] Share the URL with friends/colleagues
- [ ] Monitor performance and gather feedback
- [ ] Plan next features to implement
- [ ] Consider custom domain (optional)
- [ ] Set up analytics tracking (optional)
