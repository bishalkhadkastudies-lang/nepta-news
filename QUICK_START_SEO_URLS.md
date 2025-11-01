# Quick Start - SEO-Friendly URLs

## 🚀 Quick Setup (5 minutes)

### Step 1: Apply Database Migration
```bash
# Using Supabase CLI
supabase db push

# Or in Supabase console, run:
# supabase/migrations/003_add_article_slugs.sql
```

### Step 2: Test New URLs
```bash
# Start dev server
npm run dev

# Visit article with new URL
http://localhost:3000/world/us-election-2024-results-20241101

# Test old URL redirect
http://localhost:3000/article/550e8400-e29b-41d4-a716-446655440000
# Should redirect to new URL with 301
```

### Step 3: Update Admin Pages (Optional)
Update article creation/editing to use slug API:

```typescript
// Generate slug
const response = await fetch('/api/articles/generate-slug', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    title: articleTitle,
    categoryId: selectedCategoryId 
  })
})
const { slug } = await response.json()

// Use slug when saving article
await supabase
  .from('articles')
  .insert({ title, slug, category_id: categoryId, ... })
```

## 📋 URL Examples

| Title | Category | URL |
|-------|----------|-----|
| US Election 2024 Results | World | `/world/us-election-2024-results-20241101` |
| Senate Votes on Healthcare | Politics | `/politics/senate-votes-healthcare-20241101` |
| AI Breakthrough Announced | Technology | `/technology/ai-breakthrough-announced-20241101` |

## 🔄 Redirects

**Old URL:**
```
/article/550e8400-e29b-41d4-a716-446655440000
```

**Automatically Redirects To:**
```
/world/us-election-2024-results-20241101 (301)
```

## 📚 Utilities

### Generate Slug
```typescript
import { generateSlug } from '@/lib/slug-utils'

const slug = generateSlug("US Election 2024 Results")
// Result: "us-election-2024-results"
```

### Create Unique Slug
```typescript
import { createUniqueSlug } from '@/lib/slug-utils'

const slug = createUniqueSlug("Article Title", existingSlugs)
// Result: "article-title-20241101"
```

### Build Article URL
```typescript
import { buildArticleUrl } from '@/lib/slug-utils'

const url = buildArticleUrl("world", "us-election-2024-results-20241101")
// Result: "/world/us-election-2024-results-20241101"
```

## 🧪 Testing

### Test Slug Generation API
```bash
curl -X POST http://localhost:3000/api/articles/generate-slug \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking News Article",
    "categoryId": "category-uuid"
  }'

# Response:
# {"slug":"breaking-news-article-20241101"}
```

### Test Article Page
```bash
# Visit article
curl http://localhost:3000/world/breaking-news-article-20241101

# Should return 200 with article content
```

### Test 301 Redirect
```bash
curl -I http://localhost:3000/article/article-uuid

# Should return 301 with Location header pointing to new URL
```

## 📁 Files Reference

| File | Purpose |
|------|---------|
| `lib/slug-utils.ts` | Slug generation utilities |
| `app/[category]/[slug]/page.tsx` | Article page |
| `app/article/[id]/route.ts` | 301 redirect |
| `app/api/articles/generate-slug/route.ts` | Slug API |
| `supabase/migrations/003_add_article_slugs.sql` | Database migration |

## ✅ Checklist

- [ ] Run database migration
- [ ] Test new URL format works
- [ ] Test old URL redirects
- [ ] Verify view count increments
- [ ] Update admin pages (optional)
- [ ] Test slug generation API
- [ ] Verify LatestNews shows correct links

## 🎯 SEO Benefits

✅ Keywords in URLs  
✅ User-friendly URLs  
✅ Better social sharing  
✅ Improved search rankings  
✅ Backwards compatible (301 redirects)

## 📖 Full Documentation

See `SEO_FRIENDLY_URLS.md` for complete documentation.

---

**That's it! Your URLs are now SEO-friendly!** 🚀
