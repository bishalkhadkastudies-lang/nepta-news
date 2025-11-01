# Fix Editor's Pick Feature - Complete Solution

## Problem
- Clicking "Not Pick" doesn't work
- After refresh, it reverts to picked state
- The toggle button isn't saving changes

## Root Cause
The `is_editors_pick` column doesn't exist in your database table.

---

## ✅ Solution - Add Column to Database

### **Step 1: Open Supabase Dashboard**
1. Go to: https://app.supabase.com
2. Select your project: `fcpkknncvrudppocgage`

### **Step 2: Go to SQL Editor**
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**

### **Step 3: Copy and Paste This SQL**

```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_editors_pick BOOLEAN DEFAULT false;
```

### **Step 4: Run the Query**
1. Click **Run** button (or Ctrl+Enter)
2. Wait for success message
3. Should show: ✅ **Success. No rows returned**

### **Step 5: Verify Column Was Added**
1. Go to **Table Editor** (left sidebar)
2. Click on **articles** table
3. Scroll right to see columns
4. Look for **is_editors_pick** column
5. Should show type: `bool`

---

## 🔍 Verify It's Working

### **Check 1: In Table Editor**
```
Table Editor
└── articles
    ├── id
    ├── title
    ├── excerpt
    ├── image_url
    ├── ...
    ├── views
    └── is_editors_pick ← Should be here
```

### **Check 2: Run This SQL Query**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND column_name = 'is_editors_pick';
```

Should return:
```
column_name      | data_type
─────────────────┼──────────
is_editors_pick  | boolean
```

---

## 🚀 After Adding Column

### **Step 1: Restart Dev Server**
```bash
npm run dev
```

### **Step 2: Go to Admin**
```
http://localhost:3000/admin/articles
```

### **Step 3: Test Toggle**
1. Find an article
2. Click "Not Pick" button
3. Button should turn purple "⭐ Pick"
4. Refresh the page
5. Button should stay purple (not revert)

### **Step 4: Test Unselect**
1. Click "⭐ Pick" button again
2. Button should turn gray "Not Pick"
3. Refresh the page
4. Button should stay gray (not revert)

### **Step 5: Check Homepage**
1. Visit http://localhost:3000
2. Scroll to "Editor's Picks" section
3. Should show articles you marked as picks

---

## 📋 Complete SQL Commands

### **Add Column**
```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_editors_pick BOOLEAN DEFAULT false;
```

### **Verify Column Exists**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND column_name = 'is_editors_pick';
```

### **Check Current Values**
```sql
SELECT id, title, is_editors_pick 
FROM articles 
LIMIT 10;
```

### **Set All to False (Reset)**
```sql
UPDATE articles SET is_editors_pick = false;
```

### **Set Specific Article as Pick**
```sql
UPDATE articles 
SET is_editors_pick = true 
WHERE id = 'your-article-id';
```

---

## 🎯 Step-by-Step Walkthrough

### **For Adding Column:**

1. **Supabase Dashboard**
   ```
   https://app.supabase.com
   ↓
   Select project "fcpkknncvrudppocgage"
   ↓
   Click "SQL Editor"
   ↓
   Click "New Query"
   ```

2. **Paste SQL**
   ```
   ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_editors_pick BOOLEAN DEFAULT false;
   ```

3. **Run Query**
   ```
   Click "Run" button
   ↓
   Wait for success
   ↓
   See "✅ Success. No rows returned"
   ```

4. **Verify**
   ```
   Click "Table Editor"
   ↓
   Click "articles"
   ↓
   Scroll right
   ↓
   See "is_editors_pick" column
   ```

5. **Restart Dev Server**
   ```bash
   npm run dev
   ```

6. **Test Admin**
   ```
   http://localhost:3000/admin/articles
   ↓
   Click toggle button
   ↓
   Refresh page
   ↓
   Should stay toggled
   ```

---

## ✨ What Should Happen

### **Before (Broken)**
```
1. Click "Not Pick" button
2. Button turns purple "⭐ Pick"
3. Refresh page
4. Button reverts to "Not Pick" ❌
```

### **After (Fixed)**
```
1. Click "Not Pick" button
2. Button turns purple "⭐ Pick"
3. Refresh page
4. Button stays purple "⭐ Pick" ✅
```

---

## 🐛 Troubleshooting

### **Error: "Column already exists"**
- ✅ This is fine! Column is already there
- Just restart dev server
- Try toggling button again

### **Error: "Permission denied"**
- Make sure you're logged in
- Check project ID is correct
- Try logging out and back in

### **Error: "Table not found"**
- Make sure table name is "articles" (lowercase)
- Check you selected correct project

### **Toggle Still Not Working**
1. Check browser console for errors (F12)
2. Check server logs
3. Verify column exists in Table Editor
4. Try restarting dev server

---

## 📝 Database Schema

### **After Fix, articles table should have:**

```
Column Name          | Type      | Default
─────────────────────┼───────────┼──────────
id                   | uuid      | 
title                | text      | 
excerpt              | text      | 
content              | text      | 
image_url            | text      | 
slug                 | text      | 
status               | text      | 'draft'
published_at         | timestamp | 
views                | integer   | 0
is_editors_pick      | boolean   | false ← NEW!
category_id          | uuid      | 
author_id            | uuid      | 
created_at           | timestamp | 
updated_at           | timestamp | 
```

---

## ✅ Checklist

- [ ] Opened Supabase Dashboard
- [ ] Went to SQL Editor
- [ ] Created New Query
- [ ] Pasted SQL command
- [ ] Ran the query
- [ ] Got success message
- [ ] Verified column in Table Editor
- [ ] Restarted dev server
- [ ] Tested toggle button
- [ ] Refreshed page - button stayed toggled
- [ ] Checked homepage - Editor's Picks shows
- [ ] Everything working! ✅

---

## 🎉 Summary

**Problem:** Toggle button not saving  
**Cause:** Column doesn't exist  
**Solution:** Add column with SQL  
**Time:** 2 minutes  
**Result:** Feature works perfectly ✅

---

**Once you run the SQL, everything should work!** 🚀
