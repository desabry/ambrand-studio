-- Fix RLS for projects table
-- This allows authenticated users to insert/update/delete projects

DROP POLICY IF EXISTS "Allow all for authenticated users on projects" ON projects;
CREATE POLICY "Allow all for authenticated users on projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');
