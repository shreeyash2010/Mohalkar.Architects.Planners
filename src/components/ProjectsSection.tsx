import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Eye,
  Grid,
  List,
  FileText,
  MapPin,
  Maximize2,
  ChevronRight,
  SlidersHorizontal,
  X,
  Home,
  Building2,
  Trees,
  Layers,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Download,
  Loader2,
  CheckCircle2,
  FileDown
} from "lucide-react";
import { PROJECT_CATEGORIES, ProjectItem } from "../data/projectsData";
import { getPublishedProjects } from "../utils/projectStorage";
import { useTheme } from "../context/ThemeContext";
import { downloadSampleBlueprint } from "../utils/blueprintPdfGenerator";

interface ProjectsSectionProps {
  setActiveTab: (tab: string) => void;
  onSelectProject: (p: ProjectItem) => void;
  projects?: ProjectItem[];
}

// Typology context metadata for primary highlighted categories
const CATEGORY_SPOTLIGHTS: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    enquiryPreset: string;
    accentColor: string;
    lightAccentColor: string;
    badgeBg: string;
  }
> = {
  residential: {
    title: "Residential Architecture & Luxury Estates",
    subtitle: "Custom Villas, Bungalow Layouts & Private Residences",
    description:
      "Curated residential portfolio spanning custom private villas, sprawling bungalows, and multi-generational family homes. Designed with Vaastu alignment, natural daylighting, and thermal comfort.",
    highlights: ["5,000 sq.ft Luxury Bungalows", "Solarium Estate Plans", "Modern Elevations", "Vaastu-Compliant Layouts"],
    enquiryPreset: "Residential Architecture / Villa",
    accentColor: "from-amber-500/20 to-amber-900/10 border-amber-500/40 text-amber-300",
    lightAccentColor: "from-amber-50 to-amber-100/60 border-amber-300 text-amber-900 shadow-sm",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  commercial: {
    title: "Commercial Complexes, Plazas & Retail Hubs",
    subtitle: "Shopping Malls, Corporate Headquarters & Business Arcades",
    description:
      "Engineered commercial hubs, shopping complexes, and mixed-use commercial elevations adhering strictly to NBC fire life safety, multi-level basement parking, and high-footfall circulation.",
    highlights: ["Apex Commercial Plaza", "26,600+ sq.m Mall Study", "Multi-Level Basement Parking", "Facade Elevations"],
    enquiryPreset: "Commercial Complex / Retail Plaza",
    accentColor: "from-blue-500/20 to-indigo-900/10 border-blue-500/40 text-blue-300",
    lightAccentColor: "from-blue-50 to-indigo-100/60 border-blue-300 text-blue-900 shadow-sm",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  landscape: {
    title: "Landscape Architecture & Site Master Planning",
    subtitle: "Land Subdivisions, Township NA Layouts & Botanical Gardens",
    description:
      "Master layout subdivision schemes, residential NA plotted townships, civic parks, and eco-sensitive contour land engineering tailored to the topography of Maharashtra.",
    highlights: ["12-Acre Subdivision Schemes", "8.5-Acre Township Layouts", "Botanical Pavilions", "Contour Grading & Drainage"],
    enquiryPreset: "Landscape & Master Site Planning",
    accentColor: "from-emerald-500/20 to-teal-900/10 border-emerald-500/40 text-emerald-300",
    lightAccentColor: "from-emerald-50 to-teal-100/60 border-emerald-300 text-emerald-900 shadow-sm",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  setActiveTab,
  onSelectProject,
  projects: customProjects,
}) => {
  const { isDark } = useTheme();
  const [internalProjects, setInternalProjects] = useState<ProjectItem[]>(() =>
    customProjects && customProjects.length > 0 ? customProjects : getPublishedProjects()
  );

  useEffect(() => {
    if (customProjects && customProjects.length > 0) {
      setInternalProjects(customProjects);
    } else {
      const handleUpdate = () => setInternalProjects(getPublishedProjects());
      setInternalProjects(getPublishedProjects());
      window.addEventListener("mohalkar:projects-updated", handleUpdate);
      return () => window.removeEventListener("mohalkar:projects-updated", handleUpdate);
    }
  }, [customProjects]);

  const activeProjects = customProjects && customProjects.length > 0 ? customProjects : internalProjects;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [otherCategoriesOpen, setOtherCategoriesOpen] = useState<boolean>(false);
  const [downloadingProjectId, setDownloadingProjectId] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDownloadBlueprint = async (e: React.MouseEvent, project: ProjectItem) => {
    e.stopPropagation();
    if (downloadingProjectId) return;
    try {
      setDownloadingProjectId(project.id);
      setDownloadStatus("Generating architectural blueprint...");
      await downloadSampleBlueprint(project, (status) => setDownloadStatus(status));
      setToastMessage(`Sample Blueprint for "${project.title}" downloaded successfully!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error("Blueprint download error:", err);
      setToastMessage("Failed to generate blueprint. Please try again.");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setDownloadingProjectId(null);
      setDownloadStatus("");
    }
  };

  // Calculate category counts dynamically directly from the archive
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activeProjects.length };
    activeProjects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [activeProjects]);

  // Filtered projects by category and search term
  const filteredProjects = useMemo(() => {
    return activeProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        project.title.toLowerCase().includes(q) ||
        project.tag.toLowerCase().includes(q) ||
        project.alt.toLowerCase().includes(q) ||
        (project.location && project.location.toLowerCase().includes(q)) ||
        (project.scale && project.scale.toLowerCase().includes(q)) ||
        (project.scope && project.scope.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeProjects, selectedCategory, searchQuery]);

  // Primary category chips definitions
  const primaryCategoryChips = [
    {
      id: "all",
      label: "All Projects",
      subtitle: "Full Architectural Archive",
      count: categoryCounts["all"] || 0,
      icon: Layers,
    },
    {
      id: "residential",
      label: "Residential",
      subtitle: "Villas & Bungalows",
      count: categoryCounts["residential"] || 0,
      icon: Home,
    },
    {
      id: "commercial",
      label: "Commercial",
      subtitle: "Malls, Plazas & Hubs",
      count: categoryCounts["commercial"] || 0,
      icon: Building2,
    },
    {
      id: "landscape",
      label: "Landscape",
      subtitle: "Subdivisions & Master Plans",
      count: categoryCounts["landscape"] || 0,
      icon: Trees,
    },
  ];

  // Secondary categories
  const secondaryCategories = PROJECT_CATEGORIES.filter(
    (c) => !["all", "residential", "commercial", "landscape"].includes(c.id)
  );

  const activeSpotlight = CATEGORY_SPOTLIGHTS[selectedCategory];

  // Color badges helper
  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "residential":
        return isDark
          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
          : "bg-amber-100 text-amber-900 border-amber-300";
      case "commercial":
        return isDark
          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
          : "bg-blue-100 text-blue-900 border-blue-300";
      case "landscape":
        return isDark
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
          : "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "architecture":
        return isDark
          ? "bg-[#c8a96e]/20 text-[#c8a96e] border-[#c8a96e]/30"
          : "bg-[#c8a96e]/25 text-[#8c6d32] border-[#c8a96e]/50 font-bold";
      case "urban":
        return isDark
          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
          : "bg-purple-100 text-purple-900 border-purple-300";
      default:
        return isDark
          ? "bg-neutral-800 text-neutral-300 border-neutral-700"
          : "bg-neutral-100 text-neutral-800 border-neutral-300";
    }
  };

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* ── HERO & SEARCH HEADER ────────────────────── */}
      <section
        className={`relative pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b bg-blueprint-grid ${
          isDark ? "border-[#1e2229]" : "border-[#e5e9f0]"
        }`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-3">
            <button
              onClick={() => setActiveTab("home")}
              className="hover:underline cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className={isDark ? "text-neutral-400" : "text-neutral-500"}>
              Our Projects
            </span>
          </div>

          <h1
            className={`font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Crafted With Purpose, Built to Last
          </h1>
          <p
            className={`mt-3 sm:mt-4 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            A comprehensive archive of {activeProjects.length}+ executed assignments, working drawings, commercial complexes, and municipal blueprints.
          </p>

          {/* Interactive Search Bar */}
          <div className="mt-6 sm:mt-8 max-w-lg mx-auto relative px-2 sm:px-0">
            <Search className="w-4 h-4 text-neutral-400 absolute left-5 sm:left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects (e.g. Bungalow, Mall, Subdivision, Pune, Layout)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-10 py-3 sm:py-3 rounded-xl text-xs sm:text-sm focus:outline-none transition-colors border shadow-inner ${
                isDark
                  ? "bg-[#141720] border-[#252830] text-white placeholder-neutral-500 focus:border-[#c8a96e]"
                  : "bg-white border-[#d8dde6] text-neutral-900 placeholder-neutral-500 focus:border-[#c8a96e] shadow-sm"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-5 sm:right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                  isDark ? "bg-[#1e232d] text-neutral-400 hover:text-white" : "bg-[#f1f3f6] text-neutral-600 hover:text-black"
                }`}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── FILTERABLE GRID GALLERY CONTROLS ────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Dynamic Category Chips Showcase */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#c8a96e]" />
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-neutral-300" : "text-neutral-800"
                }`}
              >
                Filter By Discipline
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              {filteredProjects.length} of {activeProjects.length} Plates Active
            </span>
          </div>

          {/* Primary Dynamic Category Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {primaryCategoryChips.map((chip) => {
              const Icon = chip.icon;
              const isActive = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => {
                    setSelectedCategory(chip.id);
                    setOtherCategoriesOpen(false);
                  }}
                  className={`group relative p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-98 ${
                    isActive
                      ? "bg-[#c8a96e] text-[#0c0e12] border-[#c8a96e] shadow-lg shadow-[#c8a96e]/20"
                      : isDark
                      ? "bg-[#141720] border-[#252830] text-neutral-300 hover:border-[#c8a96e]/60 hover:bg-[#1a1e28]"
                      : "bg-white border-[#dce2ec] text-neutral-700 hover:border-[#c8a96e] hover:bg-[#fafbfe] shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-black/20 text-[#0c0e12]"
                          : isDark
                          ? "bg-[#0e1117] text-[#c8a96e] group-hover:bg-[#1e232f]"
                          : "bg-[#f4f6fa] text-[#8c6d32] group-hover:bg-[#ebf0f8]"
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    {/* Dynamic count badge */}
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        isActive
                          ? "bg-black/25 text-[#0c0e12] border-black/20"
                          : isDark
                          ? "bg-[#0e1117] text-neutral-300 border-[#252830] group-hover:text-white"
                          : "bg-[#f4f6fa] text-neutral-700 border-[#dce2ec] group-hover:text-neutral-900"
                      }`}
                    >
                      {chip.count}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`font-semibold text-xs sm:text-sm tracking-tight ${
                        isActive
                          ? "text-[#0c0e12] font-bold"
                          : isDark
                          ? "text-white"
                          : "text-neutral-900"
                      }`}
                    >
                      {chip.label}
                    </h3>
                    <p
                      className={`text-[10px] sm:text-[11px] truncate mt-0.5 ${
                        isActive
                          ? "text-[#0c0e12]/80 font-medium"
                          : isDark
                          ? "text-neutral-400"
                          : "text-neutral-500"
                      }`}
                    >
                      {chip.subtitle}
                    </p>
                  </div>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Disciplines Drawer & Quick Toggles */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center flex-wrap gap-1.5">
              <button
                onClick={() => setOtherCategoriesOpen(!otherCategoriesOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  otherCategoriesOpen ||
                  secondaryCategories.some((c) => c.id === selectedCategory)
                    ? isDark
                      ? "bg-[#1f2430] border-[#c8a96e] text-[#c8a96e]"
                      : "bg-[#fef8ee] border-[#c8a96e] text-[#8c6d32] font-semibold"
                    : isDark
                    ? "bg-[#141720] border-[#252830] text-neutral-400 hover:text-white"
                    : "bg-white border-[#dce2ec] text-neutral-600 hover:text-neutral-900 shadow-sm"
                }`}
              >
                <span>Other Disciplines ({secondaryCategories.length})</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    otherCategoriesOpen ? "rotate-180 text-[#c8a96e]" : ""
                  }`}
                />
              </button>

              {(selectedCategory !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 cursor-pointer transition-colors ${
                    isDark
                      ? "text-neutral-400 hover:text-white hover:bg-[#1a1e28] border-[#252830]"
                      : "text-neutral-700 hover:text-black hover:bg-[#f3f4f8] border-[#d8dde6] shadow-sm"
                  }`}
                  title="Clear all filters and search"
                >
                  <X className="w-3.5 h-3.5 text-[#c8a96e]" />
                  <span>Clear Filter</span>
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className={`text-[11px] hidden sm:inline ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                View Mode:
              </span>
              <div
                className={`flex items-center gap-1 p-1 rounded-lg border ${
                  isDark ? "bg-[#141720] border-[#252830]" : "bg-[#f4f6fa] border-[#dce2ec]"
                }`}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#c8a96e] text-[#0c0e12]"
                      : isDark
                      ? "text-neutral-400 hover:text-white"
                      : "text-neutral-600 hover:text-black"
                  }`}
                  title="Grid Gallery"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#c8a96e] text-[#0c0e12]"
                      : isDark
                      ? "text-neutral-400 hover:text-white"
                      : "text-neutral-600 hover:text-black"
                  }`}
                  title="Technical Sheet List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Secondary Categories Row */}
          {otherCategoriesOpen && (
            <div
              className={`p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-200 ${
                isDark ? "bg-[#11141c] border-[#252830]" : "bg-white border-[#e2e6ef] shadow-md"
              }`}
            >
              <div
                className={`text-[11px] font-medium mb-2 uppercase tracking-wider ${
                  isDark ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                Select Architectural Specialty:
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {secondaryCategories.map((cat) => {
                  const isCatActive = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setOtherCategoriesOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 cursor-pointer transition-colors ${
                        isCatActive
                          ? "bg-[#c8a96e] text-[#0c0e12] border-[#c8a96e] font-semibold"
                          : isDark
                          ? "bg-[#161a24] text-neutral-300 border-[#272b38] hover:border-[#c8a96e]/50 hover:text-white"
                          : "bg-[#f4f6fa] text-neutral-700 border-[#dce2ec] hover:border-[#c8a96e] hover:text-black shadow-sm"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isCatActive
                            ? "bg-black/25 text-[#0c0e12]"
                            : isDark
                            ? "bg-[#0c0e12] text-neutral-400"
                            : "bg-[#e5e9f0] text-neutral-700"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── CONTEXTUAL DISCIPLINE SPOTLIGHT BANNER ── */}
        {activeSpotlight && (
          <div
            className={`p-4 sm:p-5 rounded-xl border bg-gradient-to-r transition-all duration-300 ${
              isDark ? activeSpotlight.accentColor : activeSpotlight.lightAccentColor
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isDark
                        ? activeSpotlight.badgeBg
                        : "bg-white/80 text-neutral-900 border-neutral-300 shadow-sm"
                    }`}
                  >
                    Spotlight Discipline
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    {categoryCounts[selectedCategory]} Executed Works
                  </span>
                </div>
                <h2
                  className={`font-serif text-lg sm:text-xl font-bold ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {activeSpotlight.title}
                </h2>
                <p
                  className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  {activeSpotlight.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeSpotlight.highlights.map((h, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] ${
                        isDark
                          ? "bg-black/40 border border-white/10 text-neutral-300"
                          : "bg-white/90 border border-black/10 text-neutral-800 shadow-sm"
                      }`}
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("enquiry")}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Request {activeSpotlight.enquiryPreset.split("/")[0].trim()} Quote</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECT ITEMS GRID / LIST ─────────────── */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`group relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1 flex flex-col justify-between ${
                  isDark
                    ? "border-[#252830] bg-[#12151c] hover:border-[#c8a96e]/70"
                    : "border-[#e2e6ef] bg-white hover:border-[#c8a96e] shadow-md"
                }`}
              >
                {/* Visual Thumbnail */}
                <div
                  className={`aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden relative ${
                    isDark ? "bg-[#0a0c10]" : "bg-neutral-100"
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.alt || project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const filename = project.image.split("/").pop();
                      if (filename && !target.src.endsWith(`/images/${filename}`)) {
                        target.src = `/images/${filename}`;
                      } else {
                        target.src = "/images/hugo-sousa-BghGseQbAkA-unsplash.jpg";
                      }
                    }}
                  />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider rounded border shadow-sm ${getCategoryBadgeClass(
                          project.category
                        )}`}
                      >
                        {project.tag}
                      </span>
                      {project.scale && (
                        <span className="hidden sm:inline-block px-2 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono rounded border border-white/10 shadow-sm">
                          {project.scale}
                        </span>
                      )}
                      {project.gallery && project.gallery.length > 0 && (
                        <span className="px-2 py-0.5 bg-[#c8a96e] text-[#0c0e12] text-[10px] font-mono font-bold rounded shadow-sm flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" />
                          {project.gallery.length + 1} Views
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-md border border-white/10 shadow-sm shrink-0">
                      Plate {idx + 1}
                    </span>
                  </div>

                  {/* Desktop Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex flex-col items-center justify-center gap-2 p-4">
                    <span className="w-full max-w-[200px] px-3.5 py-2 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow-xl transition-all">
                      <Eye className="w-3.5 h-3.5" /> Inspect Drawing
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadBlueprint(e, project)}
                      disabled={downloadingProjectId === project.id}
                      className="w-full max-w-[200px] px-3.5 py-2 bg-[#12151c]/90 hover:bg-[#1a1f2c] text-[#c8a96e] hover:text-white border border-[#c8a96e]/50 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow-xl transition-all cursor-pointer backdrop-blur-md active:scale-95 disabled:opacity-50"
                    >
                      {downloadingProjectId === project.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Download Blueprint</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#c8a96e] font-semibold uppercase tracking-wider sm:hidden">
                        {project.tag}
                      </span>
                      <span className="text-neutral-500 font-mono text-[10px] ml-auto">
                        {project.id.toUpperCase()}
                      </span>
                    </div>

                    <h3
                      className={`font-serif text-sm sm:text-base font-bold group-hover:text-[#c8a96e] transition-colors leading-snug ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {project.title}
                    </h3>

                    {(project.location || project.scale) && (
                      <div
                        className={`flex items-center flex-wrap gap-2 text-[11px] font-mono pt-0.5 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {project.location && (
                          <span
                            className={`flex items-center gap-1 ${
                              isDark ? "text-neutral-300" : "text-neutral-800"
                            }`}
                          >
                            <MapPin className="w-3 h-3 text-[#c8a96e] shrink-0" />
                            <span className="truncate max-w-[160px]">{project.location}</span>
                          </span>
                        )}
                        {project.scale && (
                          <span
                            className={`flex items-center gap-1 ${
                              isDark ? "text-neutral-400" : "text-neutral-600"
                            }`}
                          >
                            <Maximize2 className="w-3 h-3 text-[#c8a96e] shrink-0" />
                            <span>{project.scale}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {project.scope && (
                      <p
                        className={`text-[11px] line-clamp-1 italic font-sans pt-0.5 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {project.scope}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom CTA Actions (Inspect + Download Blueprint) */}
                  <div
                    className={`pt-2.5 border-t flex items-center justify-between gap-1.5 text-xs font-medium ${
                      isDark ? "border-[#1e232d]" : "border-[#e5e9f0]"
                    }`}
                  >
                    <span className="flex items-center gap-1 text-[11px] text-[#c8a96e]">
                      <FileText className="w-3.5 h-3.5" /> View Plate
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleDownloadBlueprint(e, project)}
                      disabled={downloadingProjectId === project.id}
                      title="Download sample architectural blueprint PDF"
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border active:scale-95 disabled:opacity-50 ${
                        isDark
                          ? "bg-[#181c26] hover:bg-[#c8a96e] text-[#c8a96e] hover:text-[#0c0e12] border-[#c8a96e]/30 hover:border-[#c8a96e]"
                          : "bg-[#f4f6fa] hover:bg-[#c8a96e] text-[#8c6d32] hover:text-[#0c0e12] border-[#d8dde6] hover:border-[#c8a96e] shadow-sm"
                      }`}
                    >
                      {downloadingProjectId === project.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3" />
                          <span>Download Blueprint</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Technical List / Sheet Mode */
          <div className="pt-2 space-y-3">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm group ${
                  isDark
                    ? "border-[#252830] bg-[#12151c] hover:border-[#c8a96e]/70"
                    : "border-[#e2e6ee] bg-white hover:border-[#c8a96e] shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-[#252830]">
                    <img
                      src={project.image}
                      alt={project.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const filename = project.image.split("/").pop();
                        if (filename && !target.src.endsWith(`/images/${filename}`)) {
                          target.src = `/images/${filename}`;
                        } else {
                          target.src = "/images/hugo-sousa-BghGseQbAkA-unsplash.jpg";
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#c8a96e] uppercase tracking-wider">
                        Plate {idx + 1}
                      </span>
                      <span className="text-neutral-500">·</span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${getCategoryBadgeClass(
                          project.category
                        )}`}
                      >
                        {project.tag}
                      </span>
                      {project.scale && (
                        <span
                          className={`hidden sm:inline text-[10px] font-mono ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          ({project.scale})
                        </span>
                      )}
                      {project.gallery && project.gallery.length > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/40 font-semibold flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" />
                          {project.gallery.length + 1} Plates
                        </span>
                      )}
                    </div>
                    <h4
                      className={`font-serif text-sm sm:text-base font-bold group-hover:text-[#c8a96e] transition-colors line-clamp-2 mt-0.5 ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {project.title}
                    </h4>
                    {project.location && (
                      <p
                        className={`text-[11px] font-mono mt-0.5 truncate flex items-center gap-1 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        <MapPin className="w-3 h-3 text-[#c8a96e]" />
                        {project.location}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between w-full sm:w-auto gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 ${
                    isDark ? "border-[#1e232d]" : "border-[#e5e9f0]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => handleDownloadBlueprint(e, project)}
                    disabled={downloadingProjectId === project.id}
                    title="Download sample blueprint PDF"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border active:scale-95 disabled:opacity-50 ${
                      isDark
                        ? "bg-[#181c26] hover:bg-[#c8a96e] text-[#c8a96e] hover:text-[#0c0e12] border-[#c8a96e]/30 hover:border-[#c8a96e]"
                        : "bg-[#f4f6fa] hover:bg-[#c8a96e] text-[#8c6d32] hover:text-[#0c0e12] border-[#d8dde6] hover:border-[#c8a96e] shadow-sm"
                    }`}
                  >
                    {downloadingProjectId === project.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Sample Blueprint</span>
                      </>
                    )}
                  </button>

                  <span
                    className={`p-1.5 sm:p-2 rounded-lg group-hover:bg-[#c8a96e] group-hover:text-[#0c0e12] transition-colors ${
                      isDark ? "bg-[#181c24] text-neutral-300" : "bg-[#f4f6fa] text-neutral-700"
                    }`}
                    title="Inspect plate sheet"
                  >
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div
            className={`text-center py-16 space-y-3 rounded-2xl border p-6 mt-6 ${
              isDark ? "bg-[#12151c] border-[#252830]" : "bg-white border-[#e2e6ef] shadow-sm"
            }`}
          >
            <SlidersHorizontal className="w-8 h-8 text-[#c8a96e] mx-auto opacity-70" />
            <h3
              className={`font-serif text-base sm:text-lg font-bold ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              No architectural plates found
            </h3>
            <p
              className={`text-xs sm:text-sm max-w-md mx-auto ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              No projects found matching{" "}
              {searchQuery ? `"${searchQuery}"` : "the selected discipline"}.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-2 ${
                  isDark
                    ? "bg-[#1c202c] hover:bg-[#252a38] text-[#c8a96e] border-[#2f3545]"
                    : "bg-[#f4f6fa] hover:bg-[#e6ebf5] text-[#8c6d32] border-[#d8dde6]"
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters &amp; View All Works</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div
          className={`rounded-2xl border p-6 sm:p-12 text-center space-y-4 shadow-xl relative overflow-hidden ${
            isDark ? "border-[#252830] bg-[#141720]" : "border-[#e2e6ee] bg-white shadow-lg"
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8a96e]/5 rounded-full blur-3xl pointer-events-none" />
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            Collaboration &amp; Turnkey
          </span>
          <h2
            className={`font-serif text-2xl sm:text-4xl font-bold ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Have a project in mind?
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            Discuss your upcoming residential villa, commercial complex, or landscape master plan with Principal Architect Abhishek Mohalkar.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab("enquiry")}
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0c0e12] bg-[#c8a96e] hover:bg-[#dfc085] rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95 shadow-lg"
            >
              <span>Submit Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Floating Download Toast / Status Feedback */}
      {(downloadStatus || toastMessage) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
              isDark
                ? "bg-[#141822]/95 border-[#c8a96e]/40 text-white"
                : "bg-white/95 border-[#c8a96e]/60 text-neutral-900 shadow-xl"
            }`}
          >
            {downloadStatus ? (
              <>
                <Loader2 className="w-5 h-5 text-[#c8a96e] animate-spin shrink-0" />
                <div className="text-xs font-medium">
                  <p className="font-semibold text-[#c8a96e]">Generating Blueprint PDF</p>
                  <p className={isDark ? "text-neutral-300" : "text-neutral-600"}>{downloadStatus}</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-xs font-medium">
                  <p className="font-semibold text-emerald-500">Download Complete</p>
                  <p className={isDark ? "text-neutral-300" : "text-neutral-700"}>{toastMessage}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
