-- ═══════════════════════════════════════════════════
-- Ambrand Studio - Supabase Database Setup
-- Run this SQL in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════

-- ── PROJECTS TABLE ──
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT DEFAULT 'Unknown Client',
  category TEXT NOT NULL,
  status TEXT DEFAULT 'Draft',
  date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  cover_url TEXT,
  emoji TEXT DEFAULT '🎨',
  project_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── MESSAGES TABLE ──
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CLIENTS TABLE ──
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  projects_count INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  avatar TEXT,
  color TEXT DEFAULT '#5227FF',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow all operations with anon key (for dashboard management)
CREATE POLICY "Allow all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on clients" ON clients FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════

-- Seed Projects
INSERT INTO projects (title, client, category, status, date, description, tags, views, likes, cover_url, emoji) VALUES
  ('Nexus Brand Identity', 'Nexus Tech Co.', 'Branding', 'Published', '2025-11-15',
   'Complete brand identity redesign including logo, color palette, typography, and brand guidelines for a leading tech startup.',
   ARRAY['Logo','Brand Guide','Typography'], 1240, 87,
   'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80', '🎨'),

  ('Lumina UI Kit', 'Lumina SaaS', 'UI/UX', 'Published', '2025-10-28',
   'Comprehensive UI component library and design system for a SaaS platform. Over 200 components, 5 color themes, and full dark mode support.',
   ARRAY['Figma','Design System','Components'], 2100, 156,
   'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80', '💎'),

  ('Vertex 3D Packaging', 'Vertex Beverages', 'Packaging', 'Draft', '2026-01-10',
   'Premium 3D product packaging design for a new line of luxury beverages. Includes dieline, mockups, and print-ready files.',
   ARRAY['3D','Packaging','Print'], 430, 34,
   'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', '📦'),

  ('Orbit Motion Campaign', 'Orbit Media', 'Motion', 'Published', '2025-09-05',
   'Animated brand video and social media motion graphics package for a digital media company launch campaign.',
   ARRAY['After Effects','Animation','Social'], 3400, 210,
   'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', '🎬'),

  ('Sera 3D Character', 'Sera Games', '3D', 'Review', '2026-02-20',
   'Full 3D character design and modeling for an indie game project. Includes rigging, texturing, and expression sheets.',
   ARRAY['Blender','Character','Gaming'], 870, 98,
   'https://images.unsplash.com/photo-1636622433525-127afdf3662d?w=800&q=80', '🎮'),

  ('Zara Digital Campaign', 'Zara Cosmetics', 'Branding', 'Published', '2025-08-18',
   'Digital-first brand campaign including social media visuals, email templates, and landing page design.',
   ARRAY['Social Media','Email','Digital'], 1890, 134,
   'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80', '✨');

-- Seed Clients
INSERT INTO clients (name, company, projects_count, total_spent, avatar, color) VALUES
  ('Amir Al-Rashid', 'Nexus Tech Co.', 3, 12400, 'A', '#5227FF'),
  ('Sara Mitchell', 'Lumina SaaS', 2, 8700, 'S', '#1a9e75'),
  ('Chen Wei', 'Vertex Beverages', 1, 4500, 'C', '#e09b2a'),
  ('Julia Santos', 'Orbit Media', 4, 18200, 'J', '#d84b3a'),
  ('Tariq Al-Nasser', 'Sera Games', 1, 6100, 'T', '#2f7fd4'),
  ('Layla Mahmoud', 'Zara Cosmetics', 2, 9300, 'L', '#9c36b5');

-- ═══════════════════════════════════════════════════
-- Done! ✅
-- ═══════════════════════════════════════════════════
