# Test Article Viewing - Step by Step

## ✅ All Issues Fixed

1. ✅ **Infinite refresh loop** - Removed redirect logic
2. ✅ **404 errors** - Now fetches published articles only
3. ✅ **Category matching** - Case-insensitive comparison
4. ✅ **Dependency issues** - Clean dependency array

## Quick Test (5 minutes)

### Step 1: Create Article
```
1. Go to: http://localhost:3000/admin/articles/create
2. Fill in:
   - Title: "Test Article"
   - Category: "World" (or any)
   - Excerpt: "This is a test"
   - Content: "Test content here"
   - Status: "Published" ✅ (IMPORTANT!)
3. Click "Create Article"
```

### Step 2: View Article
```
1. Go to: http://localhost:3000 (homepage)
2. Find your article in "Latest News"
3. Click on it
4. Should load WITHOUT refresh ✅
```

### Step 3: Verify URL
```
URL should be like:
http://localhost:3000/world/test-article-20241102

NOT like:
http://localhost:3000/article/uuid
```

### Step 4: Check View Count
```
1. Refresh the article page
2. View count should increase
3. Go to /admin/articles
4. Check view count in list
```

## Expected Results

### ✅ Success
- Article loads immediately
- No page refresh
- URL is `/category/slug` format
- View count increments
- Article displays correctly

### ❌ Failure
- Page keeps refreshing
- 404 error shown
- Wrong URL format
- View count doesn't change

## Common Issues & Fixes

### Issue: Still Getting 404
**Check:**
- [ ] Article status is "Published" (not Draft)
- [ ] Article has a slug (auto-generated)
- [ ] Category name is correct
- [ ] Check browser console for errors

**Fix:**
```
1. Delete the article
2. Create new one
3. Make sure Status = "Published"
4. Try again
```

### Issue: Page Still Refreshing
**Check:**
- [ ] Clear browser cache
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check dev server logs

**Fix:**
```
1. Stop dev server: Ctrl+C
2. Clear .next folder: rm -r .next
3. Restart: npm run dev
4. Try again
```

### Issue: View Count Not Updating
**Check:**
- [ ] Article ID is correct
- [ ] Database connection working
- [ ] Supabase is accessible

**Fix:**
```
1. Check Supabase dashboard
2. Verify articles table has views column
3. Check browser console for errors
```

## Database Verification

### Check Article Was Created
```sql
SELECT id, title, slug, status, category_id 
FROM articles 
ORDER BY created_at DESC 
LIMIT 1;
```

### Check Slug Was Generated
```sql
SELECT title, slug 
FROM articles 
WHERE title = 'Test Article';
```

### Check Status is Published
```sql
SELECT title, status 
FROM articles 
WHERE title = 'Test Article';
```

## URL Patterns

### Valid URLs
```
/world/test-article-20241102
/politics/breaking-news-20241102
/technology/new-feature-20241102
```

### Invalid URLs (404)
```
/world/nonexistent-article-20241102  ← Article doesn't exist
/wrong-category/test-article-20241102  ← Category mismatch
/world/draft-article-20241102  ← Article is draft
```

## Files Changed

### Fixed Files
- `app/[category]/[slug]/page.tsx` - Article page (main fix)

### Supporting Files
- `components/LatestNews.tsx` - Uses new URLs
- `lib/slug-utils.ts` - Slug utilities
- `app/api/articles/generate-slug/route.ts` - Slug generation

## Next Steps

1. **Test:** Create article and view it
2. **Verify:** Check URL format is correct
3. **Monitor:** Watch for any errors
4. **Deploy:** Once working, deploy to production

---

**Ready to test!** Follow the Quick Test steps above. 🚀
