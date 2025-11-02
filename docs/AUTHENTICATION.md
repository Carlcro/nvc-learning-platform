# Convex Auth Implementation Guide

This document explains the authentication system implemented in the NVC Learning Platform using Convex Auth.

## Overview

The app uses **Convex Auth** with multiple authentication providers:
- **GitHub OAuth** - Already configured
- **Email/Password** - Authentication via email and password
- **Google OAuth** - Ready to be configured when credentials are added

## Architecture

### Files Created/Modified

#### Backend (Convex)
- **`convex/auth.ts`** - Auth configuration with providers
- **`convex/users.ts`** - User management functions (queries & mutations)
- **`convex/schema.ts`** - Updated to include Convex Auth tables

#### Frontend (React)
- **`src/providers/ConvexAuthProvider.tsx`** - Provider wrapper combining Convex and Auth
- **`src/components/auth/SignInForm.tsx`** - Beautiful sign-in/sign-up form
- **`src/components/auth/ProtectedRoute.tsx`** - Route protection wrapper
- **`src/components/layout/UserMenu.tsx`** - User profile dropdown menu
- **`src/router.tsx`** - Updated to use ConvexAuthProvider
- **`src/routes/practice/index.tsx`** - Protected practice routes

## Database Schema Changes

### New Auth Tables (from authTables)
- **`users`** - Core authentication users table (provided by Convex Auth)
  - `_id` - User ID
  - `email` - Email address
  - `name` - Display name (optional)
  - `image` - Profile image URL (optional)
  - `emailVerificationTime` - When email was verified
  - `phoneNumber` - Phone number (optional)
  - `isAnonymous` - Whether user is anonymous

### Renamed Tables
- **`userProfiles`** (was `users`) - Extended user data
  - `userId` - Reference to auth users table
  - `currentStreak` - Current daily challenge streak
  - `longestStreak` - Longest streak achieved
  - `totalPoints` - Total points earned
  - `level` - User skill level (1-10)
  - `createdAt` - Profile creation timestamp
  - `updatedAt` - Last update timestamp

### Updated References
- **`userProgress`** - Now references `v.id("users")` from Convex Auth
- **`conversations`** - Now references `v.id("users")` from Convex Auth
- **`challengeCompletions`** - Now references `v.id("users")` from Convex Auth
- **`activityLogs`** - Now references `v.id("users")` from Convex Auth

## User Functions (convex/users.ts)

### Queries

#### `getCurrentUser`
Get the currently authenticated user

```typescript
const user = await useQuery(api.users.getCurrentUser);
```

Returns: `User | null` (null if not authenticated)

#### `getUserProfile`
Get the current user's full profile including auth data and progress stats

```typescript
const userProfile = await useQuery(api.users.getUserProfile);
// Returns: { user, profile } or null
```

Returns:
```typescript
{
  user: {
    _id: string,
    email: string,
    name?: string,
    // ... other auth fields
  },
  profile: {
    _id: string,
    userId: string,
    currentStreak: number,
    longestStreak: number,
    totalPoints: number,
    level: number,
    createdAt: number,
    updatedAt: number
  }
} | null
```

### Mutations

#### `initializeUserProfile`
Automatically creates a user profile after successful authentication

```typescript
const profile = await initializeUserProfile();
```

#### `updateUserProfile`
Update user profile information (name, etc.)

```typescript
const updated = await updateUserProfile({ name: "New Name" });
```

#### `updateUserProgress`
Add points and level up users (internal use)

```typescript
await updateUserProgress({
  userId: userId,
  pointsToAdd: 50
});
```

## UI Components

### SignInForm
Beautiful sign-in/sign-up form with multiple auth methods

**Location:** `src/components/auth/SignInForm.tsx`

**Features:**
- GitHub OAuth button
- Email/password authentication
- Signup/signin toggle
- Error handling
- NVC-aligned messaging

**Usage:**
```typescript
import { SignInForm } from '~/components/auth/SignInForm';

function MyPage() {
  return <SignInForm onSignInSuccess={() => navigate('/')} />;
}
```

### ProtectedRoute
Wrapper component that protects routes from unauthenticated access

**Location:** `src/components/auth/ProtectedRoute.tsx`

**Features:**
- Shows SignInForm for unauthenticated users
- Automatic profile initialization
- Loading states
- Graceful fallback

**Usage:**
```typescript
import { ProtectedRoute } from '~/components/auth/ProtectedRoute';

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  );
}
```

### UserMenu
User profile dropdown showing stats and logout

**Location:** `src/components/layout/UserMenu.tsx`

**Features:**
- Display user name and level
- Show stats (level, points, streak)
- Quick logout button
- Elegant dropdown UI

**Usage:**
```typescript
import { UserMenu } from '~/components/layout/UserMenu';

function Header() {
  return (
    <nav>
      <Logo />
      <UserMenu />
    </nav>
  );
}
```

## Environment Variables

### Required

```env
# Convex
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# GitHub OAuth (already set in Convex dashboard)
AUTH_GITHUB_ID=your_github_app_id
AUTH_GITHUB_SECRET=your_github_app_secret
```

### Optional (for later)

```env
# Google OAuth (when you add credentials)
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

## Setup Instructions

### 1. GitHub OAuth (Already Configured)

Your GitHub OAuth credentials are already set up in the Convex dashboard. The app will automatically use them.

### 2. Add Google OAuth (Optional)

To add Google OAuth later:

1. **Create Google OAuth credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Google+ API"
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs for your Convex deployment

2. **Add credentials to Convex:**
   - Go to Convex Dashboard → Project Settings → Auth
   - Add `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`

3. **Enable in code:**
   - Uncomment Google provider in `convex/auth.ts`:
   ```typescript
   import { Google } from "@convex-dev/auth/providers";

   Google({
     clientId: process.env.AUTH_GOOGLE_ID!,
     clientSecret: process.env.AUTH_GOOGLE_SECRET!,
   }),
   ```

   - Uncomment Google button in `src/components/auth/SignInForm.tsx`

### 3. Testing the Auth Flow

1. **Sign up with email:**
   - Go to `/` or try accessing `/practice`
   - Click "Create account"
   - Enter email and password (min 8 chars)
   - Check that profile is created

2. **Sign in with email:**
   - Sign out from user menu
   - Click "Sign in"
   - Use same email/password

3. **Sign in with GitHub:**
   - Click "Continue with GitHub"
   - Authorize the app
   - Check that you're logged in

4. **Protected routes:**
   - Navigate to `/practice` when logged out
   - Should see SignInForm
   - Sign in and should see practice scenarios
   - Your level should be displayed correctly

5. **User profile:**
   - Click user menu in header
   - Should see:
     - Email address
     - Current level
     - Total points
     - Current streak

## How It Works

### 1. App Initialization

```
App Start
  ↓
ConvexAuthProvider wraps app
  ↓
- Connects to Convex
- Initializes auth context
- Restores session if exists
```

### 2. Sign Up/Sign In Flow

```
User fills form
  ↓
Submit to SignInForm
  ↓
useAuthActions.signIn() called
  ↓
- Convex Auth processes credentials
- Creates/updates user in auth users table
- User is authenticated
  ↓
ProtectedRoute shows content
  ↓
getUserProfile initializes userProfiles entry
```

### 3. Protected Routes

```
User visits /practice
  ↓
ProtectedRoute checks authentication
  ↓
Unauthenticated? Show SignInForm
  ↓
Authenticated? Load user profile → Show content
```

### 4. User Info Display

```
Any component can call useQuery(api.users.getUserProfile)
  ↓
Gets current user + profile data
  ↓
UserMenu/Header displays info
  ↓
Can call signOut() from useAuthActions
```

## Security Notes

1. **API Keys** - Never stored in frontend code, all handled by Convex
2. **Password Hashing** - Handled securely by Convex Auth
3. **Session Management** - Automatic JWT-based sessions
4. **OAuth** - All OAuth flows happen server-side through Convex

## Troubleshooting

### User not authenticated after sign-in
- Check browser dev tools Network tab
- Verify Convex deployment is running
- Check Convex dashboard logs
- Clear browser cookies and try again

### ProtectedRoute shows infinite loading
- Check `getUserProfile` query in Convex dashboard
- Verify `userProfiles` table exists
- Check browser console for errors

### UserMenu shows undefined values
- Profile might not be initialized yet
- Try refreshing page
- Check `userProfiles` table entries

### OAuth redirects not working
- Verify redirect URIs match Convex settings
- Check that auth credentials are in Convex dashboard
- Clear cookies and try fresh sign-in

## Next Steps

1. **Add Logout Confirmation** - Confirm before signing out
2. **Profile Settings Page** - Let users update name/email
3. **Email Verification** - Verify email addresses before full access
4. **2FA** - Add two-factor authentication
5. **Social Login** - Add Google and other providers
6. **Session Timeout** - Auto logout after inactivity

## Related Documentation

- [Convex Auth Docs](https://docs.convex.dev/auth)
- [PROJECT_SPEC.md](../PROJECT_SPEC.md) - User data models
- [CLAUDE.md](../CLAUDE.md) - Development guidelines
