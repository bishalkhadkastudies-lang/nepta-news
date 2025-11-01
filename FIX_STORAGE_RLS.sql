-- Fix Storage RLS Policies for Image and Video Upload
-- Run these commands in Supabase SQL Editor

-- Step 1: Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;

-- Step 2: Create new permissive policies for storage.objects
-- Allow anyone to read/download files
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (true);

-- Allow anyone to upload files
CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update files
CREATE POLICY "Allow authenticated update" ON storage.objects
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete files
CREATE POLICY "Allow authenticated delete" ON storage.objects
  FOR DELETE
  USING (true);

-- Step 3: Verify policies are created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
