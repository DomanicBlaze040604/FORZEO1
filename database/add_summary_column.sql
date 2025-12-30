-- ============================================
-- Add summary JSONB column to audit_results
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pqvyyziaczzgaythgpyc/sql/new
-- ============================================

-- Add summary JSONB column if it doesn't exist
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS summary JSONB DEFAULT '{}'::jsonb;

-- Update existing rows to populate summary from individual columns
UPDATE audit_results 
SET summary = jsonb_build_object(
  'share_of_voice', COALESCE(share_of_voice, 0),
  'average_rank', average_rank,
  'total_citations', COALESCE(total_citations, 0),
  'total_cost', COALESCE(total_cost, 0),
  'visibility_score', COALESCE(visibility_score, 0),
  'trust_index', COALESCE(trust_index, 0),
  'total_models_checked', COALESCE(total_models_checked, 0),
  'visible_in', COALESCE(visible_in, 0),
  'cited_in', COALESCE(cited_in, 0)
)
WHERE summary IS NULL OR summary = '{}'::jsonb;

-- Verify the update
SELECT id, prompt_text, summary, share_of_voice, total_citations, total_cost
FROM audit_results
ORDER BY created_at DESC
LIMIT 5;
