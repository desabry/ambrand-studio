
-- ============================================================================
-- Advertising Agency Dashboard — Initial Schema
-- Tables: profiles, projects, invoices, articles
-- Includes RLS policies + auto-profile trigger on auth signup
-- ============================================================================

-- 1. PROFILES ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  role       TEXT NOT NULL DEFAULT 'designer' CHECK (role IN ('owner', 'designer', 'finance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. RLS HELPER FUNCTIONS (SECURITY DEFINER bypasses RLS on sub-queries) -----

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner')
$$;

CREATE OR REPLACE FUNCTION public.is_finance()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'finance')
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- 3. PROFILES RLS ------------------------------------------------------------

CREATE POLICY "owner can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_owner());

CREATE POLICY "users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 4. PROJECTS ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  images_urls TEXT[],
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by  UUID NOT NULL REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5. PROJECTS RLS ------------------------------------------------------------

CREATE POLICY "public can view published projects"
  ON public.projects FOR SELECT
  USING (status = 'published');

CREATE POLICY "owner has full access to projects"
  ON public.projects FOR ALL
  USING (public.is_owner());

CREATE POLICY "designers can view own projects"
  ON public.projects FOR SELECT
  USING (public.get_user_role() = 'designer' AND created_by = auth.uid());

CREATE POLICY "designers can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'designer'
    AND created_by = auth.uid()
    AND status = 'draft'
  );

CREATE POLICY "designers can update own draft projects"
  ON public.projects FOR UPDATE
  USING (
    public.get_user_role() = 'designer'
    AND created_by = auth.uid()
    AND status = 'draft'
  )
  WITH CHECK (
    public.get_user_role() = 'designer'
    AND created_by = auth.uid()
  );

-- 6. INVOICES ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.invoices (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL,
  client_name    TEXT NOT NULL,
  amount         NUMERIC NOT NULL,
  status         TEXT,
  project_id     UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 7. INVOICES RLS ------------------------------------------------------------

CREATE POLICY "owner has full access to invoices"
  ON public.invoices FOR ALL
  USING (public.is_owner());

CREATE POLICY "finance has full access to invoices"
  ON public.invoices FOR ALL
  USING (public.is_finance());

-- 8. ARTICLES ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.articles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  content      TEXT,
  slug         TEXT UNIQUE NOT NULL,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 9. ARTICLES RLS ------------------------------------------------------------

CREATE POLICY "public can view published articles"
  ON public.articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "owner has full access to articles"
  ON public.articles FOR ALL
  USING (public.is_owner());

-- 10. AUTO-CREATE PROFILE ON USER SIGNUP -------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'designer');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
