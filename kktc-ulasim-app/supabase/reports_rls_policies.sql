-- =====================================================
-- RLS POLICIES FOR REPORTS TABLE
-- =====================================================
-- This script creates Row Level Security policies for the reports table
-- Run this in Supabase SQL Editor if you can't see reports in admin page
-- =====================================================

-- Enable RLS on reports table (if not already enabled)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read access to reports" ON reports;
DROP POLICY IF EXISTS "Allow authenticated users to read reports" ON reports;
DROP POLICY IF EXISTS "Allow admin full access to reports" ON reports;
DROP POLICY IF EXISTS "Allow users to create reports" ON reports;
DROP POLICY IF EXISTS "Allow admin to update reports" ON reports;
DROP POLICY IF EXISTS "Allow read access to reports" ON reports;
DROP POLICY IF EXISTS "Allow update access to reports" ON reports;
DROP POLICY IF EXISTS "Allow delete access to reports" ON reports;

-- 1. Allow both anonymous and authenticated users to read all reports
-- Note: Since admin uses anon key, we need to allow anon read access
CREATE POLICY "Allow read access to reports"
ON reports FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Allow anonymous users to create reports (for public reporting)
CREATE POLICY "Allow users to create reports"
ON reports FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Allow both anonymous and authenticated users to update reports
-- Note: Since admin uses anon key, we need to allow anon update access
CREATE POLICY "Allow update access to reports"
ON reports FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Allow both anonymous and authenticated users to delete reports (optional)
-- Note: Since admin uses anon key, we need to allow anon delete access
CREATE POLICY "Allow delete access to reports"
ON reports FOR DELETE
TO anon, authenticated
USING (true);

-- Verify policies were created
SELECT 
  '✅ RLS POLICIES CREATED' as status,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'reports'
ORDER BY policyname;
