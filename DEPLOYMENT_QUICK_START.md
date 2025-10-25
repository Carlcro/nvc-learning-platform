# Quick Start: Deploy to Cloudflare Pages in 15 Minutes

## What You Need
- GitHub account
- Cloudflare account (free tier works!)
- Your codebase (already has build setup ✅)

---

## Step-by-Step (Copy & Paste)

### 1️⃣ COMMIT & PUSH TO GITHUB

```bash
# Verify build works
npm run build

# Commit any remaining changes
git add .
git commit -m "chore: prepare for deployment"

# If you don't have a remote yet, create GitHub repo first at github.com/new
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/nvc-learning-platform.git
git branch -M main
git push -u origin main
```

✅ **Check**: Visit `https://github.com/YOUR_USERNAME/nvc-learning-platform` - you should see your code

---

### 2️⃣ DEPLOY CONVEX (Your Backend)

```bash
npx convex deploy
```

This outputs something like:
```
Deployed to https://fuzzy-deer-123.convex.cloud
```

**COPY AND SAVE THIS URL** - you'll need it soon!

---

### 3️⃣ CONNECT CLOUDFLARE PAGES

1. Go to https://dash.cloudflare.com
2. Click **Workers & Pages** → **Pages** → **Create application** → **Connect to Git**
3. **Authorize Cloudflare** to access your GitHub
4. **Select repository**: `nvc-learning-platform`
5. **Install & Authorize**

---

### 4️⃣ CONFIGURE BUILD SETTINGS

When prompted to configure the project, use these settings:

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build` |
| **Build output directory** | `dist/client` |
| **Root directory** | (leave blank) |
| **Production branch** | `main` |

Then click **Save and Deploy**

---

### 5️⃣ ADD ENVIRONMENT VARIABLES

1. After deploy created, go to **Settings** → **Environment variables**
2. Add this variable for **Production**:
   - **Name**: `CONVEX_URL`
   - **Value**: (paste the URL from Step 2️⃣)
3. Click **Save**

---

### 6️⃣ REDEPLOY WITH ENVIRONMENT VARIABLES

1. Go to **Deployments**
2. Click **Create deployment**
3. Wait for build to complete (~2 min)
4. Look for green checkmark ✅

---

### 7️⃣ TEST IT!

Your production URL is shown in the Deployments page. It looks like:
```
https://nvc-learning-platform.pages.dev
```

**Click it and test**:
- ✅ Page loads
- ✅ Navigation works
- ✅ Lessons display
- ✅ No errors in console (F12)

---

## 🎉 YOU'RE LIVE!

Your app is now deployed! Share the URL with others:
```
https://nvc-learning-platform.pages.dev
```

---

## Future Deployments (Super Easy!)

Every time you push to `main`, it auto-deploys:

```bash
# Make changes
git add .
git commit -m "feature: add cool stuff"
git push origin main

# Wait 2-3 minutes, refresh your URL - deployed! 🚀
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails with "missing module" | Run `npm install` then `git push` |
| Site loads but API fails | Check `CONVEX_URL` is set correctly in Cloudflare |
| Blank page | Check browser console (F12) for errors |
| 404 on routes | This is TanStack Start SSR - usually works on Cloudflare |

---

## Need More Help?

- **Full guide**: See `DEPLOYMENT.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Convex docs**: https://docs.convex.dev
- **Cloudflare Pages docs**: https://developers.cloudflare.com/pages/

---

**That's it!** Your NVC Learning Platform is now live and accessible to everyone! 🦒💚
