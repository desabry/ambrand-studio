-- 1. Add missing columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT DEFAULT 'Unknown Client';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Draft';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_url TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '🎨';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_url TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;

-- 2. Fix RLS — allow all operations for authenticated users
DROP POLICY IF EXISTS "Allow all on projects" ON projects;
DROP POLICY IF EXISTS "Allow all for authenticated users on projects" ON projects;
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;
DROP POLICY IF EXISTS "Admins and sales can insert projects" ON projects;
DROP POLICY IF EXISTS "Admins and sales can update projects" ON projects;

CREATE POLICY "Allow all on projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Add the same columns to the existing records
UPDATE projects SET category = 'Uncategorized' WHERE category IS NULL;
UPDATE projects SET status = 'Draft' WHERE status IS NULL;
