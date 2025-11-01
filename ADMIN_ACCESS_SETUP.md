# Admin Access Setup

## Admin Credentials

**Email:** `bishalkhadkastudies@gmail.com`  
**Password:** `admin123`  
**Secret Code:** `adminloveyou`

## How to Access Admin Dashboard

### Step 1: Create Admin Account
1. Go to `/auth/signup`
2. Sign up with:
   - Full Name: (Your name)
   - Email: `bishalkhadkastudies@gmail.com`
   - Password: `admin123`
   - Confirm Password: `admin123`

### Step 2: Sign In
1. Go to `/auth/signin`
2. Enter:
   - Email: `bishalkhadkastudies@gmail.com`
   - Password: `admin123`

### Step 3: Verify Admin Access
1. After signing in, you'll be redirected to `/admin-verify`
2. Enter the secret code: `adminloveyou`
3. Click "Verify Access"

### Step 4: Access Admin Dashboard
- Once verified, you'll be redirected to `/admin`
- You now have full admin access!

## Admin Routes

All these routes require admin authentication:

- `/admin` - Dashboard with stats and recent articles
- `/admin/articles` - Full article list
- `/admin/articles/create` - Create new article
- `/admin/articles/edit/[id]` - Edit existing article
- `/admin-verify` - Admin verification page

## How Admin Authentication Works

### 1. Email Check
- Middleware checks if user email matches `NEXT_PUBLIC_ADMIN_EMAIL`
- Set in `.env.local`: `bishalkhadkastudies@gmail.com`

### 2. Secret Code Verification
- Admin must enter secret code: `adminloveyou`
- Set in `.env.local`: `ADMIN_SECRET_CODE`
- Code is verified via `/api/admin/verify`
- Sets a cookie: `admin_verified=true` (valid for 24 hours)

### 3. Route Protection
- Middleware checks both email AND verification cookie
- If email doesn't match → Redirect to homepage
- If not verified → Redirect to `/admin-verify`
- If verified → Allow access to admin routes

## Environment Variables

In `.env.local`:
```env
NEXT_PUBLIC_ADMIN_EMAIL=bishalkhadkastudies@gmail.com
ADMIN_SECRET_CODE=adminloveyou
```

## Security Notes

1. **Email-based:** Only the specified email can access admin
2. **Secret Code:** Additional layer of security
3. **Cookie Expiry:** Admin verification expires after 24 hours
4. **Re-verification:** Must enter secret code again after expiry

## Troubleshooting

### Can't Access Admin Dashboard?
1. Make sure you're signed in with `bishalkhadkastudies@gmail.com`
2. Check if you've entered the secret code at `/admin-verify`
3. Try clearing cookies and signing in again
4. Verify `.env.local` has correct admin email

### Verification Expired?
- Visit `/admin-verify` again
- Enter secret code: `adminloveyou`
- Valid for another 24 hours

### Wrong Email?
- Sign out
- Sign in with `bishalkhadkastudies@gmail.com`
- Complete verification process

## Quick Access Flow

```
1. Sign Up → bishalkhadkastudies@gmail.com + admin123
2. Sign In → bishalkhadkastudies@gmail.com + admin123
3. Verify → Enter "adminloveyou"
4. Access → /admin dashboard
```

---

**Your admin account is now configured!** 🎉
