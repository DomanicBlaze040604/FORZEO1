-- ============================================
-- Forzeo Dashboard - Disable RLS & Setup Tables
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pqvyyziaczzgaythgpyc/sql/new
-- ============================================

-- Step 1: Disable RLS on existing tables
ALTER TABLE IF EXISTS brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS prompts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS prompt_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS engine_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS url_citations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS api_usage DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS competitors DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing RLS policies (if any)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Step 3: Create clients table if not exists (maps to brands)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  brand_tags TEXT[] DEFAULT '{}',
  slug TEXT NOT NULL,
  target_region TEXT DEFAULT 'United States',
  location_code INTEGER DEFAULT 2840,
  industry TEXT DEFAULT 'Custom',
  competitors TEXT[] DEFAULT '{}',
  primary_color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Step 4: Create forzeo_prompts table (separate from existing prompts)
CREATE TABLE IF NOT EXISTS forzeo_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  category TEXT DEFAULT 'custom',
  is_custom BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE forzeo_prompts DISABLE ROW LEVEL SECURITY;

-- Step 5: Create audit_results table
CREATE TABLE IF NOT EXISTS audit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  prompt_id UUID,
  prompt_text TEXT NOT NULL,
  prompt_category TEXT DEFAULT 'custom',
  brand_name TEXT,
  brand_tags TEXT[] DEFAULT '{}',
  competitors TEXT[] DEFAULT '{}',
  models_used TEXT[] DEFAULT '{}',
  share_of_voice INTEGER DEFAULT 0,
  visibility_score INTEGER DEFAULT 0,
  trust_index INTEGER DEFAULT 0,
  average_rank DECIMAL(5,2),
  total_models_checked INTEGER DEFAULT 0,
  visible_in INTEGER DEFAULT 0,
  cited_in INTEGER DEFAULT 0,
  total_citations INTEGER DEFAULT 0,
  total_cost DECIMAL(10,6) DEFAULT 0,
  model_results JSONB DEFAULT '[]',
  summary JSONB DEFAULT '{}',
  top_sources JSONB DEFAULT '[]',
  top_competitors JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE audit_results DISABLE ROW LEVEL SECURITY;

-- Step 6: Create forzeo_citations table
CREATE TABLE IF NOT EXISTS forzeo_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_result_id UUID REFERENCES audit_results(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  domain TEXT NOT NULL,
  position INTEGER,
  snippet TEXT,
  model TEXT NOT NULL,
  is_brand_source BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE forzeo_citations DISABLE ROW LEVEL SECURITY;

-- Step 7: Create forzeo_api_usage table
CREATE TABLE IF NOT EXISTS forzeo_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  api_name TEXT NOT NULL,
  endpoint TEXT,
  request_count INTEGER DEFAULT 1,
  cost DECIMAL(10,6) DEFAULT 0,
  prompt_text TEXT,
  models_used TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE forzeo_api_usage DISABLE ROW LEVEL SECURITY;

-- Step 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forzeo_prompts_client_id ON forzeo_prompts(client_id);
CREATE INDEX IF NOT EXISTS idx_audit_results_client_id ON audit_results(client_id);
CREATE INDEX IF NOT EXISTS idx_audit_results_prompt_id ON audit_results(prompt_id);
CREATE INDEX IF NOT EXISTS idx_audit_results_created_at ON audit_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forzeo_citations_audit_result_id ON forzeo_citations(audit_result_id);

-- Step 9: Grant public access (for anon key)
GRANT ALL ON clients TO anon, authenticated;
GRANT ALL ON forzeo_prompts TO anon, authenticated;
GRANT ALL ON audit_results TO anon, authenticated;
GRANT ALL ON forzeo_citations TO anon, authenticated;
GRANT ALL ON forzeo_api_usage TO anon, authenticated;

-- Step 10: Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Forzeo tables created and RLS disabled successfully!' as status;
