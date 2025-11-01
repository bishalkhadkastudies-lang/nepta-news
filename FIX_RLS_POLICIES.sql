-- Fix Row Level Security (RLS) Policies for Articles Table
-- Run these commands in Supabase SQL Editor

-- Step 1: Disable RLS on articles table (allows all operations)
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;

-- Step 2: If you want to keep RLS but allow inserts, run these:
-- First, enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow INSERT for all users
CREATE POLICY "Allow insert articles" ON articles
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow SELECT for all users
CREATE POLICY "Allow select articles" ON articles
  FOR SELECT
  USING (true);

-- Create policy to allow UPDATE for all users
CREATE POLICY "Allow update articles" ON articles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow DELETE for all users
CREATE POLICY "Allow delete articles" ON articles
  FOR DELETE
  USING (true);

-- Step 3: Do the same for related tables
ALTER TABLE article_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE article_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE authors DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('articles', 'article_views', 'article_likes', 'categories', 'authors');
