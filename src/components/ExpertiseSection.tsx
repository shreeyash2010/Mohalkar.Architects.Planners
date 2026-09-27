import React from "react";
import {
  Home,
  Briefcase,
  Layers,
  Map,
  Trees,
  ClipboardCheck,
  CheckCircle2,
  Calculator,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { EXPERTISE_DOMAINS, WORKFLOW_STEPS, ExpertiseItem } from "../data/siteData";
import { useTheme } from "../context/ThemeContext";

interface ExpertiseSectionProps {
  setActiveTab: (tab: string) => void;
  onOpenEstimator: () => void;
}

export const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({
  setActiveTab,
  onOpenEstimator,
}) => {
  const { isDark } = useTheme();

  const getIcon = (name: string) => {
    switch (name) {
      case "Home":
        return <Home className="w-5 h-5 text-[#c8a96e]" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-[#c8a96e]" />;
      case "Layers":
        return <Layers className="w-5 h-5 text-[#c8a96e]" />;
      case "Map":
        return <Map className="w-5 h-5 text-[#c8a96e]" />;
      case "Trees":
        return <Trees className="w-5 h-5 text-[#c8a96e]" />;
      case "ClipboardCheck":
      default:
        return <ClipboardCheck className="w-5 h-5 text-[#c8a96e]" />;
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ── HERO ───────────────────────────────────── */}
      <section
        className={`relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b bg-blueprint-grid ${
          isDark ? "border-[#1e2229]" : "border-[#e5e9f0]"
        }`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-4">
            <button onClick={() => setActiveTab("home")} className="hover:underline cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className={isDark ? "text-neutral-400" : "text-neutral-500"}>
              Our Expertise
            </span>
          </div>

          <h1
            className={`font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Expertise Across Scales
          </h1>
          <p
            className={`mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            From intimate residential sanctuaries to large-scale civic urban developments. Precision engineering meets architectural distinction.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onOpenEstimator}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#0c0e12] bg-[#c8a96e] hover:bg-[#dfc085] rounded-md transition-colors cursor-pointer shadow-lg active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Project Timeline &amp; Scope</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 6 CORE DOMAINS ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            Our Domains
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold mt-1 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Specialized Architectural Disciplines
          </h2>
          <p
            className={`text-xs sm:text-sm mt-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Each discipline is led with comprehensive structural knowledge, municipal regulatory acumen, and aesthetic refinement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERTISE_DOMAINS.map((domain: ExpertiseItem) => (
            <div
              key={domain.id}
              className={`rounded-xl border transition-all shadow-lg flex flex-col justify-between overflow-hidden group ${
                isDark
                  ? "border-[#252830] bg-[#12151c] hover:border-[#c8a96e]/60"
                  : "border-[#e2e6ee] bg-white hover:border-[#c8a96e] shadow-md"
              }`}
            >
              {domain.image && (
                <div
                  className={`relative h-44 w-full overflow-hidden ${
                    isDark ? "bg-[#0a0c10]" : "bg-neutral-100"
                  }`}
                >
                  <img
                    src={domain.image}
                    alt={domain.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/project6.jpeg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div
                    className={`absolute top-3 left-3 w-10 h-10 rounded-lg backdrop-blur-md border flex items-center justify-center ${
                      isDark
                        ? "bg-[#161a22]/85 border-[#252830]"
                        : "bg-white/90 border-[#d8dde6] shadow-sm"
                    }`}
                  >
                    {getIcon(domain.iconName)}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3
                    className={`font-serif text-2xl font-bold group-hover:text-[#c8a96e] transition-colors ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {domain.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    {domain.description}
                  </p>

                  <div
                    className={`pt-3 border-t space-y-2 ${
                      isDark ? "border-[#1e232d]" : "border-[#e5e9f0]"
                    }`}
                  >
                    <p
                      className={`text-[11px] uppercase tracking-wider font-semibold ${
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      Core Capabilities:
                    </p>
                    {domain.scopePoints.map((point, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 text-xs ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c8a96e] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`pt-4 border-t ${
                    isDark ? "border-[#1e232d]" : "border-[#e5e9f0]"
                  }`}
                >
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-xs font-semibold uppercase tracking-wider text-[#c8a96e] hover:text-[#dfc085] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Related Projects</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE 5-STEP APPROACH (HOW WE WORK) ─────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            Our Approach
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold mt-1 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            How We Work
          </h2>
          <p
            className={`text-xs sm:text-sm mt-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            A disciplined, milestone-governed workflow from first sketch to final occupancy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.num}
              className={`relative p-6 rounded-xl border flex flex-col justify-between space-y-4 transition-colors ${
                isDark
                  ? "border-[#252830] bg-[#12151c] hover:border-[#c8a96e]/40"
                  : "border-[#e2e6ee] bg-white hover:border-[#c8a96e] shadow-sm"
              }`}
            >
              <div>
                <span className="font-mono text-2xl font-bold text-[#c8a96e] block mb-3">
                  {step.num}
                </span>
                <h3
                  className={`font-serif text-xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  {step.text}
                </p>
              </div>
              <div
                className={`w-full h-1 rounded-full overflow-hidden ${
                  isDark ? "bg-[#1e232d]" : "bg-[#e5e9f0]"
                }`}
              >
                <div
                  className="h-full bg-[#c8a96e]"
                  style={{ width: `${Number(step.num) * 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-2xl border p-8 sm:p-12 text-center space-y-4 shadow-xl ${
            isDark
              ? "border-[#252830] bg-[#141720]"
              : "border-[#e2e6ee] bg-white shadow-lg"
          }`}
        >
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            Ready to Begin?
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Have a project in mind?
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-xl mx-auto ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            Tell us about your site dimensions, location, and vision — we would love to design your story.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab("enquiry")}
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0c0e12] bg-[#c8a96e] hover:bg-[#dfc085] rounded-md transition-colors cursor-pointer inline-flex items-center gap-2 active:scale-95 shadow-md"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
