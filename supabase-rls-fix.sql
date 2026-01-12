-- =============================================
-- FIX SUPABASE RLS - Allow Public Write Access
-- Run this in Supabase SQL Editor to fix permission error
-- =============================================

-- Drop existing strict policies
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can manage app settings" ON app_settings;

-- Add new PUBLIC write policies (temporary for admin dashboard)
-- Projects: Allow all operations for everyone
CREATE POLICY "Public can insert projects" ON projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update projects" ON projects
  FOR UPDATE USING (true);

CREATE POLICY "Public can delete projects" ON projects
  FOR DELETE USING (true);

-- App Settings: Allow all operations for everyone
CREATE POLICY "Public can insert app settings" ON app_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update app settings" ON app_settings
  FOR UPDATE USING (true);

-- =============================================
-- STORAGE BUCKET POLICY FIX
-- =============================================

-- Make sure 'public_assets' bucket allows public upload
-- Go to: Supabase Dashboard > Storage > public_assets > Policies
-- Add policy:
-- Name: Public upload
-- Definition: (bucket_id = 'public_assets')
-- Allowed operations: INSERT
