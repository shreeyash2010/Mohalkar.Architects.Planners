import React from "react";
import { ArrowRight } from "lucide-react";
import { CORE_VALUES, MILESTONES, LEADERSHIP_PROFILES, SITE_INFO } from "../data/siteData";
import { useTheme } from "../context/ThemeContext";

interface AboutSectionProps {
  setActiveTab: (tab: string) => void;
  onSelectLeader: (id: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  setActiveTab,
  onSelectLeader,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ── ABOUT PAGE HERO ───────────────────────── */}
      <section
        className={`relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b bg-blueprint-grid ${
          isDark ? "border-[#1e2229]" : "border-[#e5e9f0]"
        }`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-4">
            <button
              onClick={() => setActiveTab("home")}
              className="hover:underline cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className={isDark ? "text-neutral-400" : "text-neutral-500"}>
              About Studio
            </span>
          </div>

          <h1
            className={`font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            About Our Atelier
          </h1>
          <p
            className={`mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            Bridging spatial artistry and structural precision. Mohalkar Architects &amp; Planners crafts human-centered built environments with lasting context and purpose.
          </p>
        </div>
      </section>

      {/* ── OUR STORY & FOUNDATION ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
                Our Story
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
              is a premier design consultancy specialising in residential, commercial, and urban planning. With an unwavering commitment to purposeful beauty, we deliver innovative, sustainable, and custom-calibrated solutions to private clients, developers, and municipal bodies across India.
            </p>

            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              From preliminary concept ideation to construction-phase execution, every project reflects our dedication to craftsmanship, cultural context, and lasting architectural value. We believe architecture is not merely about constructing envelopes, but about orchestrating light, movement, and human memory.
            </p>

            <div
              className={`pt-4 grid grid-cols-2 gap-4 border-t ${
                isDark ? "border-[#1e2229]" : "border-[#e5e9f0]"
              }`}
            >
              <div>
                <span
                  className={`font-serif text-2xl font-bold ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  Pune · Bhoom
                </span>
                <p className="text-[11px] uppercase tracking-wider text-[#c8a96e] font-semibold">
                  Studio Operations
                </p>
              </div>
              <div>
                <span
                  className={`font-serif text-2xl font-bold ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  Dharashiv
                </span>
                <p className="text-[11px] uppercase tracking-wider text-[#c8a96e] font-semibold">
                  Regional Heritage Roots
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              className={`relative rounded-2xl overflow-hidden border shadow-2xl ${
                isDark ? "border-[#252830] bg-[#161a22]" : "border-[#d8dde6] bg-white"
              }`}
            >
              <img
                src="/images/hugo-sousa-BghGseQbAkA-unsplash.jpg"
                alt="Architectural Craftsmanship"
                className="w-full h-[420px] object-cover"
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
                    2+
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#c8a96e] font-semibold block">
                    Years of Studio Excellence
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-mono font-medium ${
                      isDark ? "text-neutral-300" : "text-neutral-800"
                    }`}
                  >
                    B.ARCH THESIS HONORS
                  </span>
                  <p
                    className={`text-[10px] ${
                      isDark ? "text-neutral-500" : "text-neutral-500"
                    }`}
                  >
                    Principal Led Practice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ────────────────────────────── */}
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
            The ethical pillars that guide our pencils, drawings, and client interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((val, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl border space-y-3 transition-colors ${
                isDark
                  ? "border-[#252830] bg-[#12151c] hover:border-[#c8a96e]/40"
                  : "border-[#e2e6ee] bg-white hover:border-[#c8a96e] shadow-sm"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                  isDark
                    ? "bg-[#c8a96e]/10 border border-[#c8a96e]/30 text-[#c8a96e]"
                    : "bg-[#c8a96e]/20 border border-[#c8a96e]/40 text-[#8c6d32]"
                }`}
              >
                0{idx + 1}
              </div>
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

      {/* ── STUDIO MILESTONES & JOURNEY ────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            Our Journey
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold mt-1 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Milestones
          </h2>
          <p
            className={`text-xs sm:text-sm mt-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            From architectural vision and academic thesis to scalable pan-India practice.
          </p>
        </div>

        <div
          className={`relative border-l ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-10 ${
            isDark ? "border-[#252830]" : "border-[#d8dde6]"
          }`}
        >
          {MILESTONES.map((mile, idx) => (
            <div key={idx} className="relative group">
              {/* Year indicator */}
              <div className="sm:absolute sm:-left-36 sm:top-0 sm:text-right mb-2 sm:mb-0">
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${
                    isDark
                      ? "text-[#c8a96e] bg-[#161a22] border-[#252830]"
                      : "text-[#8c6d32] bg-white border-[#d8dde6] shadow-sm"
                  }`}
                >
                  {mile.year}
                </span>
              </div>

              {/* Node dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#c8a96e] group-hover:bg-[#c8a96e] transition-colors ${
                  isDark ? "bg-[#12151c]" : "bg-white"
                }`}
              />

              <div
                className={`p-6 rounded-xl border transition-colors space-y-2 ${
                  isDark
                    ? "border-[#252830] bg-[#12151c] group-hover:border-[#c8a96e]/50"
                    : "border-[#e2e6ee] bg-white group-hover:border-[#c8a96e] shadow-sm"
                }`}
              >
                <h3
                  className={`font-serif text-xl font-bold ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {mile.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  {mile.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEADERSHIP PROFILES ────────────────────── */}
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
            Click any profile to review complete thesis background, experience, and credentials.
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
                    {leader.role}
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
                <span>Inspect Full Bio &amp; Projects</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STUDIO PARTNERS ────────────────────────── */}
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
            Our Studio Partners
          </h2>
          <p
            className={`text-xs mt-1 max-w-lg mx-auto ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Multidisciplinary industry partners collaborating across engineering, MEP, and statutory approvals.
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
    </div>
  );
};
