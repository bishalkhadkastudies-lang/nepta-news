# Editor's Pick Feature - Admin Control

## Overview
Admins can now mark articles as "Editor's Pick" to feature them in the Editor's Picks section on the homepage.

## How It Works

### 1. **Admin Dashboard - Mark Articles**

**Location:** `/admin/articles`

**Steps:**
1. Go to Admin Dashboard
2. Click "Articles" in sidebar
3. Find the article you want to feature
4. Click the "Not Pick" button to toggle it to "⭐ Pick"
5. Button turns purple when selected
6. Article appears in Editor's Picks section

**Visual:**
```
Title | Category | Author | Status | Published | Editor's Pick | Actions
─────────────────────────────────────────────────────────────────────────
Article 1 | World | Editor | Published | Nov 2 | ⭐ Pick | [View][Edit][Delete]
Article 2 | Tech | Editor | Published | Nov 1 | Not Pick | [View][Edit][Delete]
Article 3 | Business | Editor | Published | Oct 31 | ⭐ Pick | [View][Edit][Delete]
```

### 2. **Toggle Button States**

**Not Selected (Gray):**
```
[Not Pick]  ← Click to select
```

**Selected (Purple):**
```
[⭐ Pick]  ← Click to deselect
```

### 3. **Homepage Display**

**Editor's Picks Section:**
- Shows up to 4 articles marked as Editor's Pick
- 1 main featured article
- 3 side picks (numbered 2, 3, 4)
- Purple/blue gradient background
- Star badge on main article

**Display:**
```
⭐ Editor's Picks
Handpicked stories you shouldn't miss

[Main Article - Large Image]
Category | Title | Excerpt

[2] Side Article 1
[3] Side Article 2
[4] Side Article 3

✨ Curated by editorial team • Updated daily
```

## Database Changes

### New Column: `is_editors_pick`

**Type:** Boolean (true/false)  
**Default:** false  
**Purpose:** Mark articles as Editor's Pick

**SQL:**
```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_editors_pick BOOLEAN DEFAULT false;
```

## Features

### ✅ Admin Controls
- One-click toggle to mark/unmark articles
- Visual feedback (color change)
- Real-time updates
- No page refresh needed

### ✅ Homepage Display
- Automatically shows marked articles
- Up to 4 articles (1 main + 3 side)
- Beautiful presentation
- Professional design

### ✅ User Experience
- Users see curated content
- Clear "Editor's Pick" branding
- Star icon for premium feel
- Easy to identify featured articles

## Files Modified

### `app/admin/articles/page.tsx`
- Added `is_editors_pick` to Article interface
- Added `is_editors_pick` to query
- Added `toggleEditorsPick()` function
- Added "Editor's Pick" column to table
- Added toggle button with visual feedback

### `components/EditorsPicksSection.tsx`
- Updated query to filter `is_editors_pick = true`
- Shows only marked articles
- Displays up to 4 articles

## Usage Instructions

### For Admins

**To Mark an Article as Editor's Pick:**

1. **Go to Admin Dashboard**
   ```
   http://localhost:3000/admin
   ```

2. **Click Articles**
   ```
   Sidebar → Articles
   ```

3. **Find the Article**
   ```
   Scroll through the list
   ```

4. **Click Toggle Button**
   ```
   Click "Not Pick" button
   Button changes to "⭐ Pick" (purple)
   ```

5. **Done!**
   ```
   Article appears in Editor's Picks on homepage
   ```

**To Unmark an Article:**

1. Click the "⭐ Pick" button again
2. Button changes back to "Not Pick"
3. Article is removed from Editor's Picks

### For Users

**Viewing Editor's Picks:**

1. **Visit Homepage**
   ```
   http://localhost:3000
   ```

2. **Scroll Down**
   ```
   Find "⭐ Editor's Picks" section
   ```

3. **See Featured Articles**
   ```
   Main article + 3 side picks
   ```

4. **Click to Read**
   ```
   Click any article to read full story
   ```

## Example Workflow

### Scenario 1: Feature a Breaking News Article

```
1. Admin logs in
2. Goes to /admin/articles
3. Finds "Breaking News: Major Event"
4. Clicks "Not Pick" button
5. Button turns purple "⭐ Pick"
6. Article appears on homepage Editor's Picks
7. Users see it as featured content
```

### Scenario 2: Remove from Featured

```
1. Admin goes to /admin/articles
2. Finds "Old Featured Article"
3. Sees "⭐ Pick" button (purple)
4. Clicks it to deselect
5. Button turns gray "Not Pick"
6. Article removed from homepage
```

## Best Practices

### ✅ Do's
- Mark 3-4 best articles daily
- Update picks regularly
- Feature diverse topics
- Highlight breaking news
- Showcase quality journalism

### ❌ Don'ts
- Mark too many articles (dilutes impact)
- Keep old picks too long
- Mark only one category
- Mark low-quality content
- Forget to update regularly

## Technical Details

### Query Logic

**Fetch Editor's Picks:**
```typescript
.eq('status', 'published')      // Only published articles
.eq('is_editors_pick', true)    // Only marked articles
.order('published_at', { ascending: false })  // Newest first
.limit(4)                        // Max 4 articles
```

### Toggle Function

```typescript
const toggleEditorsPick = async (id: string, currentValue: boolean) => {
  // Update database
  await supabase
    .from('articles')
    .update({ is_editors_pick: !currentValue })
    .eq('id', id)
  
  // Update UI
  setArticles(articles.map(a => 
    a.id === id ? { ...a, is_editors_pick: !currentValue } : a
  ))
}
```

## Testing

### Test the Feature

1. **Create Test Articles**
   - Create 5+ articles in admin

2. **Mark as Editor's Pick**
   - Go to /admin/articles
   - Click "Not Pick" on 3-4 articles
   - Verify buttons turn purple

3. **Check Homepage**
   - Visit homepage
   - Scroll to "Editor's Picks"
   - Verify marked articles appear

4. **Test Toggle**
   - Click "⭐ Pick" to deselect
   - Verify button turns gray
   - Verify article removed from homepage

5. **Verify Display**
   - Main article shows large
   - Side articles numbered 2, 3, 4
   - All have correct info
   - Links work correctly

## Summary

**Feature:** Editor's Pick Selection  
**Location:** Admin Dashboard → Articles  
**Action:** One-click toggle button  
**Result:** Featured articles on homepage  
**Users:** Admins control, users see curated content  

**Benefits:**
- ✅ Easy admin control
- ✅ Professional curation
- ✅ Better user experience
- ✅ Highlight quality content
- ✅ Real-time updates

---

**Admins can now curate and feature the best articles!** ⭐
