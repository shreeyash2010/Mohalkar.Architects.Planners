import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Globe,
  Share2,
  Code,
  Copy,
  Sparkles,
} from "lucide-react";
import {
  getActiveMeta,
  BASE_STUDIO_NAME,
  TabMetaData,
  applyMetaTags,
} from "../utils/metaManager";
import { useTheme } from "../context/ThemeContext";

export function SeoInspector() {
  const { isDark } = useTheme();
  const [selectedPreviewTab, setSelectedPreviewTab] = useState<string>("projects");
  const [previewMode, setPreviewMode] = useState<"google" | "social" | "jsonld">("google");
  const [liveDocTitle, setLiveDocTitle] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Read actual live DOM head elements
  useEffect(() => {
    const updateFromDOM = () => {
      setLiveDocTitle(document.title);
    };

    updateFromDOM();
    window.addEventListener("mohalkar:meta-updated", updateFromDOM);
    return () => window.removeEventListener("mohalkar:meta-updated", updateFromDOM);
  }, []);

  const previewMeta: TabMetaData & { canonicalUrl: string } = getActiveMeta({
    activeTab: selectedPreviewTab,
  });

  const titleLength = previewMeta.title.length;
  const isTitleOptimal = titleLength >= 30 && titleLength <= 65;

  const descLength = previewMeta.description.length;
  const isDescOptimal = descLength >= 120 && descLength <= 165;

  const handleCopySchema = () => {
    const scriptEl = document.getElementById("mohalkar-seo-schema");
    if (scriptEl && scriptEl.textContent) {
      navigator.clipboard.writeText(scriptEl.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const tabsList = [
    { id: "projects", label: "Projects Tab", path: "/#projects" },
    { id: "home", label: "Home Tab", path: "/#home" },
    { id: "about", label: "About Tab", path: "/#about" },
    { id: "expertise", label: "Expertise Tab", path: "/#expertise" },
    { id: "services", label: "Services Tab", path: "/#services" },
    { id: "enquiry", label: "Enquiry Tab", path: "/#enquiry" },
    { id: "admin", label: "Admin Console", path: "/#admin" },
  ];

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl border transition-colors ${
        isDark
          ? "bg-[#12151f] border-[#232734] text-[#e2e4e8]"
          : "bg-white border-[#e2e6ef] text-neutral-900 shadow-sm"
      }`}
    >
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
          isDark ? "border-[#1f2330]" : "border-[#e5e9f0]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-[#c8a96e] border ${
              isDark
                ? "bg-[#c8a96e]/10 border-[#c8a96e]/30"
                : "bg-[#c8a96e]/15 border-[#c8a96e]/40"
            }`}
          >
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`font-serif text-base sm:text-lg font-bold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Dynamic SEO &amp; Search Engine Visibility Inspector
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Active
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Real-time meta tag manager automatically updates document title, description, OpenGraph, Twitter cards &amp; Schema.org per tab.
            </p>
          </div>
        </div>

        {/* Tab Preview Mode Switcher */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border overflow-x-auto scrollbar-none w-full sm:w-auto ${
            isDark ? "bg-[#090b10] border-[#212532]" : "bg-[#f4f6fa] border-[#dce2ec]"
          }`}
        >
          <button
            onClick={() => setPreviewMode("google")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial ${
              previewMode === "google"
                ? isDark
                  ? "bg-[#1f2433] text-white shadow-sm"
                  : "bg-white text-neutral-900 shadow-sm border border-[#d5dbe6]"
                : isDark
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
            <span>Google SERP</span>
          </button>
          <button
            onClick={() => setPreviewMode("social")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial ${
              previewMode === "social"
                ? isDark
                  ? "bg-[#1f2433] text-white shadow-sm"
                  : "bg-white text-neutral-900 shadow-sm border border-[#d5dbe6]"
                : isDark
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
            <span>Social Card</span>
          </button>
          <button
            onClick={() => setPreviewMode("jsonld")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial ${
              previewMode === "jsonld"
                ? isDark
                  ? "bg-[#1f2433] text-white shadow-sm"
                  : "bg-white text-neutral-900 shadow-sm border border-[#d5dbe6]"
                : isDark
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Code className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>JSON-LD</span>
          </button>
        </div>
      </div>

      {/* Live Tab Selector Filter */}
      <div className="space-y-2">
        <label
          className={`text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          <span>Select Tab to Inspect Search Visibility</span>
          <span className="text-neutral-500 font-normal">Active document title updates dynamically in browser tab</span>
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabsList.map((tab) => {
            const isSelected = selectedPreviewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedPreviewTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? isDark
                      ? "bg-[#c8a96e]/15 border-[#c8a96e] text-[#c8a96e] font-semibold shadow-sm"
                      : "bg-[#c8a96e]/20 border-[#c8a96e] text-[#8c6d32] font-bold shadow-sm"
                    : isDark
                    ? "bg-[#0c0e14] border-[#202430] text-neutral-400 hover:text-neutral-200 hover:border-[#2f3545]"
                    : "bg-[#f8f9fb] border-[#e2e6ef] text-neutral-600 hover:text-neutral-900 hover:border-[#cbd2df]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {tab.path}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Health Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className={`border p-3.5 rounded-xl space-y-1 ${
            isDark ? "bg-[#0b0d13] border-[#202432]" : "bg-[#f8f9fc] border-[#e2e6ee]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Document &lt;title&gt;
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                isTitleOptimal
                  ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/15 text-amber-600 border border-amber-500/20"
              }`}
            >
              {titleLength} chars {isTitleOptimal ? "(Optimal)" : "(Length OK)"}
            </span>
          </div>
          <p
            className={`text-xs font-medium truncate ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
            title={previewMeta.title}
          >
            {previewMeta.title}
          </p>
          <span className="text-[10px] text-neutral-500 block">
            Google optimal length: 30–60 characters
          </span>
        </div>

        <div
          className={`border p-3.5 rounded-xl space-y-1 ${
            isDark ? "bg-[#0b0d13] border-[#202432]" : "bg-[#f8f9fc] border-[#e2e6ee]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Meta Description
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                isDescOptimal
                  ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/15 text-amber-600 border border-amber-500/20"
              }`}
            >
              {descLength} chars {isDescOptimal ? "(Optimal)" : "(Length OK)"}
            </span>
          </div>
          <p
            className={`text-xs line-clamp-1 ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
            title={previewMeta.description}
          >
            {previewMeta.description}
          </p>
          <span className="text-[10px] text-neutral-500 block">
            Google optimal length: 120–160 characters
          </span>
        </div>

        <div
          className={`border p-3.5 rounded-xl space-y-1 ${
            isDark ? "bg-[#0b0d13] border-[#202432]" : "bg-[#f8f9fc] border-[#e2e6ee]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Canonical &amp; Schema
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-blue-500/15 text-blue-500 border border-blue-500/20">
              Active Sync
            </span>
          </div>
          <p
            className={`text-xs font-mono truncate ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
            title={previewMeta.canonicalUrl}
          >
            {previewMeta.canonicalPath}
          </p>
          <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3" /> ArchitecturalFirm + WebPage JSON-LD
          </span>
        </div>
      </div>

      {/* ── PREVIEW 1: GOOGLE SERP SIMULATOR ── */}
      {previewMode === "google" && (
        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-3 font-sans shadow-md ${
            isDark
              ? "bg-[#202124] text-[#e8eaed] border-[#303134]"
              : "bg-[#ffffff] text-[#202124] border-[#dfe1e5]"
          }`}
        >
          <div
            className={`flex items-center justify-between pb-2.5 text-xs border-b ${
              isDark ? "border-[#3c4043] text-neutral-400" : "border-[#ebebeb] text-neutral-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>
                Google Search Results Snippet Simulator
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Desktop &amp; Mobile SERP</span>
          </div>

          <div className="space-y-1 max-w-2xl pt-1">
            {/* Breadcrumb line */}
            <div
              className={`flex items-center gap-2 text-xs ${
                isDark ? "text-[#bdc1c6]" : "text-[#4d5156]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center overflow-hidden border ${
                  isDark ? "bg-[#303134] border-[#5f6368]" : "bg-[#f1f3f4] border-[#dadce0]"
                }`}
              >
                <img src="/images/logo2.png" alt="Logo" className="w-3.5 h-3.5 object-contain" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[13px] font-medium leading-none ${
                    isDark ? "text-[#dadce0]" : "text-[#202124]"
                  }`}
                >
                  {BASE_STUDIO_NAME}
                </span>
                <span
                  className={`text-[11px] font-mono leading-tight ${
                    isDark ? "text-[#bdc1c6]" : "text-[#4d5156]"
                  }`}
                >
                  https://mohalkararchitects.in &rsaquo; {selectedPreviewTab}
                </span>
              </div>
            </div>

            {/* Clickable Blue Title Link */}
            <h4
              className={`text-lg sm:text-xl font-normal hover:underline cursor-pointer leading-snug pt-1 ${
                isDark ? "text-[#8ab4f8]" : "text-[#1a0dab]"
              }`}
            >
              {previewMeta.title}
            </h4>

            {/* Snippet Description */}
            <p
              className={`text-[13px] leading-relaxed pt-0.5 ${
                isDark ? "text-[#bdc1c6]" : "text-[#4d5156]"
              }`}
            >
              <span className={isDark ? "text-[#9aa0a6] mr-1" : "text-[#70757a] mr-1"}>
                {new Date().toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                —
              </span>
              {previewMeta.description}
            </p>

            {/* Sitelinks Strip */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 text-xs border-t ${
                isDark ? "border-[#303134]/80" : "border-[#ebebeb]"
              }`}
            >
              <div
                className={`p-2 rounded transition-colors ${
                  isDark
                    ? "bg-[#303134]/40 hover:bg-[#303134]"
                    : "bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#e8eaed]"
                }`}
              >
                <span
                  className={`font-medium hover:underline block truncate ${
                    isDark ? "text-[#8ab4f8]" : "text-[#1a0dab]"
                  }`}
                >
                  Architecture Portfolio
                </span>
                <span className="text-[10px] text-neutral-500 line-clamp-1">
                  88+ Working Blueprints
                </span>
              </div>
              <div
                className={`p-2 rounded transition-colors ${
                  isDark
                    ? "bg-[#303134]/40 hover:bg-[#303134]"
                    : "bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#e8eaed]"
                }`}
              >
                <span
                  className={`font-medium hover:underline block truncate ${
                    isDark ? "text-[#8ab4f8]" : "text-[#1a0dab]"
                  }`}
                >
                  Cost Estimator
                </span>
                <span className="text-[10px] text-neutral-500 line-clamp-1">
                  Instant Budget Calculator
                </span>
              </div>
              <div
                className={`p-2 rounded transition-colors ${
                  isDark
                    ? "bg-[#303134]/40 hover:bg-[#303134]"
                    : "bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#e8eaed]"
                }`}
              >
                <span
                  className={`font-medium hover:underline block truncate ${
                    isDark ? "text-[#8ab4f8]" : "text-[#1a0dab]"
                  }`}
                >
                  Principal Architect
                </span>
                <span className="text-[10px] text-neutral-500 line-clamp-1">
                  Abhishek Mohalkar Profile
                </span>
              </div>
              <div
                className={`p-2 rounded transition-colors ${
                  isDark
                    ? "bg-[#303134]/40 hover:bg-[#303134]"
                    : "bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#e8eaed]"
                }`}
              >
                <span
                  className={`font-medium hover:underline block truncate ${
                    isDark ? "text-[#8ab4f8]" : "text-[#1a0dab]"
                  }`}
                >
                  Studio Consultation
                </span>
                <span className="text-[10px] text-neutral-500 line-clamp-1">
                  Pune &amp; Dharashiv Office
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PREVIEW 2: SOCIAL SHARE CARD (OPENGRAPH & TWITTER) ── */}
      {previewMode === "social" && (
        <div
          className={`border rounded-xl p-5 space-y-4 ${
            isDark ? "bg-[#0e1119] border-[#272b38]" : "bg-[#f8f9fc] border-[#e2e6ef]"
          }`}
        >
          <div
            className={`flex items-center justify-between pb-2 text-xs border-b ${
              isDark ? "border-[#212532] text-neutral-300" : "border-[#e5e9f0] text-neutral-700"
            }`}
          >
            <span className="font-medium flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#c8a96e]" />
              OpenGraph (og:image &amp; og:title) / Twitter Card Simulation
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              summary_large_image
            </span>
          </div>

          <div
            className={`max-w-md mx-auto rounded-xl overflow-hidden border shadow-2xl ${
              isDark ? "border-[#2c3140] bg-[#141824]" : "border-[#d8dde6] bg-white"
            }`}
          >
            <div className="h-48 w-full bg-[#1e2330] overflow-hidden relative group">
              <img
                src={previewMeta.ogImage || "/images/hero1.jpg"}
                alt="Social Card Banner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/hero1.jpg";
                }}
              />
              <div className="absolute top-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-[#c8a96e] border border-[#c8a96e]/30">
                og:image
              </div>
            </div>

            <div className="p-4 space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                MOHALKARARCHITECTS.IN
              </span>
              <h4
                className={`text-sm font-bold leading-tight ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {previewMeta.title}
              </h4>
              <p
                className={`text-xs leading-relaxed line-clamp-2 ${
                  isDark ? "text-neutral-300" : "text-neutral-600"
                }`}
              >
                {previewMeta.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── PREVIEW 3: SCHEMA.ORG JSON-LD ── */}
      {previewMode === "jsonld" && (
        <div
          className={`border rounded-xl p-4 sm:p-5 space-y-3 ${
            isDark ? "bg-[#090b10] border-[#202430]" : "bg-[#f8f9fc] border-[#e2e6ef]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 text-xs font-mono ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              <Code className="w-4 h-4 text-purple-500" />
              <span>&lt;script type=&quot;application/ld+json&quot; id=&quot;mohalkar-seo-schema&quot;&gt;</span>
            </div>
            <button
              onClick={handleCopySchema}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
                isDark
                  ? "bg-[#181d28] hover:bg-[#222838] text-neutral-200 border-[#2b3140]"
                  : "bg-white hover:bg-[#f1f3f6] text-neutral-800 border-[#d0d7e2] shadow-sm"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON-LD</span>
                </>
              )}
            </button>
          </div>

          <pre
            className={`text-[11px] font-mono p-4 rounded-xl overflow-x-auto max-h-72 border leading-relaxed ${
              isDark
                ? "text-purple-200 bg-[#0e1118] border-[#1e2330]"
                : "text-purple-900 bg-white border-[#e0e4ec]"
            }`}
          >
            {JSON.stringify(
              {
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "ArchitecturalFirm",
                    "@id": "https://mohalkararchitects.in/#firm",
                    name: BASE_STUDIO_NAME,
                    description: previewMeta.description,
                    url: "https://mohalkararchitects.in",
                    founder: {
                      "@type": "Person",
                      name: "Abhishek Mohalkar",
                      jobTitle: "Founder & Principal Architect",
                    },
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: "Pune",
                      addressRegion: "Maharashtra",
                      addressCountry: "IN",
                    },
                    priceRange: "₹₹₹₹",
                    openingHours: "Mo-Sa 09:30-19:30",
                  },
                  {
                    "@type": "WebPage",
                    "@id": previewMeta.canonicalUrl,
                    url: previewMeta.canonicalUrl,
                    name: previewMeta.title,
                    description: previewMeta.description,
                  },
                ],
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* Currently Active Live Head Status */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isDark ? "bg-[#0b0e14] border-[#1d222e]" : "bg-[#f4f6fa] border-[#e2e6ee]"
        }`}
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
              Current Browser Head State:
            </span>
            <span className="font-mono text-[#c8a96e] truncate max-w-sm">
              {liveDocTitle || previewMeta.title}
            </span>
          </div>
          <p className={`text-[11px] ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Whenever the user switches tabs or views an architectural project modal, all document meta tags update instantaneously.
          </p>
        </div>

        <button
          onClick={() => {
            applyMetaTags({ activeTab: selectedPreviewTab });
            setLiveDocTitle(document.title);
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto ${
            isDark
              ? "bg-[#1a1f2b] hover:bg-[#252b3b] text-neutral-200 border-[#2c3242]"
              : "bg-white hover:bg-[#eaeef5] text-neutral-800 border-[#d2d9e4] shadow-sm"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c8a96e]" />
          <span>Apply to Live Head Now</span>
        </button>
      </div>
    </div>
  );
}
