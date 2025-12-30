/**
 * Forzeo Content Generation API - Supabase Edge Function v2.0
 * 
 * Generates GEO-optimized content using Groq's Llama 3.1 model.
 * 
 * Features:
 * - Multiple content types (article, listicle, comparison, guide, FAQ)
 * - Niche/super-niche prompt generation
 * - Brand-optimized content for AI visibility
 * - Input validation and sanitization
 * - Rate limiting support
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - GROQ_API_KEY: Your Groq API key (free at console.groq.com)
 * 
 * @version 2.0.0
 * @author Forzeo Team
 * 
 * @example
 * POST /functions/v1/generate-content
 * {
 *   "prompt": "Write an article about best dating apps in India",
 *   "type": "article",
 *   "brand_name": "Juleo",
 *   "competitors": ["Bumble", "Tinder"]
 * }
 */

// @ts-nocheck - Deno types not available in IDE
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ============================================
// CORS CONFIGURATION
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

// ============================================
// TYPE DEFINITIONS
// ============================================

type ContentType = "article" | "listicle" | "comparison" | "guide" | "faq" | "prompts" | "content_brief";

interface GenerateContentRequest {
  prompt: string;
  systemPrompt?: string;
  type?: ContentType;
  brand_name?: string;
  competitors?: string[];
  target_keywords?: string[];
  industry?: string;
  region?: string;
  prompt_category?: "broad" | "niche" | "super_niche";
}

interface GenerateContentResponse {
  response: string;
  type: ContentType;
  word_count: number;
  generatedAt: string;
  error?: string;
}

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Sanitize input string to prevent injection
 */
function sanitizeString(input: string, maxLength: number = 2000): string {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, "")
    .replace(/[\x00-\x1F\x7F]/g, "");
}

/**
 * Validate request body
 */
function validateRequest(body: GenerateContentRequest): string | null {
  if (!body.prompt || body.prompt.length < 10) {
    return "prompt is required and must be at least 10 characters";
  }
  if (body.prompt.length > 2000) {
    return "prompt must be less than 2000 characters";
  }
  const validTypes: ContentType[] = ["article", "listicle", "comparison", "guide", "faq", "prompts", "content_brief"];
  if (body.type && !validTypes.includes(body.type)) {
    return `type must be one of: ${validTypes.join(", ")}`;
  }
  return null;
}

// ============================================
// GROQ API
// ============================================

/**
 * Call Groq API with Llama 3.1 8B model
 * Free tier: 14,400 requests/day
 */
async function callGroq(prompt: string, systemPrompt: string): Promise<{
  content: string;
  error?: string;
}> {
  const apiKey = Deno.env.get("GROQ_API_KEY");
  
  if (!apiKey) {
    return { content: "", error: "GROQ_API_KEY not configured" };
  }

  console.log("[Groq] Generating content...");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Groq] API error: ${response.status} - ${errorText.substring(0, 200)}`);
      return { content: "", error: `Groq API error: ${response.status}` };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    console.log(`[Groq] Generated ${content.length} characters`);
    
    return { content };
  } catch (err) {
    console.error(`[Groq] Exception: ${err}`);
    return { content: "", error: String(err) };
  }
}

// ============================================
// SYSTEM PROMPTS
// ============================================

/**
 * Get system prompt based on content type
 * Each type has specific formatting and structure requirements
 */
function getSystemPrompt(type: ContentType, brandName?: string, competitors?: string[]): string {
  const brandContext = brandName 
    ? `\n\nBrand to feature: ${brandName}${competitors?.length ? `\nCompetitors to mention: ${competitors.slice(0, 5).join(", ")}` : ""}`
    : "";

  const prompts: Record<ContentType, string> = {
    prompts: `You are a search prompt generator for AI visibility analysis.
Generate realistic, diverse search queries that users would ask AI assistants (ChatGPT, Google, Perplexity, etc.).

Include a mix of:
- Broad queries: "Best [product/service] in [region]"
- Niche queries: "[product] for [specific audience] in [region]"
- Super-niche queries: "[product] for [very specific use case] in [specific location]"
- Comparison queries: "[brand] vs [competitor]"
- Problem-solving queries: "How to [solve problem] with [product]"
- Feature queries: "[product] with [specific feature]"

Output only the prompts, one per line, no numbering or bullets.
Generate 8-12 diverse prompts.`,

    content_brief: `You are a content strategist specializing in GEO (Generative Engine Optimization).
Generate structured content briefs that help brands appear in AI-generated responses.

Output format (JSON):
{
  "title": "Suggested article title",
  "target_keywords": ["keyword1", "keyword2"],
  "outline": ["Section 1", "Section 2"],
  "key_points": ["Point 1", "Point 2"],
  "word_count": 800,
  "content_type": "article|listicle|guide"
}${brandContext}`,

    article: `You are an expert content writer specializing in GEO (Generative Engine Optimization).
Create high-quality, SEO-optimized articles in Markdown format.

Requirements:
- Use clear headings (H2, H3) for structure
- Include numbered lists where appropriate
- Write in an authoritative but accessible tone
- Target 600-1000 words
- Include factual, verifiable information
- Make content suitable for AI models to reference and cite
- Naturally incorporate the brand 2-3 times if specified${brandContext}`,

    listicle: `You are an expert content writer creating engaging listicle content.
Format in Markdown with numbered lists as the main structure.

Requirements:
- Use numbered lists (1. 2. 3.) as the primary format
- Include brief explanations for each item (2-3 sentences)
- Mention specific brands/products by name
- Be balanced and informative
- Target 500-800 words
- Include pros and cons where relevant${brandContext}`,

    comparison: `You are an expert content writer creating balanced comparison content.
Format in Markdown with clear structure.

Requirements:
- Compare features, pros, and cons objectively
- Use tables where appropriate (Markdown tables)
- Include specific details and data points
- Help readers make informed decisions
- Target 600-900 words
- Be fair to all options while highlighting strengths${brandContext}`,

    guide: `You are an expert content writer creating comprehensive how-to guides.
Format in Markdown with step-by-step instructions.

Requirements:
- Use numbered steps for instructions
- Include tips and best practices in callout boxes
- Address common questions and issues
- Be thorough but concise
- Target 700-1000 words
- Include prerequisites if applicable${brandContext}`,

    faq: `You are an expert content writer creating FAQ content.
Format in Markdown with Q&A structure.

Requirements:
- Use clear questions as headers (## Q: Question?)
- Provide concise but complete answers
- Cover common questions and concerns
- Include relevant details and examples
- Target 500-800 words
- Group related questions together${brandContext}`,
  };

  return prompts[type] || prompts.article;
}

// ============================================
// NICHE PROMPT GENERATION
// ============================================

/**
 * Generate niche and super-niche prompts for a given topic
 */
function buildPromptGenerationRequest(
  keywords: string,
  brandName?: string,
  industry?: string,
  region?: string,
  category?: "broad" | "niche" | "super_niche"
): string {
  const categoryInstructions: Record<string, string> = {
    broad: "Focus on general, high-volume search queries that many users would ask.",
    niche: "Focus on specific segment queries targeting particular audiences or use cases.",
    super_niche: "Focus on highly specific, long-tail queries with very particular requirements.",
  };

  return `Generate search prompts for AI visibility analysis based on:

Keywords/Topic: ${keywords}
${brandName ? `Brand: ${brandName}` : ""}
${industry ? `Industry: ${industry}` : ""}
${region ? `Region: ${region}` : ""}

${category ? categoryInstructions[category] : "Include a mix of broad, niche, and super-niche queries."}

Examples of query types:
- Broad: "Best dating apps 2025"
- Niche: "Dating apps for professionals over 30"
- Super-niche: "Dating apps for Indian doctors in Mumbai looking for marriage"

Generate 8-12 realistic search prompts that users would ask AI assistants.
Output only the prompts, one per line.`;
}

// ============================================
// MAIN HANDLER
// ============================================

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse request
    const body = await req.json() as GenerateContentRequest;
    
    // Validate
    const validationError = validateRequest(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs
    const prompt = sanitizeString(body.prompt, 2000);
    const type: ContentType = body.type || "article";
    const brandName = body.brand_name ? sanitizeString(body.brand_name, 100) : undefined;
    const competitors = body.competitors?.map(c => sanitizeString(c, 100)).filter(Boolean);
    const industry = body.industry ? sanitizeString(body.industry, 100) : undefined;
    const region = body.region ? sanitizeString(body.region, 100) : undefined;

    console.log(`[Content] Generating ${type} content...`);

    // Build the appropriate prompt
    let finalPrompt = prompt;
    if (type === "prompts") {
      finalPrompt = buildPromptGenerationRequest(
        prompt,
        brandName,
        industry,
        region,
        body.prompt_category
      );
    }

    // Get system prompt
    const systemPrompt = body.systemPrompt 
      ? sanitizeString(body.systemPrompt, 1000)
      : getSystemPrompt(type, brandName, competitors);

    // Generate content
    const result = await callGroq(finalPrompt, systemPrompt);

    if (result.error) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate word count
    const wordCount = result.content.split(/\s+/).filter(Boolean).length;

    console.log(`[Content] Generated ${result.content.length} chars, ${wordCount} words`);

    // Build response
    const response: GenerateContentResponse = {
      response: result.content,
      type,
      word_count: wordCount,
      generatedAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("[Content] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const safeError = errorMessage.replace(/[<>]/g, "").substring(0, 200);
    
    return new Response(
      JSON.stringify({ error: safeError }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
