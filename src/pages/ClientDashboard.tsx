/**
 * ============================================================================
 * FORZEO GEO DASHBOARD - MAIN UI COMPONENT
 * ============================================================================
 * 
 * This is the main React component for the Forzeo GEO Dashboard.
 * It provides a professional dark-themed UI for AI visibility analytics.
 * 
 * ============================================================================
 * TABS
 * ============================================================================
 * 
 * 1. Summary Tab:
 *    - Share of Voice metric
 *    - Average rank in AI responses
 *    - Total citations count
 *    - Cost tracking
 *    - Visibility by model (bar charts)
 *    - Competitor gap analysis
 *    - Top sources list
 *    - AI-generated insights
 * 
 * 2. Prompts Tab:
 *    - Add single prompts
 *    - Bulk add prompts
 *    - AI prompt generator
 *    - Run individual audits
 *    - View detailed results
 *    - Delete prompts
 * 
 * 3. Citations Tab:
 *    - All citations aggregated
 *    - Citation count by URL
 *    - Model attribution
 *    - Prompt attribution
 * 
 * 4. Content Tab:
 *    - AI content generator
 *    - Article, listicle, comparison, guide, FAQ types
 *    - SEO-optimized output
 * 
 * 5. Sources Tab:
 *    - Domain-level aggregation
 *    - Full URL listing
 *    - Citation counts
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * 
 * - Dark theme UI (professional look)
 * - Model selection badges
 * - Client switcher dropdown
 * - Settings panel (brand tags, competitors)
 * - Import/export functionality
 * - Real-time loading states
 * - Error handling
 * - Date filtering
 * 
 * ============================================================================
 * DEPENDENCIES
 * ============================================================================
 * 
 * - React + TypeScript
 * - Radix UI (Tabs, Dialog, Dropdown, etc.)
 * - Tailwind CSS
 * - Lucide React (icons)
 * - useClientDashboard hook (state management)
 * 
 * @version 2.0.0
 * @author Forzeo Team
 */

import { useState, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart3, FileText, Globe, Play, Plus, Loader2, ChevronDown, X,
  CheckCircle, XCircle, ExternalLink, TrendingUp, Users, Award,
  Download, Upload, Settings, Tag, Trash2, DollarSign,
  AlertTriangle, Lightbulb, MoreVertical, Sparkles, Copy, Link2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import * as Tabs from "@radix-ui/react-tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useClientDashboard, AI_MODELS } from "@/hooks/useClientDashboard";
import { ForzeoLogo } from "@/components/ForzeoLogo";
import { MODEL_LOGOS } from "@/components/ModelLogos";

const MODEL_COLORS: Record<string, string> = {
  chatgpt: "#10b981", claude: "#f59e0b", gemini: "#3b82f6",
  perplexity: "#8b5cf6", google_ai_overview: "#ef4444", google_serp: "#22c55e",
};

export default function ClientDashboard() {
  const {
    clients, selectedClient, prompts, auditResults, summary,
    selectedModels, loading, loadingPromptId, error,
    
    addClient, updateClient, deleteClient, switchClient, setSelectedModels,
    runFullAudit, runSinglePrompt, clearResults,
    addCustomPrompt, addMultiplePrompts, deletePrompt, clearAllPrompts,
    updateBrandTags, updateCompetitors,
    exportToCSV, exportPrompts, exportFullReport, importData,
    generatePromptsFromKeywords, generateContent, getAllCitations,
    getModelStats, getCompetitorGap, getTopSources, getInsights,
    INDUSTRY_PRESETS: industries, LOCATION_CODES: locations
  } = useClientDashboard();

  // Theme-based colors
  // Dark theme colors (fixed)
  const isDark = true;
  const colors = {
    bg: "bg-[#0a0a0f]",
    bgCard: "bg-[#1a1a2e]",
    bgInput: "bg-[#0a0a0f]",
    border: "border-[#2a2a3e]",
    borderHover: "hover:bg-[#2a2a3e]",
    text: "text-white",
    textMuted: "text-gray-400",
    textSubtle: "text-gray-500",
  };

  const [newPrompt, setNewPrompt] = useState("");
  const [bulkPromptsOpen, setBulkPromptsOpen] = useState(false);
  const [bulkPrompts, setBulkPrompts] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newCompetitor, setNewCompetitor] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [editClientOpen, setEditClientOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [generatingPrompts, setGeneratingPrompts] = useState(false);
  const [contentTopic, setContentTopic] = useState("");
  const [contentType, setContentType] = useState("article");
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatingContent, setGeneratingContent] = useState(false);
  const [selectedPromptDetail, setSelectedPromptDetail] = useState<string | null>(null);
  const [sourcesView, setSourcesView] = useState<"domains" | "urls">("domains");
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newClientForm, setNewClientForm] = useState({
    name: "", brand_name: "", target_region: "United States", industry: "Custom", competitors: "", primary_color: "#8b5cf6"
  });
  const [editClientForm, setEditClientForm] = useState({
    name: "", brand_name: "", target_region: "United States", industry: "Custom", primary_color: "#8b5cf6"
  });

  const COLOR_OPTIONS = ["#ec4899", "#f59e0b", "#06b6d4", "#8b5cf6", "#10b981", "#ef4444", "#3b82f6", "#f97316"];

  const allCitations = getAllCitations();
  const modelStats = getModelStats();
  const competitorGap = getCompetitorGap();
  const topSources = getTopSources();
  const insights = getInsights();
  const pendingPrompts = prompts.filter(p => !auditResults.find(r => r.prompt_id === p.id)).length;
  const totalCost = Object.values(modelStats).reduce((sum, m) => sum + m.cost, 0);
  
  // Get unique dates from audit results for filtering
  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    auditResults.forEach(r => {
      if (r.created_at) {
        const date = new Date(r.created_at).toISOString().split('T')[0];
        dates.add(date);
      }
    });
    return Array.from(dates).sort((a, b) => b.localeCompare(a)); // Most recent first
  }, [auditResults]);

  // Filter audit results by selected date
  const filteredAuditResults = useMemo(() => {
    if (selectedDate === "all") return auditResults;
    return auditResults.filter(r => {
      if (!r.created_at) return false;
      const resultDate = new Date(r.created_at).toISOString().split('T')[0];
      return resultDate === selectedDate;
    });
  }, [auditResults, selectedDate]);
  
  // Estimate cost for pending prompts
  const estimatedCost = pendingPrompts * selectedModels.reduce((sum, modelId) => {
    const model = AI_MODELS.find(m => m.id === modelId);
    return sum + (model?.costPerQuery || 0.02);
  }, 0);

  // Get unique domains count
  const uniqueDomains = new Set(allCitations.map(c => c.domain)).size;

  // Handlers
  const handleAddPrompt = async () => {
    if (newPrompt.trim()) {
      await addCustomPrompt(newPrompt.trim());
      setNewPrompt("");
    }
  };

  const handleBulkAdd = () => {
    if (bulkPrompts.trim()) {
      addMultiplePrompts(bulkPrompts.split("\n").filter(l => l.trim().length > 3));
      setBulkPrompts("");
      setBulkPromptsOpen(false);
    }
  };

  const handleImport = () => {
    if (importText.trim()) {
      importData(importText);
      setImportText("");
      setImportDialogOpen(false);
    }
  };

  const handleGeneratePrompts = async () => {
    if (!keywordsInput.trim()) return;
    setGeneratingPrompts(true);
    try {
      const generated = await generatePromptsFromKeywords(keywordsInput);
      if (generated && generated.length > 0) {
        addMultiplePrompts(generated);
        setKeywordsInput("");
      }
    } finally {
      setGeneratingPrompts(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!contentTopic.trim()) return;
    setGeneratingContent(true);
    setGeneratedContent("");
    try {
      const content = await generateContent(contentTopic, contentType);
      if (content) setGeneratedContent(content);
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleRunSinglePrompt = async (promptId: string) => {
    await runSinglePrompt(promptId);
  };

  const handleCreateClient = async () => {
    if (!newClientForm.name.trim()) return;
    const competitors = newClientForm.competitors.split(",").map(c => c.trim()).filter(Boolean);
    console.log("Creating client:", newClientForm);
    const result = await addClient({
      name: newClientForm.name,
      brand_name: newClientForm.brand_name || newClientForm.name,
      target_region: newClientForm.target_region,
      location_code: locations[newClientForm.target_region] || 2840,
      industry: newClientForm.industry,
      competitors: competitors.length > 0 ? competitors : industries[newClientForm.industry]?.competitors || [],
      primary_color: newClientForm.primary_color,
    });
    console.log("Created client:", result);
    setNewClientForm({ name: "", brand_name: "", target_region: "United States", industry: "Custom", competitors: "", primary_color: "#8b5cf6" });
    setAddClientOpen(false);
  };

  const handleOpenEditClient = () => {
    if (!selectedClient) return;
    setEditClientForm({
      name: selectedClient.name,
      brand_name: selectedClient.brand_name,
      target_region: selectedClient.target_region,
      industry: selectedClient.industry,
      primary_color: selectedClient.primary_color,
    });
    setEditClientOpen(true);
  };

  const handleUpdateClient = async () => {
    if (!selectedClient || !editClientForm.name.trim()) {
      console.log("Update blocked - no client or empty name");
      return;
    }
    console.log("Updating client:", selectedClient.id, editClientForm);
    const result = await updateClient(selectedClient.id, {
      name: editClientForm.name,
      brand_name: editClientForm.brand_name || editClientForm.name,
      target_region: editClientForm.target_region,
      location_code: locations[editClientForm.target_region] || selectedClient.location_code,
      industry: editClientForm.industry,
      primary_color: editClientForm.primary_color,
    });
    console.log("Update result:", result);
    setEditClientOpen(false);
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    if (clients.length <= 1) {
      alert("Cannot delete the last client. Add another client first.");
      return;
    }
    if (confirm(`Are you sure you want to delete "${selectedClient.name}"? This will also delete all prompts and results.`)) {
      await deleteClient(selectedClient.id);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && selectedClient) {
      updateBrandTags([...selectedClient.brand_tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleAddCompetitor = () => {
    if (newCompetitor.trim() && selectedClient) {
      updateCompetitors([...selectedClient.competitors, newCompetitor.trim()]);
      setNewCompetitor("");
    }
  };

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      if (selectedModels.length > 1) setSelectedModels(selectedModels.filter(m => m !== modelId));
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => importData(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  const getPromptResult = (promptId: string) => filteredAuditResults.find(r => r.prompt_id === promptId);
  const selectedPromptResult = selectedPromptDetail ? getPromptResult(selectedPromptDetail) : null;

  // Get citation with model info
  const getCitationModels = (citation: typeof allCitations[0]) => {
    const models = new Set<string>();
    auditResults.forEach(result => {
      result.model_results.forEach(mr => {
        if (mr.citations.some(c => c.url === citation.url)) {
          models.add(mr.model);
        }
      });
    });
    return Array.from(models);
  };

  return (
    <div className={cn("min-h-screen p-6 transition-colors", isDark ? "" : "light", isDark ? "bg-[#0a0a0f] text-white" : "bg-gray-50 text-gray-900")}>
      {/* Header Row 1 - Logo, Client, Settings, Run */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ForzeoLogo className="h-7" isDark={isDark} />
          <span className={cn("text-xl font-semibold", colors.text)}>GEO Dashboard</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn("gap-2 bg-transparent border-blue-500 hover:bg-blue-500/10 ml-4", colors.text)}>
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                {selectedClient?.name || "Select Client"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={cn("w-72", colors.bgCard, colors.border)}>
              {clients.map(client => (
                <DropdownMenuItem key={client.id} onClick={() => switchClient(client)} className={cn(colors.text, colors.borderHover, "flex justify-between")}>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: client.primary_color }} />
                    <span>{client.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{client.target_region}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className={colors.border} />
              <DropdownMenuItem onClick={() => setAddClientOpen(true)} className={cn(colors.text, colors.borderHover)}>
                <Plus className="h-4 w-4 mr-2" /> Add New Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={cn(colors.textMuted, "hover:text-white h-8 w-8")}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn(colors.bgCard, colors.border)}>
              <DropdownMenuItem onClick={handleOpenEditClient} className={cn(colors.text, colors.borderHover)}>
                <Settings className="h-4 w-4 mr-2" /> Edit Client
              </DropdownMenuItem>
              <DropdownMenuSeparator className={colors.border} />
              <DropdownMenuItem onClick={handleDeleteClient} className={cn("text-red-400", colors.borderHover)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-3">
          
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className={cn(colors.textMuted, isDark ? "hover:text-white" : "hover:text-gray-900")}>
            <Settings className="h-5 w-5" />
          </Button>
          <span className={cn("text-sm", colors.textMuted)}>{prompts.length} Prompts</span>
          <Button onClick={runFullAudit} disabled={loading || pendingPrompts === 0} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run {pendingPrompts > 0 ? pendingPrompts : auditResults.length}
            {pendingPrompts > 0 && <span className="text-blue-200">(~${estimatedCost.toFixed(3)})</span>}
          </Button>
        </div>
      </div>

      {/* Header Row 2 - Model Badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          {AI_MODELS.map(model => {
            const isSelected = selectedModels.includes(model.id);
            const LogoComponent = MODEL_LOGOS[model.id]?.Logo;
            return (
              <Badge key={model.id} variant="outline" 
                className={cn(
                  "cursor-pointer transition-all px-3 py-1.5 rounded-full flex items-center gap-2",
                  isSelected ? "opacity-100" : "opacity-40"
                )}
                style={{ 
                  borderColor: MODEL_COLORS[model.id], 
                  backgroundColor: 'transparent',
                  color: MODEL_COLORS[model.id]
                }}
                onClick={() => toggleModel(model.id)}>
                {LogoComponent && <LogoComponent className="h-4 w-4" />}
                {model.name}
              </Badge>
            );
          })}
        </div>
        <span className={cn("text-sm", colors.textMuted)}>{selectedClient?.industry} • {selectedClient?.target_region}</span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Main Tabs */}
      <Tabs.Root defaultValue="summary" className="space-y-4">
        <Tabs.List className={cn("inline-flex p-1 rounded-lg gap-1 border", colors.bgCard, colors.border)}>
          <Tabs.Trigger value="summary" className={cn("px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white", colors.textMuted)}>
            <BarChart3 className="h-4 w-4 mr-2" /> Summary
          </Tabs.Trigger>
          <Tabs.Trigger value="prompts" className={cn("px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white", colors.textMuted)}>
            <FileText className="h-4 w-4 mr-2" /> Prompts ({prompts.length})
          </Tabs.Trigger>
          <Tabs.Trigger value="citations" className={cn("px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white", colors.textMuted)}>
            <Link2 className="h-4 w-4 mr-2" /> Citations ({allCitations.length})
          </Tabs.Trigger>
          <Tabs.Trigger value="content" className={cn("px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white", colors.textMuted)}>
            <Sparkles className="h-4 w-4 mr-2" /> Content
          </Tabs.Trigger>
          <Tabs.Trigger value="sources" className={cn("px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white", colors.textMuted)}>
            <Globe className="h-4 w-4 mr-2" /> Sources
          </Tabs.Trigger>
        </Tabs.List>

        {/* Summary Tab */}
        <Tabs.Content value="summary" className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            <div className={cn("rounded-xl p-4 border", colors.bgCard, colors.border)}>
              <div className={cn("flex items-center gap-2 text-sm mb-2", colors.textMuted)}><TrendingUp className="h-4 w-4" /> Share of Voice</div>
              <div className={cn("text-3xl font-bold", (summary?.overall_sov || 0) >= 50 ? "text-emerald-500" : (summary?.overall_sov || 0) >= 20 ? "text-yellow-500" : "text-red-500")}>{summary?.overall_sov || 0}%</div>
            </div>
            <div className={cn("rounded-xl p-4 border", colors.bgCard, colors.border)}>
              <div className={cn("flex items-center gap-2 text-sm mb-2", colors.textMuted)}><Award className="h-4 w-4" /> Average Rank</div>
              <div className="text-3xl font-bold text-blue-400">{summary?.average_rank ? `#${summary.average_rank}` : "—"}</div>
            </div>
            <div className={cn("rounded-xl p-4 border", colors.bgCard, colors.border)}>
              <div className={cn("flex items-center gap-2 text-sm mb-2", colors.textMuted)}><Globe className="h-4 w-4" /> Citations</div>
              <div className="text-3xl font-bold text-purple-400">{summary?.total_citations || 0}</div>
            </div>
            <div className={cn("rounded-xl p-4 border", colors.bgCard, colors.border)}>
              <div className={cn("flex items-center gap-2 text-sm mb-2", colors.textMuted)}><FileText className="h-4 w-4" /> Prompts</div>
              <div className="text-3xl font-bold text-cyan-400">{auditResults.length}</div>
            </div>
            <div className={cn("rounded-xl p-4 border", colors.bgCard, colors.border)}>
              <div className={cn("flex items-center gap-2 text-sm mb-2", colors.textMuted)}><DollarSign className="h-4 w-4" /> Total Cost</div>
              <div className="text-3xl font-bold text-orange-400">${totalCost.toFixed(4)}</div>
            </div>
          </div>

          {/* Visibility by Model */}
          <div className={cn("rounded-xl p-6 border", colors.bgCard, colors.border)}>
            <h3 className={cn("text-lg font-semibold mb-4", colors.text)}>Visibility by Model</h3>
            <div className="grid grid-cols-3 gap-4">
              {AI_MODELS.filter(m => selectedModels.includes(m.id)).map(model => {
                const stats = modelStats[model.id] || { visible: 0, total: 0, cost: 0 };
                const pct = stats.total > 0 ? Math.round((stats.visible / stats.total) * 100) : 0;
                const LogoComponent = MODEL_LOGOS[model.id]?.Logo;
                return (
                  <div key={model.id} className={cn("rounded-lg p-4 border", colors.bgInput, colors.border)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {LogoComponent && <LogoComponent className="h-5 w-5" />}
                        <span className={cn("text-sm", colors.text)}>{model.name}</span>
                      </div>
                      <span className={cn("text-xs", colors.textSubtle)}>${stats.cost.toFixed(4)}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1" style={{ color: MODEL_COLORS[model.id] }}>{stats.visible}/{stats.total}</div>
                    <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isDark ? "bg-[#2a2a3e]" : "bg-gray-200")}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: MODEL_COLORS[model.id] }} />
                    </div>
                    <div className={cn("text-xs mt-1", colors.textSubtle)}>{pct}% visible</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Competitor Gap & Top Sources */}
          <div className="grid grid-cols-2 gap-6">
            <div className={cn("rounded-xl p-6 border", colors.bgCard, colors.border)}>
              <div className="flex items-center gap-2 mb-4"><Users className={cn("h-5 w-5", colors.textMuted)} /><h3 className={cn("text-lg font-semibold", colors.text)}>Competitor Gap</h3></div>
              <div className="space-y-3">
                {competitorGap.length > 0 ? competitorGap.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={cn("text-sm w-32 truncate", colors.text)}>{comp.name}</span>
                    <div className={cn("flex-1 h-6 rounded-full overflow-hidden", colors.bgInput)}>
                      <div className="h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.min(comp.percentage, 100)}%`, backgroundColor: idx === 0 ? '#3b82f6' : '#4b5563' }}>
                        <span className="text-xs text-white font-medium">{comp.percentage}%</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", colors.bgInput, colors.border, colors.text)}>{comp.mentions}</Badge>
                  </div>
                )) : <div className={cn("text-sm", colors.textSubtle)}>Run audits to see competitor data</div>}
              </div>
            </div>
            <div className={cn("rounded-xl p-6 border", colors.bgCard, colors.border)}>
              <div className="flex items-center gap-2 mb-4"><Globe className={cn("h-5 w-5", colors.textMuted)} /><h3 className={cn("text-lg font-semibold", colors.text)}>Top Sources</h3></div>
              <div className="space-y-2">
                {topSources.length > 0 ? topSources.slice(0, 5).map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm w-4", colors.textSubtle)}>{idx + 1}.</span>
                      <span className={cn("text-sm truncate max-w-[200px]", colors.text)}>{source.domain}</span>
                    </div>
                    <span className={cn("text-sm", colors.textMuted)}>{source.count}</span>
                  </div>
                )) : <div className={cn("text-sm", colors.textSubtle)}>Run audits to see source data</div>}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className={cn("rounded-xl p-6 border", colors.bgCard, colors.border)}>
            <div className="flex items-center gap-2 mb-4"><Lightbulb className="h-5 w-5 text-yellow-500" /><h3 className={cn("text-lg font-semibold", colors.text)}>Insights</h3></div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className={cn("text-sm mb-2", colors.textMuted)}>Status</div>
                <div className={cn("flex items-center gap-2", insights.status === "high" ? "text-emerald-500" : insights.status === "medium" ? "text-yellow-500" : "text-red-500")}>
                  {insights.status === "high" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <span>{insights.statusText}</span>
                </div>
              </div>
              <div>
                <div className={cn("text-sm mb-2", colors.textMuted)}>Recommendations</div>
                <ul className={cn("space-y-1 text-sm", colors.text)}>
                  {insights.recommendations.map((rec, idx) => <li key={idx} className="flex items-start gap-2"><span className={colors.textSubtle}>•</span><span>{rec}</span></li>)}
                </ul>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Prompts Tab */}
        <Tabs.Content value="prompts" className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Add a prompt..." value={newPrompt} onChange={e => setNewPrompt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddPrompt()}
              className="bg-[#1a1a2e] border-[#2a2a3e] text-white placeholder:text-gray-500" />
            <Button onClick={handleAddPrompt} className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>

          {/* AI Prompt Generator */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-purple-400" /><span className="font-medium">AI Prompt Generator</span></div>
            <div className="flex gap-2">
              <Input placeholder="Enter keywords, tags, or topics (e.g., dating apps, safety features, India)" 
                value={keywordsInput} onChange={e => setKeywordsInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGeneratePrompts()}
                className="bg-[#0a0a0f] border-[#2a2a3e] text-white placeholder:text-gray-500" />
              <Button onClick={handleGeneratePrompts} disabled={generatingPrompts || !keywordsInput.trim()} className="bg-emerald-600 hover:bg-emerald-700 min-w-[100px]">
                {generatingPrompts ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Enter keywords and AI will generate relevant search prompts for visibility analysis</p>
          </div>

          {/* Bulk Add */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl overflow-hidden">
            <button onClick={() => setBulkPromptsOpen(!bulkPromptsOpen)} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#2a2a3e]">
              <span className="text-sm text-gray-300">▸ + Add multiple prompts at once</span>
              <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", bulkPromptsOpen && "rotate-180")} />
            </button>
            {bulkPromptsOpen && (
              <div className="p-4 pt-0 border-t border-[#2a2a3e]">
                <Textarea placeholder="Paste prompts here (one per line)..." value={bulkPrompts} onChange={e => setBulkPrompts(e.target.value)} rows={4}
                  className="bg-[#0a0a0f] border-[#2a2a3e] text-white placeholder:text-gray-500 mb-2" />
                <Button onClick={handleBulkAdd} disabled={!bulkPrompts.trim()} className="bg-blue-600 hover:bg-blue-700">Add All</Button>
              </div>
            )}
          </div>

          {/* Date Filter & Prompts Table */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl overflow-hidden">
            {/* Date Filter Header */}
            <div className="flex items-center justify-between p-3 border-b border-[#2a2a3e] bg-[#0a0a0f]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filter by Date:</span>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="w-[180px] h-8 bg-[#1a1a2e] border-[#2a2a3e] text-white text-sm">
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                    <SelectItem value="all" className="text-white hover:bg-[#2a2a3e]">All dates</SelectItem>
                    {uniqueDates.map(date => (
                      <SelectItem key={date} value={date} className="text-white hover:bg-[#2a2a3e]">
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-xs text-gray-500">
                {filteredAuditResults.length} results {selectedDate !== "all" && `on ${new Date(selectedDate).toLocaleDateString()}`}
              </span>
            </div>
            <table className="w-full">
              <thead className="bg-[#0a0a0f]">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-gray-400">Prompt</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-400 w-20">Category</th>
                  {AI_MODELS.filter(m => selectedModels.includes(m.id)).map(model => (
                    <th key={model.id} className="text-center p-2 text-sm font-medium w-16">
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: MODEL_COLORS[model.id] }} />
                        <span className="text-xs text-gray-500">{model.name.split(' ')[0]}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center p-3 text-sm font-medium text-gray-400 w-20">Cost</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-400 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map(prompt => {
                  const result = getPromptResult(prompt.id);
                  const isRunning = loadingPromptId === prompt.id;
                  return (
                    <tr key={prompt.id} className="border-t border-[#2a2a3e] hover:bg-[#2a2a3e]/50">
                      <td className="p-3 text-sm text-gray-200 max-w-[300px] truncate">{prompt.prompt_text}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="bg-[#2a2a3e] border-[#3a3a4e] text-gray-400 text-xs">{prompt.category || "Custom"}</Badge>
                      </td>
                      {AI_MODELS.filter(m => selectedModels.includes(m.id)).map(model => {
                        const mr = result?.model_results.find(r => r.model === model.id);
                        if (!result) return <td key={model.id} className="p-2 text-center text-gray-600">-</td>;
                        return (
                          <td key={model.id} className="p-2 text-center">
                            {mr?.brand_mentioned ? (
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                {mr.brand_mention_count > 1 && <span className="text-xs text-emerald-400">x{mr.brand_mention_count}</span>}
                              </div>
                            ) : <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center text-sm text-gray-400">{result ? `$${result.summary.total_cost.toFixed(4)}` : '-'}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {result && (
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPromptDetail(prompt.id)} className="text-gray-400 hover:text-white h-7 px-2">View</Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleRunSinglePrompt(prompt.id)} disabled={isRunning || loading} className={cn("h-7 px-2", result ? "text-orange-400 hover:text-orange-300" : "text-blue-400 hover:text-blue-300")}>
                            {isRunning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 mr-1" />}
                            {isRunning ? "" : result ? "Re-run" : "Run"}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deletePrompt(prompt.id)} className="text-gray-400 hover:text-red-400 h-7 w-7">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {prompts.length === 0 && <div className="p-8 text-center text-gray-500">No prompts yet. Add some above!</div>}
          </div>
        </Tabs.Content>

        {/* Citations Tab - All Citations Summary */}
        <Tabs.Content value="citations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-semibold">All Citations Summary</h3>
            </div>
            <Badge variant="outline" className="bg-[#1a1a2e] border-[#2a2a3e] text-gray-300">{allCitations.length} unique citations</Badge>
          </div>

          {/* Citation Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Top Domains</div>
              <div className="space-y-2">
                {topSources.slice(0, 5).map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 truncate max-w-[180px]">{s.domain}</span>
                    <span className="text-gray-500">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Most Cited</div>
              <div className="space-y-2">
                {allCitations.slice(0, 5).map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 truncate max-w-[180px]">{c.title || c.domain}</span>
                    <span className="text-cyan-400">{c.count}×</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Citation Coverage</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Citations</span>
                  <span className="text-white font-medium">{summary?.total_citations || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Unique URLs</span>
                  <span className="text-white font-medium">{allCitations.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Unique Domains</span>
                  <span className="text-white font-medium">{uniqueDomains}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Citations Table */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0a0a0f]">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-gray-400">Citation</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-400 w-20">Count</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-400 w-40">Models</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-400 w-48">Prompts</th>
                </tr>
              </thead>
              <tbody>
                {allCitations.map((citation, idx) => {
                  const models = getCitationModels(citation);
                  return (
                    <tr key={idx} className="border-t border-[#2a2a3e] hover:bg-[#2a2a3e]/50">
                      <td className="p-3">
                        <div className="space-y-1">
                          <a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                            {citation.title || citation.url.slice(0, 60)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <div className="text-xs text-gray-500">{citation.url.slice(0, 80)}{citation.url.length > 80 ? '...' : ''}</div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-white font-medium">{citation.count}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {models.map(m => (
                            <Badge key={m} variant="outline" className="text-xs px-1.5 py-0" style={{ borderColor: MODEL_COLORS[m], color: MODEL_COLORS[m] }}>
                              {AI_MODELS.find(am => am.id === m)?.name.split(' ')[0] || m}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-400">
                        <div className="space-y-1">
                          {citation.prompts.slice(0, 2).map((p, i) => (
                            <div key={i} className="truncate max-w-[180px]">{p.slice(0, 30)}...</div>
                          ))}
                          {citation.prompts.length > 2 && <span className="text-gray-500">+{citation.prompts.length - 2}</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {allCitations.length === 0 && <div className="p-8 text-center text-gray-500">No citations yet. Run an audit to see citation sources.</div>}
          </div>
        </Tabs.Content>

        {/* Content Tab */}
        <Tabs.Content value="content">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6 space-y-4">
              <div>
                <Label className="mb-2 block text-gray-300">Topic</Label>
                <Input placeholder="Best dating apps in India 2025" value={contentTopic} onChange={e => setContentTopic(e.target.value)}
                  className="bg-[#0a0a0f] border-[#2a2a3e] text-white placeholder:text-gray-500" />
              </div>
              <div>
                <Label className="mb-2 block text-gray-300">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-[#0a0a0f] border-[#2a2a3e] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                    <SelectItem value="article" className="text-white hover:bg-[#2a2a3e]">Article</SelectItem>
                    <SelectItem value="listicle" className="text-white hover:bg-[#2a2a3e]">Listicle</SelectItem>
                    <SelectItem value="comparison" className="text-white hover:bg-[#2a2a3e]">Comparison</SelectItem>
                    <SelectItem value="guide" className="text-white hover:bg-[#2a2a3e]">Guide</SelectItem>
                    <SelectItem value="faq" className="text-white hover:bg-[#2a2a3e]">FAQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerateContent} disabled={generatingContent || !contentTopic.trim()} className="bg-purple-600 hover:bg-purple-700 w-full">
                {generatingContent ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                {generatingContent ? "Generating..." : "Generate Content"}
              </Button>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-300">Generated Content</Label>
                {generatedContent && (
                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(generatedContent)} className="text-gray-400 hover:text-white">
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                )}
              </div>
              {generatedContent ? (
                <div className="bg-[#0a0a0f] rounded-lg p-4 max-h-[500px] overflow-auto">
                  <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-gray-300">{generatedContent}</div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-16">Generated content will appear here</div>
              )}
            </div>
          </div>
        </Tabs.Content>

        {/* Sources Tab */}
        <Tabs.Content value="sources">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant={sourcesView === "domains" ? "default" : "outline"} onClick={() => setSourcesView("domains")}
                className={sourcesView === "domains" ? "bg-blue-600" : "bg-[#1a1a2e] border-[#2a2a3e] text-white"}>Domains</Button>
              <Button variant={sourcesView === "urls" ? "default" : "outline"} onClick={() => setSourcesView("urls")}
                className={sourcesView === "urls" ? "bg-blue-600" : "bg-[#1a1a2e] border-[#2a2a3e] text-white"}>URLs</Button>
              <div className="flex-1" />
              <Badge variant="outline" className="bg-[#1a1a2e] border-[#2a2a3e] text-gray-300">{sourcesView === "domains" ? uniqueDomains : allCitations.length} sources</Badge>
            </div>

            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0a0a0f]">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-gray-400">{sourcesView === "domains" ? "Domain" : "URL"}</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-400">Citations</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-400">{sourcesView === "domains" ? "Prompts" : "Domain"}</th>
                  </tr>
                </thead>
                <tbody>
                  {sourcesView === "domains" ? (
                    topSources.map((source, idx) => (
                      <tr key={idx} className="border-t border-[#2a2a3e] hover:bg-[#2a2a3e]/50">
                        <td className="p-3">
                          <a href={`https://${source.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                            {source.domain}<ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="p-3 text-center text-gray-300">{source.count}</td>
                        <td className="p-3 text-sm text-gray-400 truncate max-w-[300px]">
                          {source.prompts?.slice(0, 2).join(", ")}{(source.prompts?.length || 0) > 2 && <span className="text-gray-500"> +{(source.prompts?.length || 0) - 2}</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    allCitations.map((citation, idx) => (
                      <tr key={idx} className="border-t border-[#2a2a3e] hover:bg-[#2a2a3e]/50">
                        <td className="p-3">
                          <a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-sm">
                            {citation.url.slice(0, 60)}{citation.url.length > 60 ? '...' : ''}<ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="p-3 text-center text-gray-300">{citation.count}</td>
                        <td className="p-3 text-sm text-gray-400">{citation.domain}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {(sourcesView === "domains" ? topSources : allCitations).length === 0 && (
                <div className="p-8 text-center text-gray-500">No sources yet. Run an audit to see source data.</div>
              )}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Prompt Detail Dialog - Prompt Analysis */}
      <Dialog open={!!selectedPromptDetail} onOpenChange={() => setSelectedPromptDetail(null)}>
        <DialogContent className="bg-[#0a0a0f] border-[#2a2a3e] text-white max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-4 border-b border-[#2a2a3e]">
            <DialogTitle className="text-xl font-semibold">Prompt Analysis</DialogTitle>
            <DialogDescription className="text-white text-lg mt-2">
              {prompts.find(p => p.id === selectedPromptDetail)?.prompt_text}
            </DialogDescription>
            {selectedPromptResult && (
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className={cn("font-medium", (selectedPromptResult.summary.share_of_voice || 0) > 0 ? "text-emerald-400" : "text-red-400")}>
                  SOV: {selectedPromptResult.summary.share_of_voice}%
                </span>
                <span className="text-purple-400">Citations: {selectedPromptResult.summary.total_citations}</span>
                <span className="text-orange-400">Cost: ${selectedPromptResult.summary.total_cost.toFixed(4)}</span>
                <span className="text-gray-400 text-xs">
                  {selectedPromptResult.created_at && new Date(selectedPromptResult.created_at).toLocaleString()}
                </span>
              </div>
            )}
          </DialogHeader>
          
          {selectedPromptResult && (
            <div className="overflow-auto max-h-[calc(90vh-140px)] p-6 space-y-4">
              {selectedPromptResult.model_results.map(mr => (
                <div key={mr.model} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl overflow-hidden">
                  {/* Model Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#2a2a3e]">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: MODEL_COLORS[mr.model] }} />
                      <span className="font-medium text-white">{mr.model_name}</span>
                      <span className="text-xs text-gray-500">({mr.provider})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {mr.brand_mentioned ? (
                        <Badge className="bg-emerald-500 text-white border-0 px-3">
                          Visible {mr.brand_mention_count > 1 ? `(${mr.brand_mention_count}×)` : ""}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500 text-white border-0 px-3">
                          Not Visible
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">${mr.api_cost?.toFixed(4) || '0.00'}</span>
                    </div>
                  </div>
                  
                  {/* Response Section - Always show */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-400">Response ({mr.response_length || 0} chars)</div>
                      {mr.brand_rank && (
                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                          Rank #{mr.brand_rank}
                        </Badge>
                      )}
                    </div>
                    <div className="bg-[#0a0a0f] rounded-lg p-4 max-h-80 overflow-auto">
                      {mr.raw_response && mr.raw_response.length > 0 ? (
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {mr.raw_response}
                        </pre>
                      ) : mr.error ? (
                        <div className="text-yellow-400 text-sm">
                          <div className="font-medium mb-2">ℹ️ {mr.error}</div>
                          {mr.error.includes("No cached") && (
                            <p className="text-gray-500 text-xs mt-2">
                              Tip: The LLM Mentions API searches cached AI responses. For real-time data, use Google SERP or AI Overview models.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic text-sm">
                          No response data returned from this model.
                        </div>
                      )}
                    </div>
                    
                    {/* Winner Brand */}
                    {mr.winner_brand && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Top mentioned:</span>
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                          {mr.winner_brand}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Competitors Found */}
                    {mr.competitors_found && mr.competitors_found.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-2">Competitors mentioned:</div>
                        <div className="flex flex-wrap gap-2">
                          {mr.competitors_found.map((comp, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-400">
                              {comp.name} ({comp.count}×){comp.rank && ` #${comp.rank}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Citations */}
                    {mr.citations && mr.citations.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-400 mb-2">Citations ({mr.citations.length})</div>
                        <div className="flex flex-wrap gap-2">
                          {mr.citations.slice(0, 10).map((c, i) => (
                            <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" 
                              className="text-xs text-blue-400 hover:text-blue-300 hover:underline bg-[#0a0a0f] px-3 py-1.5 rounded-full flex items-center gap-1">
                              {c.domain}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                          {mr.citations.length > 10 && (
                            <span className="text-xs text-gray-500 px-3 py-1.5">+{mr.citations.length - 10} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
        <DialogContent className={cn("max-w-lg", colors.bgCard, colors.border, colors.text)}>
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={cn("mb-2 block", colors.textMuted)}>Client Name</Label>
                <Input placeholder="Acme Corp" value={newClientForm.name} onChange={e => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  className={cn("border-blue-500 focus:border-blue-400", colors.bgInput, colors.text)} />
              </div>
              <div>
                <Label className={cn("mb-2 block", colors.textMuted)}>Brand Name</Label>
                <Input placeholder="Acme" value={newClientForm.brand_name} onChange={e => setNewClientForm({ ...newClientForm, brand_name: e.target.value })}
                  className={cn(colors.bgInput, colors.border, colors.text)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={cn("mb-2 block", colors.textMuted)}>Industry</Label>
                <Select value={newClientForm.industry} onValueChange={v => setNewClientForm({ ...newClientForm, industry: v })}>
                  <SelectTrigger className={cn(colors.bgInput, colors.border, colors.text)}><SelectValue /></SelectTrigger>
                  <SelectContent className={cn(colors.bgCard, colors.border)}>
                    {Object.keys(industries).map(ind => (
                      <SelectItem key={ind} value={ind} className={cn(colors.text, colors.borderHover)}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={cn("mb-2 block", colors.textMuted)}>Target Region</Label>
                <Select value={newClientForm.target_region} onValueChange={v => setNewClientForm({ ...newClientForm, target_region: v })}>
                  <SelectTrigger className={cn(colors.bgInput, colors.border, colors.text)}><SelectValue /></SelectTrigger>
                  <SelectContent className={cn(colors.bgCard, colors.border)}>
                    {Object.keys(locations).map(loc => (
                      <SelectItem key={loc} value={loc} className={cn(colors.text, colors.borderHover)}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className={cn("mb-2 block", colors.textMuted)}>Primary Color</Label>
              <div className="flex gap-3">
                {COLOR_OPTIONS.map(color => (
                  <button key={color} onClick={() => setNewClientForm({ ...newClientForm, primary_color: color })}
                    className={cn("h-10 w-10 rounded-full transition-all", newClientForm.primary_color === color && "ring-2 ring-blue-500 ring-offset-2", isDark ? "ring-offset-[#1a1a2e]" : "ring-offset-white")}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={handleCreateClient} disabled={!newClientForm.name.trim()} className="bg-blue-600 hover:bg-blue-700 px-6">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editClientOpen} onOpenChange={setEditClientOpen}>
        <DialogContent className={cn("max-w-lg", colors.bgCard, colors.border, colors.text)}>
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={cn("mb-2 block", colors.textMuted)}>Client Name</Label>
                <Input placeholder="Acme Corp" value={editClientForm.name} onChange={e => setEditClientForm({ ...editClientForm, name: e.target.value })}
                  className={cn("border-blue-500 focus:border-blue-400", colors.bgInput, colors.text)} />
              </div>
              <div>
                <Label className={cn("mb-2 block", colors.textMuted)}>Brand Name</Label>
                <Input placeholder="Acme" value={editClientForm.brand_name} onChange={e => setEditClientForm({ ...editClientForm, brand_name: e.target.value })}
                  className={cn(colors.bgInput, colors.border, colors.text)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={cn("mb-2 block", colors.textMuted)}>Industry</Label>
                <Select value={editClientForm.industry} onValueChange={v => setEditClientForm({ ...editClientForm, industry: v })}>
                  <SelectTrigger className={cn(colors.bgInput, colors.border, colors.text)}><SelectValue /></SelectTrigger>
                  <SelectContent className={cn(colors.bgCard, colors.border)}>
                    {Object.keys(industries).map(ind => (
                      <SelectItem key={ind} value={ind} className={cn(colors.text, colors.borderHover)}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={cn("mb-2 block", colors.textMuted)}>Target Region</Label>
                <Select value={editClientForm.target_region} onValueChange={v => setEditClientForm({ ...editClientForm, target_region: v })}>
                  <SelectTrigger className={cn(colors.bgInput, colors.border, colors.text)}><SelectValue /></SelectTrigger>
                  <SelectContent className={cn(colors.bgCard, colors.border)}>
                    {Object.keys(locations).map(loc => (
                      <SelectItem key={loc} value={loc} className={cn(colors.text, colors.borderHover)}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className={cn("mb-2 block", colors.textMuted)}>Primary Color</Label>
              <div className="flex gap-3">
                {COLOR_OPTIONS.map(color => (
                  <button key={color} onClick={() => setEditClientForm({ ...editClientForm, primary_color: color })}
                    className={cn("h-10 w-10 rounded-full transition-all", editClientForm.primary_color === color && "ring-2 ring-blue-500 ring-offset-2", isDark ? "ring-offset-[#1a1a2e]" : "ring-offset-white")}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditClientOpen(false)} className={cn("bg-transparent mr-2", colors.border, colors.text)}>Cancel</Button>
            <Button onClick={handleUpdateClient} disabled={!editClientForm.name.trim()} className="bg-blue-600 hover:bg-blue-700 px-6">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Prompts Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className={cn(colors.bgCard, colors.border, colors.text)}>
          <DialogHeader>
            <DialogTitle>Import Prompts</DialogTitle>
            <DialogDescription className={colors.textMuted}>Paste prompts (one per line) or import from file</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea placeholder="Best dating apps in India 2025&#10;Dating apps with verification&#10;Safe dating apps for women" 
              value={importText} onChange={e => setImportText(e.target.value)} rows={8}
              className={cn("placeholder:text-gray-500", colors.bgInput, colors.border, colors.text)} />
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className={cn("bg-transparent", colors.border, colors.text)}>
                <Upload className="h-4 w-4 mr-2" /> Import File
              </Button>
              <span className={cn("text-xs", colors.textSubtle)}>Supports .txt, .csv, .json</span>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setImportDialogOpen(false)} className={cn("bg-transparent", colors.border, colors.text)}>Cancel</Button>
            <Button onClick={handleImport} disabled={!importText.trim()} className="bg-blue-600 hover:bg-blue-700">Import Prompts</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Sheet */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent className={cn("w-[420px] overflow-auto border-l", colors.bg, colors.border, colors.text)}>
          <SheetHeader>
            <SheetTitle className={cn("text-xl", colors.text)}>Settings & Configuration</SheetTitle>
          </SheetHeader>
          <div className="space-y-8 mt-8">
            

            {/* Brand Tags */}
            <div>
              <Label className={cn("flex items-center gap-2 text-base mb-1", colors.text)}><Tag className="h-5 w-5" /> Brand Tags</Label>
              <p className={cn("text-sm mb-3", colors.textMuted)}>Alternative names to detect in AI responses</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedClient?.brand_tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className={cn("px-3 py-1.5 rounded-full", colors.bgCard, colors.border, colors.text)}>
                    {tag}
                    <button onClick={() => updateBrandTags(selectedClient.brand_tags.filter((_, i) => i !== idx))} className={cn("ml-2 hover:text-white", colors.textMuted)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add tag..." value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddTag()}
                  className={cn("border-blue-500 placeholder:text-gray-500 focus:border-blue-400", colors.bgInput, colors.text)} />
                <Button onClick={handleAddTag} className="bg-blue-600 hover:bg-blue-700 px-5">Add</Button>
              </div>
            </div>

            {/* Competitors */}
            <div>
              <Label className={cn("flex items-center gap-2 text-base mb-1", colors.text)}><Users className="h-5 w-5" /> Competitors</Label>
              <p className={cn("text-sm mb-3", colors.textMuted)}>Track competitor mentions in AI responses</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedClient?.competitors.map((comp, idx) => (
                  <Badge key={idx} variant="outline" className={cn("px-3 py-1.5 rounded-full", colors.bgCard, colors.border, colors.text)}>
                    {comp}
                    <button onClick={() => updateCompetitors(selectedClient.competitors.filter((_, i) => i !== idx))} className={cn("ml-2 hover:text-white", colors.textMuted)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add competitor..." value={newCompetitor} onChange={e => setNewCompetitor(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddCompetitor()}
                  className={cn("placeholder:text-gray-500", colors.bgInput, colors.border, colors.text)} />
                <Button onClick={handleAddCompetitor} className="bg-blue-600 hover:bg-blue-700 px-5">Add</Button>
              </div>
            </div>

            {/* AI Models */}
            <div>
              <Label className={cn("flex items-center gap-2 text-base mb-3", colors.text)}><Sparkles className="h-5 w-5" /> AI Models</Label>
              <div className="space-y-2">
                {AI_MODELS.map(model => {
                  const LogoComponent = MODEL_LOGOS[model.id]?.Logo;
                  return (
                    <div key={model.id} className={cn("flex items-center justify-between p-3 rounded-lg border", colors.bgCard, colors.border)}>
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedModels.includes(model.id)} onCheckedChange={() => toggleModel(model.id)} className="border-gray-400 data-[state=checked]:bg-blue-600" />
                        {LogoComponent && <LogoComponent className="h-5 w-5" />}
                        <span className={cn("text-sm", colors.text)}>{model.name}</span>
                      </div>
                      <span className={cn("text-xs", colors.textSubtle)}>${model.costPerQuery}/query</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export/Import */}
            <div>
              <Label className={cn("flex items-center gap-2 text-base mb-3", colors.text)}><Download className="h-5 w-5" /> Export & Import</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={exportToCSV} className={cn("text-sm", colors.bgCard, colors.border, colors.text, colors.borderHover)}>
                  <Download className="h-4 w-4 mr-2" /> CSV
                </Button>
                <Button variant="outline" onClick={exportPrompts} className={cn("text-sm", colors.bgCard, colors.border, colors.text, colors.borderHover)}>
                  <Download className="h-4 w-4 mr-2" /> Prompts
                </Button>
                <Button variant="outline" onClick={exportFullReport} className={cn("text-sm col-span-2", colors.bgCard, colors.border, colors.text, colors.borderHover)}>
                  <FileText className="h-4 w-4 mr-2" /> Full Report
                </Button>
                <Button variant="outline" onClick={() => setImportDialogOpen(true)} className={cn("text-sm col-span-2", colors.bgCard, colors.border, colors.text, colors.borderHover)}>
                  <Upload className="h-4 w-4 mr-2" /> Import Prompts
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className={cn("border-t pt-6", colors.border)}>
              <Label className="text-red-400 flex items-center gap-2 text-base mb-3"><AlertTriangle className="h-5 w-5" /> Danger Zone</Label>
              <div className="space-y-2">
                <Button variant="outline" onClick={clearResults} className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4 mr-2" /> Clear All Results
                </Button>
                <Button variant="outline" onClick={clearAllPrompts} className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4 mr-2" /> Clear All Prompts
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".txt,.csv,.json" className="hidden" />
    </div>
  );
}
