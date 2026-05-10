-- ============================================================================
-- Ambrand Studio - Agency Portfolio & Dashboard System
-- Supabase PostgreSQL Database Schema
-- ============================================================================

-- This schema is designed for an agency portfolio and dashboard system
-- with role-based access, project management, client management,
-- quotations, and invoicing capabilities.

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. users
-- Purpose: Dashboard users with different roles (admin, sales)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'sales')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. projects
-- Purpose: Portfolio projects displayed on the website
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT,
  category TEXT,
  short_description TEXT,
  full_description TEXT,
  cover_image TEXT,
  behance_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. project_images
-- Purpose: Multiple gallery images for each project
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. logos
-- Purpose: Store logo showcase items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. testimonials
-- Purpose: Store client reviews
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  company_name TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  client_image TEXT,
  is_featured BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. clients
-- Purpose: Store client information for quotations and invoices
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. quotations
-- Purpose: Price quotations for clients
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_number TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  subtotal NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. quotation_items
-- Purpose: Services/items inside quotations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. invoices
-- Purpose: Invoices generated after quotation approval
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  subtotal NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. invoice_items
-- Purpose: Items/services inside invoices
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Indexes improve query performance on commonly searched fields

-- Users indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- Projects indexes
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
CREATE INDEX IF NOT EXISTS projects_category_idx ON projects(category);
CREATE INDEX IF NOT EXISTS projects_is_featured_idx ON projects(is_featured);
CREATE INDEX IF NOT EXISTS projects_created_by_idx ON projects(created_by);

-- Project images indexes
CREATE INDEX IF NOT EXISTS project_images_project_id_idx ON project_images(project_id);
CREATE INDEX IF NOT EXISTS project_images_sort_order_idx ON project_images(sort_order);

-- Logos indexes
CREATE INDEX IF NOT EXISTS logos_created_by_idx ON logos(created_by);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS testimonials_is_featured_idx ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS testimonials_rating_idx ON testimonials(rating);

-- Clients indexes
CREATE INDEX IF NOT EXISTS clients_company_name_idx ON clients(company_name);
CREATE INDEX IF NOT EXISTS clients_email_idx ON clients(email);

-- Quotations indexes
CREATE INDEX IF NOT EXISTS quotations_quotation_number_idx ON quotations(quotation_number);
CREATE INDEX IF NOT EXISTS quotations_client_id_idx ON quotations(client_id);
CREATE INDEX IF NOT EXISTS quotations_created_by_idx ON quotations(created_by);
CREATE INDEX IF NOT EXISTS quotations_status_idx ON quotations(status);

-- Quotation items indexes
CREATE INDEX IF NOT EXISTS quotation_items_quotation_id_idx ON quotation_items(quotation_id);

-- Invoices indexes
CREATE INDEX IF NOT EXISTS invoices_invoice_number_idx ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS invoices_quotation_id_idx ON invoices(quotation_id);
CREATE INDEX IF NOT EXISTS invoices_client_id_idx ON invoices(client_id);
CREATE INDEX IF NOT EXISTS invoices_created_by_idx ON invoices(created_by);
CREATE INDEX IF NOT EXISTS invoices_payment_status_idx ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON invoices(due_date);

-- Invoice items indexes
CREATE INDEX IF NOT EXISTS invoice_items_invoice_id_idx ON invoice_items(invoice_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Users Policies
-- ----------------------------------------------------------------------------
-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = auth.uid());

-- Admins can insert users
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update users
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- ----------------------------------------------------------------------------
-- Projects Policies
-- ----------------------------------------------------------------------------
-- Public can view projects
CREATE POLICY "Public can view projects" ON projects
  FOR SELECT USING (true);

-- Admins and sales can insert projects
CREATE POLICY "Admins and sales can insert projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update projects
CREATE POLICY "Admins and sales can update projects" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete projects
CREATE POLICY "Admins and sales can delete projects" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ----------------------------------------------------------------------------
-- Project Images Policies
-- ----------------------------------------------------------------------------
-- Public can view project images
CREATE POLICY "Public can view project images" ON project_images
  FOR SELECT USING (true);

-- Admins and sales can insert project images
CREATE POLICY "Admins and sales can insert project images" ON project_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update project images
CREATE POLICY "Admins and sales can update project images" ON project_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete project images
CREATE POLICY "Admins and sales can delete project images" ON project_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ----------------------------------------------------------------------------
-- Logos Policies
-- ----------------------------------------------------------------------------
-- Public can view logos
CREATE POLICY "Public can view logos" ON logos
  FOR SELECT USING (true);

-- Admins and sales can insert logos
CREATE POLICY "Admins and sales can insert logos" ON logos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update logos
CREATE POLICY "Admins and sales can update logos" ON logos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete logos
CREATE POLICY "Admins and sales can delete logos" ON logos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ----------------------------------------------------------------------------
-- Testimonials Policies
-- ----------------------------------------------------------------------------
-- Public can view featured testimonials
CREATE POLICY "Public can view featured testimonials" ON testimonials
  FOR SELECT USING (is_featured = true);

-- Admins and sales can view all testimonials
CREATE POLICY "Admins and sales can view all testimonials" ON testimonials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can insert testimonials
CREATE POLICY "Admins and sales can insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update testimonials
CREATE POLICY "Admins and sales can update testimonials" ON testimonials
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete testimonials
CREATE POLICY "Admins and sales can delete testimonials" ON testimonials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ----------------------------------------------------------------------------
-- Clients Policies
-- ----------------------------------------------------------------------------
-- Admins and sales can view clients
CREATE POLICY "Admins and sales can view clients" ON clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can insert clients
CREATE POLICY "Admins and sales can insert clients" ON clients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update clients
CREATE POLICY "Admins and sales can update clients" ON clients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete clients
CREATE POLICY "Admins and sales can delete clients" ON clients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ----------------------------------------------------------------------------
-- Quotations Policies
-- ----------------------------------------------------------------------------
-- Admins and sales can view quotations
CREATE POLICY "Admins and sales can view quotations" ON quotations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can insert quotations
CREATE POLICY "Admins and sales can insert quotations" ON quotations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update quotations
CREATE POLICY "Admins and sales can update quotations" ON quotations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete quotations
CREATE POLICY "Admins and sales can delete quotations" ON quotations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ----------------------------------------------------------------------------
-- Quotation Items Policies
-- ----------------------------------------------------------------------------
-- Admins and sales can view quotation items
CREATE POLICY "Admins and sales can view quotation items" ON quotation_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can insert quotation items
CREATE POLICY "Admins and sales can insert quotation items" ON quotation_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update quotation items
CREATE POLICY "Admins and sales can update quotation items" ON quotation_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete quotation items
CREATE POLICY "Admins and sales can delete quotation items" ON quotation_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ----------------------------------------------------------------------------
-- Invoices Policies
-- ----------------------------------------------------------------------------
-- Admins and sales can view invoices
CREATE POLICY "Admins and sales can view invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can insert invoices
CREATE POLICY "Admins and sales can insert invoices" ON invoices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update invoices
CREATE POLICY "Admins and sales can update invoices" ON invoices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete invoices
CREATE POLICY "Admins and sales can delete invoices" ON invoices
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ----------------------------------------------------------------------------
-- Invoice Items Policies
-- ----------------------------------------------------------------------------
-- Admins and sales can view invoice items
CREATE POLICY "Admins and sales can view invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can insert invoice items
CREATE POLICY "Admins and sales can insert invoice items" ON invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can update invoice items
CREATE POLICY "Admins and sales can update invoice items" ON invoice_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- Admins and sales can delete invoice items
CREATE POLICY "Admins and sales can delete invoice items" ON invoice_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'sales')
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS AND TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: generate_quotation_number
-- Purpose: Generate a unique quotation number
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_quotation_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'QT';
  year_part TEXT := TO_CHAR(NOW(), 'YYYY');
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 8) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM quotations
  WHERE quotation_number LIKE prefix || year_part || '-%';
  
  RETURN prefix || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Function: generate_invoice_number
-- Purpose: Generate a unique invoice number
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'INV';
  year_part TEXT := TO_CHAR(NOW(), 'YYYY');
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM invoices
  WHERE invoice_number LIKE prefix || year_part || '-%';
  
  RETURN prefix || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Trigger: auto_generate_quotation_number
-- Purpose: Automatically generate quotation number on insert
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER auto_generate_quotation_number
  BEFORE INSERT ON quotations
  FOR EACH ROW
  WHEN (NEW.quotation_number IS NULL OR NEW.quotation_number = '')
  EXECUTE FUNCTION generate_quotation_number();

-- ----------------------------------------------------------------------------
-- Trigger: auto_generate_invoice_number
-- Purpose: Automatically generate invoice number on insert
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER auto_generate_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
  EXECUTE FUNCTION generate_invoice_number();

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
