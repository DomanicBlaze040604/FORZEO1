/**
 * Forzeo Client Dashboard - TypeScript Types
 * 
 * All interfaces and types used across the dashboard.
 * Includes support for niche, super-niche, and long-tail prompt categories.
 * 
 * @version 2.0.0
 * @author Forzeo Team
 * @license MIT
 * 
 * "Forzeo does not query LLMs. It monitors how LLMs already talk about you."
 */

// ============================================
// AI MODEL CONFIGURATION
// ============================================

/**
 * Configuration for an AI model that can be queried
 * @property id - Unique identifier (e.g., "llm_mentions")
 * @property name - Display name (e.g., "LLM Mentions")
 * @property provider - API provider (e.g., "DataForSEO")
 * @property color - UI color for charts/badges (hex format)
 * @property costPerQuery - Cost in USD per query
 * @property isLLM - Whether this is an LLM-based model
 * @property weight - Importance weight for scoring (0-1)
 */
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  color: string;
  costPerQuery: number;
  isLLM?: boolean;
  weight?: number;
}

/**
 * Available AI models for visibility analysis
 * 
 * LLM Models (via DataForSEO LLM Mentions API):
 * - chatgpt: OpenAI's ChatGPT responses
 * - claude: Anthropic's Claude responses
 * - gemini: Google's Gemini responses
 * - perplexity: Perplexity AI responses
 * 
 * Search Models:
 * - google_ai_overview: Direct Google AI Overview results
 * - google_serp: Traditional Google search results
 */
export const AI_MODELS: AIModel[] = [
  { id: "chatgpt", name: "ChatGPT", provider: "OpenAI", color: "#10a37f", costPerQuery: 0.02, isLLM: true, weight: 1.0 },
  { id: "claude", name: "Claude", provider: "Anthropic", color: "#d97706", costPerQuery: 0.02, isLLM: true, weight: 0.95 },
  { id: "gemini", name: "Gemini", provider: "Google", color: "#4285f4", costPerQuery: 0.02, isLLM: true, weight: 0.95 },
  { id: "perplexity", name: "Perplexity", provider: "Perplexity AI", color: "#6366f1", costPerQuery: 0.02, isLLM: true, weight: 0.9 },
  { id: "google_ai_overview", name: "Google AI Overview", provider: "DataForSEO", color: "#ea4335", costPerQuery: 0.003, isLLM: false, weight: 0.85 },
  { id: "google_serp", name: "Google SERP", provider: "DataForSEO", color: "#34a853", costPerQuery: 0.002, isLLM: false, weight: 0.7 },
];

// ============================================
// PROMPT CATEGORIES (Niche/Super-Niche Support)
// ============================================

/**
 * Prompt category types for organizing search queries
 * - broad: General industry queries (e.g., "best dating apps")
 * - niche: Specific segment queries (e.g., "dating apps for professionals")
 * - super_niche: Highly specific queries (e.g., "dating apps for Indian doctors in Mumbai")
 * - long_tail: Very specific, low-volume queries
 * - comparison: Brand vs brand queries
 * - problem: Problem-solving queries
 * - feature: Feature-specific queries
 * - local: Location-specific queries
 * - custom: User-defined queries
 */
export type PromptCategory = 
  | "broad" 
  | "niche" 
  | "super_niche" 
  | "long_tail"
  | "comparison" 
  | "problem" 
  | "feature" 
  | "local"
  | "custom"
  | "imported"
  | "default";

/**
 * Prompt category metadata for UI display
 */
export const PROMPT_CATEGORIES: Record<PromptCategory, { label: string; description: string; color: string; icon: string }> = {
  broad: { label: "Broad", description: "General industry queries", color: "#3b82f6", icon: "Globe" },
  niche: { label: "Niche", description: "Specific segment queries", color: "#8b5cf6", icon: "Target" },
  super_niche: { label: "Super Niche", description: "Highly specific queries", color: "#ec4899", icon: "Crosshair" },
  long_tail: { label: "Long Tail", description: "Very specific, low-volume queries", color: "#f59e0b", icon: "TrendingDown" },
  comparison: { label: "Comparison", description: "Brand vs brand queries", color: "#06b6d4", icon: "Scale" },
  problem: { label: "Problem", description: "Problem-solving queries", color: "#ef4444", icon: "HelpCircle" },
  feature: { label: "Feature", description: "Feature-specific queries", color: "#10b981", icon: "Sparkles" },
  local: { label: "Local", description: "Location-specific queries", color: "#f97316", icon: "MapPin" },
  custom: { label: "Custom", description: "User-defined queries", color: "#6b7280", icon: "Edit" },
  imported: { label: "Imported", description: "Imported from file", color: "#a855f7", icon: "Upload" },
  default: { label: "Default", description: "Pre-configured queries", color: "#64748b", icon: "List" },
};

// ============================================
// CLIENT CONFIGURATION
// ============================================

/**
 * A client/brand being tracked for AI visibility
 * @property id - Unique identifier (UUID)
 * @property name - Display name (e.g., "Juleo Club")
 * @property brand_name - Primary brand to detect (e.g., "Juleo")
 * @property brand_domain - Domain for citation detection (e.g., "juleo.club")
 * @property brand_tags - Alternative names/spellings to detect
 * @property slug - URL-safe identifier
 * @property target_region - Geographic target (e.g., "India")
 * @property location_code - DataForSEO location code
 * @property industry - Industry category for presets
 * @property competitors - Competitor brand names to track
 * @property primary_color - UI accent color (hex)
 */
export interface Client {
  id: string;
  name: string;
  brand_name: string;
  brand_domain?: string;
  brand_tags: string[];
  slug: string;
  target_region: string;
  location_code: number;
  location_name?: string;
  industry: string;
  competitors: string[];
  logo_url?: string;
  primary_color: string;
  created_at: string;
  updated_at?: string;
  is_default?: boolean;
  settings?: ClientSettings;
}

/**
 * Client-specific settings
 */
export interface ClientSettings {
  default_models?: string[];
  auto_run_on_add?: boolean;
  notification_email?: string;
  weekly_report?: boolean;
}

/**
 * Industry presets with default competitors and prompts
 * Includes niche and super-niche prompt templates
 */
export interface IndustryPreset {
  competitors: string[];
  prompts: PromptTemplate[];
}

/**
 * Prompt template with category classification
 */
export interface PromptTemplate {
  text: string;
  category: PromptCategory;
}

/**
 * Available industry presets with categorized prompts
 */
export const INDUSTRY_PRESETS: { [key: string]: IndustryPreset } = {
  "Dating/Matrimony": {
    competitors: ["Bumble", "Hinge", "Tinder", "Shaadi", "Aisle", "OkCupid", "Coffee Meets Bagel", "Happn"],
    prompts: [
      // Broad prompts
      { text: "Best dating apps in {region} 2025", category: "broad" },
      { text: "Top dating apps for serious relationships", category: "broad" },
      // Niche prompts
      { text: "Dating apps with ID verification {region}", category: "niche" },
      { text: "Dating apps for professionals in {region}", category: "niche" },
      { text: "Safe dating apps for women {region}", category: "niche" },
      // Super-niche prompts
      { text: "Dating apps for Indian professionals looking for marriage", category: "super_niche" },
      { text: "Verified dating apps for doctors in {region}", category: "super_niche" },
      { text: "Dating apps for divorced people over 40 in {region}", category: "super_niche" },
      // Comparison prompts
      { text: "{brand} vs Bumble which is better", category: "comparison" },
      { text: "Alternatives to Tinder for serious relationships", category: "comparison" },
      // Problem prompts
      { text: "How to find genuine profiles on dating apps", category: "problem" },
      { text: "Dating apps without fake profiles {region}", category: "problem" },
      // Feature prompts
      { text: "Dating apps with video calling feature", category: "feature" },
      { text: "Dating apps with background verification", category: "feature" },
      // Local prompts
      { text: "Best dating apps in Mumbai 2025", category: "local" },
      { text: "Dating apps popular in Delhi NCR", category: "local" },
    ]
  },
  "Food/Beverage": {
    competitors: ["Sysco", "US Foods", "Makro", "Metro", "CP Foods", "Charoen Pokphand"],
    prompts: [
      { text: "Best food distributors in {region}", category: "broad" },
      { text: "Premium beverage suppliers {region}", category: "broad" },
      { text: "Organic food suppliers for restaurants {region}", category: "niche" },
      { text: "Halal food distributors in {region}", category: "niche" },
      { text: "Japanese ingredient suppliers for fine dining {region}", category: "super_niche" },
      { text: "Sustainable seafood suppliers for hotels in {region}", category: "super_niche" },
      { text: "{brand} vs Sysco comparison", category: "comparison" },
      { text: "How to find reliable food suppliers", category: "problem" },
    ]
  },
  "Healthcare/Dental": {
    competitors: ["Bupa Dental", "MyDentist", "Dental Care", "Smile Direct", "Aspen Dental"],
    prompts: [
      { text: "Best dental clinic in {region}", category: "broad" },
      { text: "Top dentists near me", category: "broad" },
      { text: "Cosmetic dentistry specialists {region}", category: "niche" },
      { text: "Pediatric dentists in {region}", category: "niche" },
      { text: "Invisalign specialists for adults in {region}", category: "super_niche" },
      { text: "Emergency root canal treatment {region} weekend", category: "super_niche" },
      { text: "Affordable dental implants {region}", category: "problem" },
      { text: "Dental clinics with payment plans {region}", category: "feature" },
      { text: "Emergency dentist {region}", category: "local" },
    ]
  },
  "E-commerce/Fashion": {
    competitors: ["Myntra", "Ajio", "Amazon Fashion", "Meesho", "Nykaa", "Flipkart Fashion"],
    prompts: [
      { text: "Best online fashion stores {region}", category: "broad" },
      { text: "Affordable trendy clothing online", category: "broad" },
      { text: "Sustainable fashion brands {region}", category: "niche" },
      { text: "Plus size fashion online {region}", category: "niche" },
      { text: "Handloom sarees online authentic {region}", category: "super_niche" },
      { text: "Modest fashion for Muslim women {region}", category: "super_niche" },
      { text: "{brand} vs Myntra which is better", category: "comparison" },
      { text: "How to find authentic designer clothes online", category: "problem" },
    ]
  },
  "Technology/SaaS": {
    competitors: ["Salesforce", "HubSpot", "Zendesk", "Freshworks", "Zoho"],
    prompts: [
      { text: "Best CRM software 2025", category: "broad" },
      { text: "Top SaaS tools for startups", category: "broad" },
      { text: "CRM for small businesses under $50/month", category: "niche" },
      { text: "AI-powered customer support tools", category: "niche" },
      { text: "CRM with WhatsApp integration for {region} businesses", category: "super_niche" },
      { text: "Helpdesk software for e-commerce with multilingual support", category: "super_niche" },
      { text: "Alternatives to {competitor}", category: "comparison" },
      { text: "How to choose the right CRM for my business", category: "problem" },
    ]
  },
  "Travel/Hospitality": {
    competitors: ["Booking.com", "Airbnb", "Expedia", "MakeMyTrip", "Agoda", "TripAdvisor"],
    prompts: [
      { text: "Best hotels in {region}", category: "broad" },
      { text: "Top travel booking sites 2025", category: "broad" },
      { text: "Boutique hotels in {region}", category: "niche" },
      { text: "Pet-friendly hotels {region}", category: "niche" },
      { text: "Heritage hotels with spa in {region} under $200", category: "super_niche" },
      { text: "Eco-friendly resorts for honeymoon in {region}", category: "super_niche" },
      { text: "Cheap flights to {region}", category: "local" },
    ]
  },
  "Custom": {
    competitors: [],
    prompts: []
  }
};

/**
 * DataForSEO location codes for common regions
 * Used for geo-targeted search queries
 */
export const LOCATION_CODES: { [key: string]: number } = {
  "India": 2356,
  "United States": 2840,
  "United Kingdom": 2826,
  "Thailand": 2764,
  "Singapore": 2702,
  "Australia": 2036,
  "Canada": 2124,
  "Germany": 2276,
  "France": 2250,
  "Japan": 2392,
  "UAE": 2784,
  "Saudi Arabia": 2682,
  "Indonesia": 2360,
  "Malaysia": 2458,
  "Philippines": 2608,
  "Vietnam": 2704,
  "South Korea": 2410,
  "Brazil": 2076,
  "Mexico": 2484,
  "Spain": 2724,
  "Italy": 2380,
  "Netherlands": 2528,
  "Sweden": 2752,
  "Norway": 2578,
  "Denmark": 2208,
  "Finland": 2246,
  "Poland": 2616,
  "Turkey": 2792,
  "South Africa": 2710,
  "Nigeria": 2566,
  "Egypt": 2818,
  "Kenya": 2404,
  "New Zealand": 2554,
  "Ireland": 2372,
  "Belgium": 2056,
  "Switzerland": 2756,
  "Austria": 2040,
  "Portugal": 2620,
  "Greece": 2300,
  "Czech Republic": 2203,
  "Romania": 2642,
  "Hungary": 2348,
  "Israel": 2376,
  "Argentina": 2032,
  "Chile": 2152,
  "Colombia": 2170,
  "Peru": 2604,
  "Pakistan": 2586,
  "Bangladesh": 2050,
  "Sri Lanka": 2144,
  "Nepal": 2524,
  "Hong Kong": 2344,
  "Taiwan": 2158,
  "Surrey, UK": 2826,
  "London, UK": 2826,
  "Mumbai, India": 2356,
  "Delhi, India": 2356,
  "Bangalore, India": 2356,
};

// ============================================
// PROMPTS
// ============================================

/**
 * A search prompt to analyze for visibility
 * @property id - Unique identifier (UUID)
 * @property client_id - Parent client ID
 * @property prompt_text - The search query text
 * @property category - Prompt category (broad/niche/super_niche/etc.)
 * @property is_custom - User-added vs preset
 * @property is_active - Include in audits
 * @property priority - Execution priority (1-10, higher = first)
 * @property tags - Custom tags for filtering
 */
export interface Prompt {
  id: string;
  client_id: string;
  prompt_text: string;
  category: PromptCategory;
  is_custom: boolean;
  is_active: boolean;
  priority?: number;
  tags?: string[];
  created_at?: string;
  last_audited?: string;
}

// ============================================
// CITATIONS
// ============================================

/**
 * A citation/source referenced by an AI model
 * @property url - Full URL of the source
 * @property title - Page title
 * @property domain - Domain name (without www)
 * @property position - Position in results (0 = featured)
 * @property snippet - Text snippet from the source
 * @property is_brand_source - Whether this is the brand's own domain
 */
export interface Citation {
  url: string;
  title: string;
  domain: string;
  position?: number;
  snippet?: string;
  is_brand_source?: boolean;
}

/**
 * Aggregated citation data across all results
 */
export interface CitationSummary {
  url: string;
  title: string;
  domain: string;
  snippet?: string;
  count: number;
  prompts: string[];
  models: string[];
  categories: PromptCategory[];
  is_brand_source?: boolean;
}

// ============================================
// MODEL RESULTS
// ============================================

/**
 * Result from a single AI model for a prompt
 * Contains all visibility metrics and raw response data
 */
export interface ModelResult {
  model: string;
  model_name: string;
  provider: string;
  color?: string;
  weight?: number;
  success: boolean;
  error?: string;
  raw_response: string;
  response_length: number;
  brand_mentioned: boolean;
  brand_mention_count: number;
  brand_rank: number | null;
  brand_sentiment: "positive" | "neutral" | "negative";
  matched_terms: string[];
  winner_brand: string;
  competitors_found: CompetitorMention[];
  citations: Citation[];
  citation_count: number;
  api_cost: number;
  is_cited: boolean;
  authority_type?: "authority" | "alternative" | "mentioned";
  ai_search_volume?: number;
  response_time_ms?: number;
}

/**
 * Competitor mention data
 */
export interface CompetitorMention {
  name: string;
  count: number;
  rank: number | null;
  sentiment: "positive" | "neutral" | "negative";
}

// ============================================
// AUDIT RESULTS
// ============================================

/**
 * Complete audit result for a single prompt
 * Aggregates results from all queried AI models
 */
export interface AuditResult {
  id: string;
  prompt_id: string;
  prompt_text: string;
  prompt_category?: PromptCategory;
  model_results: ModelResult[];
  summary: AuditSummary;
  top_sources: SourceCount[];
  top_competitors: CompetitorSummary[];
  created_at: string;
}

/**
 * Summary metrics for a single audit
 */
export interface AuditSummary {
  share_of_voice: number;
  visibility_score?: number;
  trust_index?: number;
  average_rank: number | null;
  total_models_checked: number;
  visible_in: number;
  cited_in?: number;
  total_citations: number;
  total_cost: number;
}

/**
 * Source citation count
 */
export interface SourceCount {
  domain: string;
  count: number;
  url?: string;
  title?: string;
}

/**
 * Competitor summary data
 */
export interface CompetitorSummary {
  name: string;
  total_mentions: number;
  avg_rank: number | null;
  visibility_pct?: number;
}

// ============================================
// DASHBOARD SUMMARIES
// ============================================

/**
 * Aggregated dashboard metrics across all prompts
 * Used for the Summary tab display
 */
export interface DashboardSummary {
  total_prompts: number;
  overall_sov: number;
  visibility_score?: number;
  trust_index?: number;
  average_rank: number | null;
  total_citations: number;
  total_cost: number;
  top_sources: SourceCount[];
  top_competitors: CompetitorSummary[];
  visibility_by_model: ModelVisibility;
  visibility_by_category?: CategoryVisibility;
}

/**
 * Per-model visibility breakdown
 */
export interface ModelVisibility {
  [model: string]: {
    visible: number;
    total: number;
    cost: number;
    avg_rank?: number | null;
  };
}

/**
 * Per-category visibility breakdown
 */
export interface CategoryVisibility {
  [category: string]: {
    prompts: number;
    visible: number;
    sov: number;
    avg_rank: number | null;
  };
}

/**
 * Source/domain summary with full URLs
 */
export interface SourceSummary {
  domain: string;
  full_urls: string[];
  total_count: number;
  prompts: string[];
  categories?: PromptCategory[];
}

/**
 * Cost breakdown by model and prompt
 */
export interface CostBreakdown {
  total: number;
  by_model: { [model: string]: number };
  by_prompt: { [prompt: string]: number };
  by_category?: { [category: string]: number };
}

// ============================================
// API REQUEST/RESPONSE
// ============================================

/**
 * Request body for geo-audit API
 */
export interface GeoAuditRequest {
  client_id?: string;
  prompt_id?: string;
  prompt_text: string;
  prompt_category?: PromptCategory;
  brand_name: string;
  brand_domain?: string;
  brand_tags?: string[];
  competitors?: string[];
  location_code?: number;
  location_name?: string;
  models?: string[];
  save_to_db?: boolean;
}

/**
 * Response from geo-audit API
 */
export interface GeoAuditResponse {
  success: boolean;
  error?: string;
  data?: {
    id?: string;
    client_id?: string;
    prompt_id?: string;
    prompt_text: string;
    brand_name: string;
    brand_tags: string[];
    competitors: string[];
    models_requested: string[];
    summary: AuditSummary;
    model_results: ModelResult[];
    top_sources: SourceCount[];
    top_competitors: CompetitorSummary[];
    available_models: AIModel[];
    timestamp: string;
  };
}

/**
 * Request body for generate-content API
 */
export interface GenerateContentRequest {
  prompt: string;
  systemPrompt?: string;
  type?: "article" | "listicle" | "comparison" | "guide" | "faq";
  brand_name?: string;
  competitors?: string[];
  target_keywords?: string[];
}

/**
 * Response from generate-content API
 */
export interface GenerateContentResponse {
  response: string;
  type: string;
  generatedAt: string;
  word_count?: number;
  error?: string;
}

// ============================================
// DATABASE RECORDS (for Supabase storage)
// ============================================

/**
 * Database record for audit results
 * Matches the audit_results table schema
 */
export interface AuditResultRecord {
  id: string;
  client_id: string;
  prompt_id: string | null;
  prompt_text: string;
  prompt_category: PromptCategory;
  brand_name: string;
  brand_tags: string[];
  competitors: string[];
  models_used: string[];
  share_of_voice: number;
  visibility_score: number;
  trust_index: number;
  average_rank: number | null;
  total_citations: number;
  total_cost: number;
  model_results: ModelResult[];
  top_sources: SourceCount[];
  top_competitors: CompetitorSummary[];
  created_at: string;
}

/**
 * Database record for prompts
 * Matches the prompts table schema
 */
export interface PromptRecord {
  id: string;
  client_id: string;
  prompt_text: string;
  category: PromptCategory;
  is_custom: boolean;
  is_active: boolean;
  priority: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Database record for clients
 * Matches the clients table schema
 */
export interface ClientRecord {
  id: string;
  organization_id: string;
  name: string;
  brand_name: string;
  brand_domain: string | null;
  brand_tags: string[];
  slug: string;
  target_region: string;
  location_code: number;
  industry: string;
  competitors: string[];
  logo_url: string | null;
  primary_color: string;
  settings: ClientSettings;
  created_at: string;
  updated_at: string;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/**
 * Filter parameters for audit results
 */
export interface AuditFilterParams {
  client_id?: string;
  category?: PromptCategory;
  min_sov?: number;
  max_sov?: number;
  date_from?: string;
  date_to?: string;
  models?: string[];
}

/**
 * Export format options
 */
export type ExportFormat = "json" | "csv" | "txt" | "pdf";

/**
 * Notification settings
 */
export interface NotificationSettings {
  email_alerts: boolean;
  weekly_digest: boolean;
  sov_threshold: number;
  alert_on_competitor_gain: boolean;
}
