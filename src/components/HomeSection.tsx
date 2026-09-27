import React from "react";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { SITE_INFO, LEADERSHIP_PROFILES, CORE_VALUES } from "../data/siteData";
import { useTheme } from "../context/ThemeContext";

interface HomeSectionProps {
  setActiveTab: (tab: string) => void;
  onSelectLeader: (id: string) => void;
  onOpenEstimator: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  setActiveTab,
  onSelectLeader,
  onOpenEstimator,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ── HERO SECTION ──────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-blueprint-grid">
        {/* Soft architectural glow */}
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none ${
            isDark ? "bg-[#c8a96e]/10" : "bg-[#c8a96e]/15"
          }`}
        />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md mb-6 ${
              isDark
                ? "border-[#c8a96e]/30 bg-[#161a22]/70"
                : "border-[#c8a96e]/50 bg-[#ffffff]/80 shadow-sm"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-[#c8a96e] font-semibold">
              {SITE_INFO.established} · Maharashtra &amp; Pan-India
            </span>
          </div>

          <h1
            className={`font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] max-w-4xl mx-auto text-balance ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            &ldquo;Every Space Has a Story <br className="hidden sm:inline" />
            <span className="text-[#c8a96e] italic font-normal">We Design Yours</span>&rdquo;
          </h1>

          <p
            className={`mt-6 text-sm sm:text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            {SITE_INFO.heroSub}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <button
              onClick={() => setActiveTab("projects")}
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0c0e12] bg-[#c8a96e] hover:bg-[#dfc085] rounded-md transition-all shadow-xl hover:shadow-[#c8a96e]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer text-center border ${
                isDark
                  ? "text-neutral-200 hover:text-white bg-[#161a22] hover:bg-[#1e232d] border-[#252830]"
                  : "text-neutral-800 hover:text-black bg-white hover:bg-[#f4f6fa] border-[#d8dde6] shadow-sm"
              }`}
            >
              About Us
            </button>

            <button
              onClick={onOpenEstimator}
              className={`w-full sm:w-auto px-5 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
                isDark
                  ? "text-[#c8a96e] hover:text-[#dfc085] bg-[#c8a96e]/10 hover:bg-[#c8a96e]/20 border-[#c8a96e]/30"
                  : "text-[#8c6d32] hover:text-black bg-[#c8a96e]/15 hover:bg-[#c8a96e]/25 border-[#c8a96e]/40 shadow-sm"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scope Calculator</span>
            </button>
          </div>

          {/* Key Quantitative Stats */}
          <div
            className={`mt-16 pt-10 border-t grid grid-cols-2 md:grid-cols-4 gap-6 ${
              isDark ? "border-[#1e232d]" : "border-[#e5e9f0]"
            }`}
          >
            {SITE_INFO.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <span
                  className={`font-serif text-3xl sm:text-4xl font-bold tabular-nums tracking-tight ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {stat.value}
                </span>
                <p
                  className={`text-[11px] uppercase tracking-wider font-medium mt-1 ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY OVERVIEW SECTION ──────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
                Company Overview
              </span>
              <h2
                className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Designing Spaces <br />
                <span
                  className={`italic font-normal ${
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  That Inspire
                </span>
              </h2>
            </div>

            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              <strong className={isDark ? "text-white font-semibold" : "text-neutral-900 font-semibold"}>
                Mohalkar Architects &amp; Planners
              </strong>{" "}
              is a leading design consultancy specialising in residential, commercial, and urban
              planning. With a passion for purposeful beauty, we deliver innovative, sustainable,
              and tailored solutions to private clients, developers, and local bodies across India.
            </p>

            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              From concept to completion, every project reflects our commitment to craftsmanship,
              context, and lasting value. We blend architectural rigor with pragmatic constructability.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab("projects")}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#0c0e12] bg-[#c8a96e] hover:bg-[#dfc085] rounded-md transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Explore Our Work</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab("about")}
                className="text-xs font-semibold uppercase tracking-wider text-[#c8a96e] hover:text-[#dfc085] underline underline-offset-4 cursor-pointer"
              >
                Read Our Story &rarr;
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className={`relative rounded-2xl overflow-hidden border shadow-2xl group ${
                isDark ? "border-[#252830] bg-[#161a22]" : "border-[#d8dde6] bg-white"
              }`}
            >
              <img
                src="/images/hugo-sousa-BghGseQbAkA-unsplash.jpg"
                alt="Mohalkar Architecture"
                className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/project6.jpeg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div
                className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md border flex items-center justify-between ${
                  isDark
                    ? "bg-[#0c0e12]/80 border-[#252830]"
                    : "bg-[#ffffff]/90 border-[#e2e6ee] text-neutral-900 shadow-lg"
                }`}
              >
                <div>
                  <span
                    className={`font-serif text-2xl font-bold ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    2+ Years
                  </span>
                  <p className="text-[11px] uppercase tracking-wider text-[#c8a96e] font-semibold">
                    Of Architectural Excellence
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-mono font-medium ${
                      isDark ? "text-neutral-300" : "text-neutral-800"
                    }`}
                  >
                    PUNE · BHOOM · DHARASHIV
                  </span>
                  <p
                    className={`text-[10px] ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    Headquartered in Maharashtra
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE PHILOSOPHY / VALUES ──────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            What Drives Us
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold mt-1 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Our Core Values
          </h2>
          <p
            className={`text-xs sm:text-sm mt-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Every drawing, volume, and material specification is rooted in foundational design ethics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((val, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl border transition-all space-y-3 ${
                isDark
                  ? "border-[#252830] bg-[#12151c] hover:border-[#c8a96e]/40"
                  : "border-[#e2e6ee] bg-white hover:border-[#c8a96e] shadow-sm"
              }`}
            >
              <span className="font-mono text-xs text-[#c8a96e] font-bold">0{idx + 1}.</span>
              <h3
                className={`font-serif text-xl font-bold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {val.title}
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEADERSHIP SECTION ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            Leadership
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold mt-1 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Meet Our Team
          </h2>
          <p
            className={`text-xs sm:text-sm mt-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Principals guiding architectural design, planning vision, and client partnership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {LEADERSHIP_PROFILES.map((leader) => (
            <div
              key={leader.id}
              onClick={() => onSelectLeader(leader.id)}
              className={`group p-6 rounded-xl border transition-all cursor-pointer shadow-lg space-y-4 ${
                isDark
                  ? "border-[#252830] bg-[#12151c] hover:border-[#c8a96e]"
                  : "border-[#e2e6ee] bg-white hover:border-[#c8a96e] shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border p-1 group-hover:border-[#c8a96e] transition-colors ${
                    isDark ? "border-[#252830] bg-[#161a22]" : "border-[#e2e6ee] bg-[#f8f9fb]"
                  }`}
                >
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/ceo.png";
                    }}
                  />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#c8a96e]/15 text-[#8c6d32] dark:text-[#c8a96e] rounded mb-1 border border-[#c8a96e]/30">
                    {leader.designation}
                  </span>
                  <h3
                    className={`font-serif text-xl font-bold group-hover:text-[#c8a96e] transition-colors ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {leader.name}
                  </h3>
                  <p
                    className={`text-xs ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    {leader.role.split("·")[1] || leader.role}
                  </p>
                </div>
              </div>

              <p
                className={`text-xs leading-relaxed ${
                  isDark ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                {leader.bio}
              </p>

              <div
                className={`pt-2 flex items-center justify-between border-t text-xs text-[#c8a96e] font-semibold uppercase tracking-wider ${
                  isDark ? "border-[#1e232d]" : "border-[#e5e9f0]"
                }`}
              >
                <span>View Full Credentials &amp; Bio</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STUDIO PARTNERS / COLLABORATION ─────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            Collaboration
          </span>
          <h2
            className={`font-serif text-2xl sm:text-3xl font-bold mt-1 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Our Studio Partners &amp; Associates
          </h2>
          <p
            className={`text-xs mt-1 max-w-lg mx-auto ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Strategic alliances with structural consultants, MEP specialists, and urban planning institutions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center max-w-4xl mx-auto">
          {SITE_INFO.partners.map((partner, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border flex items-center justify-center h-24 transition-colors ${
                isDark
                  ? "border-[#252830] bg-[#12151c]/60 hover:border-[#c8a96e]/40"
                  : "border-[#e2e6ee] bg-white hover:border-[#c8a96e] shadow-sm"
              }`}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-12 max-w-[120px] object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/associates1.png";
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-2xl border p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl ${
            isDark
              ? "border-[#c8a96e]/30 bg-gradient-to-r from-[#141720] via-[#1a1f2c] to-[#141720]"
              : "border-[#c8a96e]/50 bg-gradient-to-r from-[#fefbf6] via-[#f7f2ea] to-[#fefbf6] shadow-xl"
          }`}
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
              Get in Touch
            </span>
            <h2
              className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Let&rsquo;s Build Something <br />
              <span className="italic font-normal text-[#c8a96e]">Extraordinary</span>
            </h2>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              Whether you are planning a modern bungalow, commercial hub, or master township, our
              architects are ready to transform your vision into buildable perfection.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab("enquiry")}
                className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0c0e12] bg-[#c8a96e] hover:bg-[#dfc085] rounded-md transition-all shadow-lg cursor-pointer active:scale-95"
              >
                Send an Enquiry &rarr;
              </button>
              <a
                href={`tel:${SITE_INFO.contacts.phonePrimary}`}
                className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors border ${
                  isDark
                    ? "text-neutral-200 hover:text-white bg-[#161a22] border-[#252830]"
                    : "text-neutral-800 hover:text-black bg-white border-[#d8dde6] shadow-sm"
                }`}
              >
                Call: {SITE_INFO.contacts.phonePrimary}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
