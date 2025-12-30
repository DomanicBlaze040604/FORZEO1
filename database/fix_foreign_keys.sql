-- ============================================
-- Fix Foreign Key Constraints
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pqvyyziaczzgaythgpyc/sql/new
-- ============================================

-- Drop foreign key constraints that are causing issues
ALTER TABLE audit_results DROP CONSTRAINT IF EXISTS audit_results_client_id_fkey;
ALTER TABLE forzeo_prompts DROP CONSTRAINT IF EXISTS forzeo_prompts_client_id_fkey;
ALTER TABLE forzeo_citations DROP CONSTRAINT IF EXISTS forzeo_citations_client_id_fkey;
ALTER TABLE forzeo_citations DROP CONSTRAINT IF EXISTS forzeo_citations_audit_result_id_fkey;
ALTER TABLE forzeo_api_usage DROP CONSTRAINT IF EXISTS forzeo_api_usage_client_id_fkey;

-- Make client_id nullable in audit_results
ALTER TABLE audit_results ALTER COLUMN client_id DROP NOT NULL;

-- Success message
SELECT 'Foreign key constraints removed successfully!' as status;
