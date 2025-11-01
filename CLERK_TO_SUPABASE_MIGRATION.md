# Clerk to Supabase Auth Migration - Complete ✅

## What Was Changed

### 1. **Dependencies**
- ❌ Removed: `@clerk/nextjs`
- ✅ Added: `@supabase/ssr`

### 2. **New Supabase Auth Files Created**
- `lib/supabase-client.ts` - Browser client for client components
- `lib/supabase-server.ts` - Server client for server components/API routes
- `lib/supabase-middleware.ts` - Middleware helper for session management
- `components/auth/AuthProvider.tsx` - Auth context provider
- `components/auth/SignInButton.tsx` - Sign in button component
- `components/auth/UserButton.tsx` - User profile dropdown
- `app/auth/signin/page.tsx` - Sign in page
- `app/auth/callback/route.ts` - OAuth callback handler

### 3. **Files Modified**

#### Core Files
- `app/layout.tsx` - Replaced ClerkProvider with AuthProvider
- `middleware.ts` - Complete rewrite using Supabase Auth
- `.env.local` - Removed Clerk keys

#### Components
- `components/Header.tsx` - Uses Supabase auth hooks
- `components/ArticleContent.tsx` - Uses Supabase auth
- `app/saved/page.tsx` - Uses Supabase auth
- `app/admin-verify/page.tsx` - Uses Supabase auth

#### API Routes (All Updated)
- `app/api/bookmarks/save/route.ts`
- `app/api/bookmarks/check/route.ts`
- `app/api/bookmarks/unsave/route.ts`
- `app/api/likes/toggle/route.ts`
- `app/api/likes/check/route.ts`

#### Auth Pages
- `app/auth/signup/page.tsx` - Updated to use new client

### 4. **Files Deleted**
- `lib/clerk-auth.tsx`

## Authentication Flow

### Sign Up
1. User visits `/auth/signup`
2. Enters email, password, and name
3. Supabase creates account
4. Redirects to `/auth/signin`

### Sign In
1. User visits `/auth/signin`
2. Can sign in with:
   - Email/Password
   - Google OAuth
3. On success, redirects to homepage

### OAuth Flow
1. User clicks "Sign in with Google"
2. Redirects to Google
3. Returns to `/auth/callback`
4. Exchanges code for session
5. Redirects to homepage

### Protected Routes
- `/admin/*` - Requires admin email + secret code
- `/admin-verify` - Requires admin email
- `/saved` - Requires authentication

## User Data Access

### Client Components
```tsx
import { useAuth } from '@/components/auth/AuthProvider'

const { user, loading, signOut } = useAuth()
// user.id, user.email, user.user_metadata
```

### Server Components/API Routes
```tsx
import { createClient } from '@/lib/supabase-server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```

## Database Changes Needed

You need to update your database tables to use Supabase Auth user IDs:

### Current Structure
- `saved_articles.user_id` - Currently stores Clerk user IDs
- `article_likes.user_id` - Currently stores Clerk user IDs

### Migration Required
Since Clerk and Supabase use different user ID formats, existing saved articles and likes will need to be migrated or users will need to re-save/re-like articles.

**Option 1: Clean Slate (Recommended for Development)**
```sql
-- Clear existing data
TRUNCATE TABLE saved_articles;
TRUNCATE TABLE article_likes;
```

**Option 2: User Mapping (Production)**
Create a mapping table to link Clerk IDs to Supabase IDs based on email.

## Environment Variables

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
ADMIN_SECRET_CODE=your_secret_code
```

### Removed
```env
# No longer needed
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

## Setup Supabase Auth

1. **Enable Email Auth** in Supabase Dashboard:
   - Go to Authentication → Providers
   - Enable Email provider
   - Configure email templates (optional)

2. **Enable Google OAuth** (Optional):
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add redirect URL: `http://localhost:3000/auth/callback`

3. **Configure Site URL**:
   - Go to Authentication → URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

## Testing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Test authentication**:
   - Sign up at `/auth/signup`
   - Sign in at `/auth/signin`
   - Test Google OAuth
   - Test protected routes
   - Test bookmarking/liking (will start fresh)

## Next Steps

1. ✅ All Clerk code removed
2. ✅ Supabase Auth integrated
3. ⚠️ Clear or migrate user data (saved articles, likes)
4. ⚠️ Test all authentication flows
5. ⚠️ Update production environment variables
6. ⚠️ Configure Supabase Auth providers

## Notes

- All authentication now goes through Supabase
- User sessions are managed via cookies
- Middleware automatically refreshes sessions
- Admin authentication still uses email check + secret code
- OAuth requires additional Supabase configuration

## Support

If you encounter issues:
1. Check Supabase Auth logs in dashboard
2. Verify environment variables
3. Clear browser cookies and try again
4. Check middleware is running correctly
