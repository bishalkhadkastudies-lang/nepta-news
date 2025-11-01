# Debugging Article Viewing Issue

## Problem Summary
When clicking on an article, the page shows 404 instead of loading the article. The error is:
```
Fetch error: {}
```

This indicates Supabase is returning an empty error object, meaning the query is failing silently.

## Root Causes to Check

### 1. **No Articles in Database**
- Articles table might be empty
- No published articles exist
- Slugs might not be generated

### 2. **Slug Mismatch**
- Article slug doesn't match URL slug
- Slug generation didn't work during article creation
- Slug column is NULL

### 3. **Status Not Published**
- Article status is 'draft' instead of 'published'
- Query filters for published only

### 4. **Category Mismatch**
- URL category doesn't match article's category
- Category names don't normalize correctly

### 5. **Database Connection Issues**
- Supabase credentials invalid
- Network connectivity problem
- RLS policies blocking access

## Debugging Steps

### Step 1: Check Database Contents
Visit: `http://localhost:3000/api/debug/articles`

This will show:
- Total articles count
- Published articles count
- Sample article data
- Any database errors

### Step 2: Verify Article Creation
1. Go to `/admin/articles/create`
2. Create test article:
   - Title: "Test Article"
   - Category: "World"
   - Excerpt: "Test"
   - Content: "Test content"
   - **Status: Published** ✅
3. Click Create

### Step 3: Check Slug Generation
After creating article, check:
1. Go to `/api/debug/articles`
2. Look for your article in the response
3. Verify it has a `slug` field
4. Verify `status` is `published`

### Step 4: Test Direct Query
If you have database access:
```sql
SELECT id, title, slug, status, category_id 
FROM articles 
WHERE status = 'published' 
LIMIT 5;
```

Should return at least one article with a slug.

### Step 5: Test Article URL
If article exists with slug `test-article-20241102`:
```
http://localhost:3000/world/test-article-20241102
```

Should load the article.

## Common Issues & Fixes

### Issue: No Articles Returned
**Cause:** Database is empty or all articles are drafts

**Fix:**
1. Create new article via admin
2. Make sure Status = "Published"
3. Wait for slug to be generated
4. Try again

### Issue: Article Exists but 404
**Cause:** Slug mismatch or category mismatch

**Check:**
```sql
-- Find your article
SELECT id, title, slug, status, categories.name 
FROM articles 
JOIN categories ON articles.category_id = categories.id 
WHERE title LIKE '%Test%';
```

**Verify:**
- Slug is not NULL
- Status is 'published'
- Category name matches URL

### Issue: Supabase Connection Error
**Cause:** Invalid credentials or network issue

**Check:**
1. `.env.local` has correct Supabase keys
2. Supabase project is active
3. Network connectivity is working

**Fix:**
```bash
# Restart dev server
npm run dev
```

## Files to Check

### Article Page
- `app/[category]/[slug]/page.tsx` - Main article page
- Logs: Check browser console and terminal

### Debug Endpoint
- `app/api/debug/articles/route.ts` - Database status

### Article Creation
- `app/admin/articles/create/page.tsx` - Creates articles
- Checks slug generation

### Slug Utilities
- `lib/slug-utils.ts` - Slug generation logic

## Next Steps

1. **Check Debug Endpoint:**
   ```
   http://localhost:3000/api/debug/articles
   ```
   Look at the response to see what's in the database

2. **Create Test Article:**
   - Go to `/admin/articles/create`
   - Fill in all fields
   - **Status: Published** ✅
   - Click Create

3. **Check Debug Endpoint Again:**
   - Should now show your new article
   - Verify it has a slug
   - Verify status is 'published'

4. **Test Article URL:**
   - Use the slug from debug endpoint
   - Visit: `/world/your-slug-here`
   - Should load article

5. **If Still Not Working:**
   - Check browser console for errors
   - Check terminal for error logs
   - Verify Supabase credentials in `.env.local`

## Expected Behavior

### ✅ Working
1. Create article with Status: Published
2. Article appears in `/api/debug/articles`
3. Article has a slug
4. Visiting `/category/slug` loads article
5. View count increments on refresh

### ❌ Not Working
1. Article doesn't appear in debug endpoint
2. Article has no slug
3. Article status is 'draft'
4. 404 error when visiting URL
5. Supabase connection error

## Quick Test Checklist

- [ ] Dev server running: `npm run dev`
- [ ] Check debug endpoint: `/api/debug/articles`
- [ ] Create test article with Status: Published
- [ ] Check debug endpoint again
- [ ] Verify article has slug
- [ ] Visit article URL: `/world/article-slug`
- [ ] Article should load without 404

---

**Use the debug endpoint to identify the exact issue!**
