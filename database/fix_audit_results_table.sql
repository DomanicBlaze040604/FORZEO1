-- ============================================
-- Fix audit_results table - Add ALL missing columns
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pqvyyziaczzgaythgpyc/sql/new
-- ============================================

-- Add all missing columns one by one
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS prompt_category TEXT DEFAULT 'custom';
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS brand_name TEXT;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS brand_tags TEXT[] DEFAULT '{}';
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS competitors TEXT[] DEFAULT '{}';
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS models_used TEXT[] DEFAULT '{}';
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS share_of_voice INTEGER DEFAULT 0;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS visibility_score INTEGER DEFAULT 0;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS trust_index INTEGER DEFAULT 0;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS average_rank DECIMAL(5,2);
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS total_models_checked INTEGER DEFAULT 0;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS visible_in INTEGER DEFAULT 0;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS cited_in INTEGER DEFAULT 0;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS total_citations INTEGER DEFAULT 0;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10,6) DEFAULT 0;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS top_sources JSONB DEFAULT '[]';
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS top_competitors JSONB DEFAULT '[]';

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'audit_results' 
ORDER BY ordinal_position;
