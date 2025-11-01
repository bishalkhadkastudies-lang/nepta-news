# Supabase Setup Verification

## Current Status

### ✅ What's Configured
- **Supabase URL:** `https://fcpkknncvrudppocgage.supabase.co`
- **Anon Key:** ✅ Valid (configured)
- **Project ID:** `fcpkknncvrudppocgage`

### ⚠️ Issues Found
- **Service Role Key:** ❌ Placeholder value (`"your_supabase_service_role_key"`)
- This is needed for server-side operations

## Step-by-Step Setup

### Step 1: Get Your Supabase Keys

1. Go to: https://supabase.com/dashboard
2. Select your project: **nytimes-clone**
3. Go to **Settings** → **API**
4. Copy these keys:
   - **Project URL** (already have: `https://fcpkknncvrudppocgage.supabase.co`)
   - **anon public key** (already have)
   - **service_role secret** (NEED THIS)

### Step 2: Update .env.local

Replace the placeholder with your actual service role key:

```env
# Before ❌
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# After ✅
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Verify Database Schema

Your database should have these tables:

**1. articles**
```sql
- id (uuid, primary key)
- title (text)
- slug (text, NOT NULL)
- excerpt (text)
- content (text)
- image_url (text)
- category_id (uuid, foreign key)
- author_id (uuid, foreign key)
- status (text: 'draft' or 'published')
- tags (array)
- views (integer, default 0)
- read_time (integer)
- published_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

**2. categories**
```sql
- id (uuid, primary key)
- name (text, unique)
- slug (text)
- created_at (timestamp)
```

**3. authors**
```sql
- id (uuid, primary key)
- name (text)
- profile_picture_url (text)
- created_at (timestamp)
```

**4. saved_articles** (for bookmarks)
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- article_id (uuid, foreign key)
- saved_at (timestamp)
```

**5. article_likes**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- article_id (uuid, foreign key)
- created_at (timestamp)
```

**6. comments**
```sql
- id (uuid, primary key)
- article_id (uuid, foreign key)
- user_id (uuid, foreign key)
- content (text)
- created_at (timestamp)
```

### Step 4: Check RLS Policies

Row Level Security (RLS) should be enabled on:
- `saved_articles` - Users can only see their own
- `article_likes` - Users can only see their own
- `comments` - Users can only delete their own

### Step 5: Test Connection

Visit: `http://localhost:3000/api/debug/articles`

Should show:
```json
{
  "articles": {
    "data": [...],
    "error": null,
    "count": X
  },
  "categories": {
    "data": [...],
    "error": null,
    "count": X
  },
  "publishedArticles": {
    "data": [...],
    "error": null,
    "count": X
  }
}
```

If you see errors, Supabase is not properly configured.

## Common Issues

### Issue 1: "Invalid API Key"
**Cause:** Wrong or expired keys in `.env.local`

**Fix:**
1. Go to Supabase dashboard
2. Copy fresh keys
3. Update `.env.local`
4. Restart dev server: `npm run dev`

### Issue 2: "No tables found"
**Cause:** Database schema not created

**Fix:**
1. Go to Supabase dashboard
2. Go to **SQL Editor**
3. Run migrations to create tables
4. Or manually create tables using SQL

### Issue 3: "Permission denied"
**Cause:** RLS policies blocking access

**Fix:**
1. Check RLS policies in Supabase dashboard
2. Ensure policies allow public read access for articles
3. Ensure policies allow authenticated users for bookmarks/likes

### Issue 4: "Connection timeout"
**Cause:** Network issue or Supabase down

**Fix:**
1. Check Supabase status: https://status.supabase.com
2. Check internet connection
3. Restart dev server

## Verification Checklist

- [ ] Supabase URL is correct
- [ ] Anon key is valid
- [ ] Service role key is valid (not placeholder)
- [ ] Database tables exist
- [ ] Articles table has data
- [ ] Categories table has data
- [ ] RLS policies are configured
- [ ] `/api/debug/articles` returns data
- [ ] Articles have slugs
- [ ] Articles have status 'published'

## Quick Test

### 1. Check Debug Endpoint
```
http://localhost:3000/api/debug/articles
```

### 2. Create Test Article
- Go to `/admin/articles/create`
- Fill in details
- **Status: Published**
- Click Create

### 3. Check Debug Endpoint Again
- Should show your new article
- Should have a slug
- Should have status 'published'

### 4. Visit Article URL
```
http://localhost:3000/politics/article-slug-20241102
```

Should load the article.

## Environment Variables Reference

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://fcpkknncvrudppocgage.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Recommended (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional
SUPABASE_EDGE_FUNCTION_URL=https://fcpkknncvrudppocgage.supabase.co/functions/v1

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=bishalkhadkastudies@gmail.com
ADMIN_SECRET_CODE=adminloveyou
```

## Next Steps

1. **Update Service Role Key** in `.env.local`
2. **Verify Database Schema** exists
3. **Check RLS Policies** are configured
4. **Test Debug Endpoint** at `/api/debug/articles`
5. **Create Test Article** via admin
6. **Test Article URL** to verify loading

---

**Once all checks pass, article viewing will work perfectly!** ✅
