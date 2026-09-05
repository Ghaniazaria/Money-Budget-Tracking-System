-- ==============================================================================
-- Fins Database Schema (Supabase PostgreSQL + Row Level Security)
-- ==============================================================================

-- 1. Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  workspace_type TEXT NOT NULL DEFAULT 'student' CHECK (workspace_type IN ('student', 'freelancer', 'freelance')),
  currency TEXT NOT NULL DEFAULT 'IDR' CHECK (currency IN ('IDR', 'USD')),
  language TEXT NOT NULL DEFAULT 'id' CHECK (language IN ('id', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table: budget_categories
CREATE TABLE IF NOT EXISTS public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "group" TEXT NOT NULL CHECK ("group" IN ('income', 'needs', 'wants', 'goals')),
  planned NUMERIC(14,2) NOT NULL DEFAULT 0,
  icon_name TEXT DEFAULT 'Tag',
  notes TEXT,
  workspace TEXT NOT NULL DEFAULT 'all' CHECK (workspace IN ('student', 'freelancer', 'freelance', 'all')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Table: transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  note TEXT,
  workspace TEXT NOT NULL DEFAULT 'all' CHECK (workspace IN ('student', 'freelancer', 'freelance', 'all')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Table: notes
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'academic' CHECK (category IN ('academic', 'project', 'finance', 'personal')),
  subject TEXT,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT 'emerald' CHECK (color IN ('emerald', 'amber', 'blue', 'purple', 'rose', 'gray')),
  workspace TEXT NOT NULL DEFAULT 'all' CHECK (workspace IN ('student', 'freelancer', 'freelance', 'all')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Table: tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_time TIME DEFAULT '23:59',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  category TEXT NOT NULL DEFAULT 'assignment' CHECK (category IN ('assignment', 'exam', 'project', 'personal', 'financial')),
  subject_or_project TEXT,
  workspace TEXT NOT NULL DEFAULT 'all' CHECK (workspace IN ('student', 'freelancer', 'freelance', 'all')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_budget_categories_user ON public.budget_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_notes_user ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- RLS POLICIES (Users can only access their own data)
-- ==============================================================================

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 2. Budget Categories Policies
DROP POLICY IF EXISTS "Users can view own categories" ON public.budget_categories;
CREATE POLICY "Users can view own categories" 
  ON public.budget_categories FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own categories" ON public.budget_categories;
CREATE POLICY "Users can create own categories" 
  ON public.budget_categories FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own categories" ON public.budget_categories;
CREATE POLICY "Users can update own categories" 
  ON public.budget_categories FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own categories" ON public.budget_categories;
CREATE POLICY "Users can delete own categories" 
  ON public.budget_categories FOR DELETE 
  USING (auth.uid() = user_id);

-- 3. Transactions Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own transactions" ON public.transactions;
CREATE POLICY "Users can create own transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "Users can update own transactions" 
  ON public.transactions FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
CREATE POLICY "Users can delete own transactions" 
  ON public.transactions FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. Notes Policies
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;
CREATE POLICY "Users can view own notes" 
  ON public.notes FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own notes" ON public.notes;
CREATE POLICY "Users can create own notes" 
  ON public.notes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notes" ON public.notes;
CREATE POLICY "Users can update own notes" 
  ON public.notes FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes;
CREATE POLICY "Users can delete own notes" 
  ON public.notes FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. Tasks Policies
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks" 
  ON public.tasks FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own tasks" ON public.tasks;
CREATE POLICY "Users can create own tasks" 
  ON public.tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own tasks" 
  ON public.tasks FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks" 
  ON public.tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, workspace_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'workspace_type', 'student')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    workspace_type = EXCLUDED.workspace_type,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
