# SEO-Friendly URLs Implementation ✅

## Overview

Your news platform now uses SEO-friendly URLs with the structure `/category/slug` instead of UUID-based URLs. This improves:
- **SEO Rankings** - URLs contain keywords from article titles
- **User Experience** - URLs are readable and shareable
- **Analytics** - Better tracking and understanding of content
- **Backwards Compatibility** - Old UUID URLs redirect with 301 redirects

## URL Structure

### New Format (SEO-Friendly)
```
/world/us-election-2024-results-20241101
/politics/senate-votes-on-healthcare-20241101-120530
/technology/ai-breakthrough-announced-20241101
```

### Old Format (Deprecated - Auto-Redirects)
```
/article/550e8400-e29b-41d4-a716-446655440000
```

## How Slugs Are Generated

### Slug Format
```
{slug-from-title}-{YYYYMMDD}
```

**Examples:**
- Title: "US Election 2024 Results" → `us-election-2024-results-20241101`
- Title: "Senate Votes on Healthcare" → `senate-votes-on-healthcare-20241101`
- Title: "AI Breakthrough Announced!" → `ai-breakthrough-announced-20241101`

### Slug Generation Rules
1. **Lowercase** - All uppercase converted to lowercase
2. **Remove Special Characters** - Only alphanumeric and hyphens allowed
3. **Replace Spaces** - Spaces become hyphens
4. **Remove Duplicates** - Multiple hyphens become single hyphen
5. **Add Date** - Format `YYYYMMDD` appended for uniqueness
6. **Handle Duplicates** - If same-day duplicate, adds time: `YYYYMMDD-HHmmss`

### Slug Uniqueness
- Slugs are unique per category
- Same article title in different categories gets different URLs
- Same article title on different days gets different slugs (date-based)
- Same article title on same day gets time-based suffix

## Files Created

### 1. Slug Utilities (`lib/slug-utils.ts`)
```typescript
// Generate slug from title
generateSlug(title: string): string

// Create unique slug with date
createUniqueSlug(title: string, existingSlugs?: string[]): string

// Normalize category for URL
normalizeCategory(category: string): string

// Parse article URL
parseArticleUrl(path: string): { category: string; slug: string } | null

// Build article URL
buildArticleUrl(category: string, slug: string): string
```

### 2. Database Migration (`supabase/migrations/003_add_article_slugs.sql`)
- Adds `slug` column to articles table
- Creates unique constraint on `(category_id, slug)`
- Creates indexes for fast lookups
- Backfills existing articles with generated slugs

### 3. Dynamic Route (`app/[category]/[slug]/page.tsx`)
- Handles new SEO-friendly URLs
- Fetches articles by slug and category
- Verifies category matches (redirects if wrong)
- Increments view count
- Shows 404 if article not found

### 4. 301 Redirect Route (`app/article/[id]/route.ts`)
- Handles old UUID-based URLs
- Looks up article by ID
- Redirects to new SEO-friendly URL with 301 status
- Preserves SEO value (301 = permanent redirect)

### 5. Slug Generation API (`app/api/articles/generate-slug/route.ts`)
- POST endpoint to generate unique slugs
- Used when creating/editing articles
- Checks for existing slugs in category
- Returns unique slug

## Updated Components

### LatestNews Component
- Now includes `slug` in article data
- Uses `buildArticleUrl()` for links
- Links point to `/category/slug` instead of `/article/id`

## How to Use

### Creating Articles

When creating an article, the slug is auto-generated:

```typescript
// Admin create article page
const slug = await generateSlug(title, categoryId)
// Result: "article-title-20241101"

// Save to database
await supabase
  .from('articles')
  .insert({
    title,
    slug,
    category_id: categoryId,
    // ... other fields
  })
```

### Accessing Articles

**New URL (SEO-Friendly):**
```
http://localhost:3000/world/us-election-2024-results-20241101
```

**Old URL (Auto-Redirects):**
```
http://localhost:3000/article/550e8400-e29b-41d4-a716-446655440000
→ Redirects to: /world/us-election-2024-results-20241101 (301)
```

### Internal Links

All internal links automatically use new format:

```typescript
import { buildArticleUrl } from '@/lib/slug-utils'

// Generate link
const url = buildArticleUrl('world', 'us-election-2024-results-20241101')
// Result: "/world/us-election-2024-results-20241101"

// In components
<Link href={buildArticleUrl(article.category, article.slug)}>
  {article.title}
</Link>
```

## Database Schema

### Articles Table Changes

```sql
-- New column
ALTER TABLE articles ADD COLUMN slug TEXT NOT NULL;

-- Unique constraint per category
ALTER TABLE articles ADD CONSTRAINT articles_category_slug_unique 
  UNIQUE(category_id, slug);

-- Indexes for fast lookups
CREATE INDEX articles_slug_idx ON articles(slug);
CREATE INDEX articles_category_slug_idx ON articles(category_id, slug);
```

## 301 Redirects

### How They Work

1. **Old URL:** `/article/550e8400-e29b-41d4-a716-446655440000`
2. **Route Handler:** Looks up article by ID
3. **Finds:** Category and slug
4. **Redirects:** `/world/us-election-2024-results-20241101` (301)
5. **SEO:** Search engines update their index with new URL

### Benefits

- ✅ **Preserves SEO** - 301 redirects pass SEO value
- ✅ **Backwards Compatible** - Old links still work
- ✅ **Analytics** - Can track redirect traffic
- ✅ **No Broken Links** - Users with old URLs are redirected

## API Endpoints

### Generate Slug
```
POST /api/articles/generate-slug
Content-Type: application/json

{
  "title": "US Election 2024 Results",
  "categoryId": "category-uuid"
}

Response:
{
  "slug": "us-election-2024-results-20241101"
}
```

## Testing

### Test New URLs
```bash
# Visit article with new URL
http://localhost:3000/world/us-election-2024-results-20241101

# Should load article and increment views
```

### Test 301 Redirects
```bash
# Visit article with old UUID URL
http://localhost:3000/article/550e8400-e29b-41d4-a716-446655440000

# Should redirect to:
http://localhost:3000/world/us-election-2024-results-20241101
```

### Test Slug Generation
```bash
# Call API
curl -X POST http://localhost:3000/api/articles/generate-slug \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Article","categoryId":"cat-id"}'

# Response:
{"slug":"test-article-20241101"}
```

## Migration Steps

### 1. Apply Database Migration
```bash
# Using Supabase CLI
supabase db push

# Or manually run SQL in Supabase console
```

### 2. Backfill Existing Articles
The migration automatically backfills slugs for existing articles using the pattern:
```
{slug-from-title}-{YYYYMMDD}
```

### 3. Update Admin Pages
Admin article creation/editing pages should use the slug generation API:
```typescript
const response = await fetch('/api/articles/generate-slug', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, categoryId })
})
const { slug } = await response.json()
```

### 4. Test Everything
- ✅ Create new article
- ✅ Visit with new URL
- ✅ Test old URL redirects
- ✅ Check view counts increment
- ✅ Verify links in LatestNews

## SEO Benefits

### Before (UUID URLs)
```
/article/550e8400-e29b-41d4-a716-446655440000
```
- ❌ No keywords in URL
- ❌ Not user-friendly
- ❌ Hard to remember
- ❌ Poor social sharing

### After (SEO-Friendly URLs)
```
/world/us-election-2024-results-20241101
```
- ✅ Keywords in URL (world, election, 2024, results)
- ✅ User-friendly and readable
- ✅ Easy to remember and share
- ✅ Better social sharing
- ✅ Improved SEO rankings

## Troubleshooting

### Article Not Found
- Check slug is correct
- Verify category name matches
- Ensure article is published

### Redirect Not Working
- Check old article ID exists
- Verify database has slug column
- Check middleware isn't interfering

### Duplicate Slugs
- Slugs are unique per category
- Same title in different categories = different URLs
- Same title same day = time-based suffix added

## Next Steps

1. ✅ Apply database migration
2. ✅ Test new URLs
3. ✅ Test 301 redirects
4. ✅ Update admin pages to use slug API
5. ✅ Monitor redirect traffic
6. ✅ Update XML sitemap with new URLs
7. ✅ Submit new URLs to Google Search Console

---

**Your news platform now has professional, SEO-friendly URLs!** 🚀
