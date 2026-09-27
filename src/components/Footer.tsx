import React from "react";
import { ArrowUp, Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle, Lock } from "lucide-react";
import { SITE_INFO } from "../data/siteData";
import { useTheme } from "../context/ThemeContext";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`relative pt-16 pb-12 transition-colors border-t ${
        isDark
          ? "bg-[#08090c] border-[#1e2229] text-[#9ca3af]"
          : "bg-[#eef1f6] border-[#dce2ec] text-[#4b5563]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b ${
            isDark ? "border-[#1e2229]" : "border-[#dce2ec]"
          }`}
        >
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo2.png"
                alt="Mohalkar Logo"
                className={`w-9 h-9 object-contain border rounded p-0.5 ${
                  isDark
                    ? "border-[#c8a96e]/30 bg-[#161a22]"
                    : "border-[#c8a96e]/40 bg-white"
                }`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/logo.jpg";
                }}
              />
              <div>
                <span
                  className={`font-serif text-xl font-bold tracking-wider ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  MOHALKAR
                </span>
                <span className="block text-[9px] tracking-[0.25em] text-[#c8a96e] font-semibold uppercase">
                  ARCHITECTS &amp; PLANNERS
                </span>
              </div>
            </div>
            <p
              className={`text-xs leading-relaxed max-w-sm ${
                isDark ? "text-[#9ca3af]" : "text-[#4b5563]"
              }`}
            >
              Designing modern, inspiring spaces for a better tomorrow. Excellence in every line,
              purpose in every volume, and enduring value across residential, commercial, and
              urban sectors.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={SITE_INFO.contacts.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded border flex items-center justify-center hover:text-[#c8a96e] hover:border-[#c8a96e] transition-colors ${
                  isDark
                    ? "border-[#252830] text-neutral-400 bg-[#12151c]"
                    : "border-[#d8dde6] text-neutral-600 bg-white shadow-sm"
                }`}
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_INFO.contacts.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded border flex items-center justify-center hover:text-[#c8a96e] hover:border-[#c8a96e] transition-colors ${
                  isDark
                    ? "border-[#252830] text-neutral-400 bg-[#12151c]"
                    : "border-[#d8dde6] text-neutral-600 bg-white shadow-sm"
                }`}
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${SITE_INFO.contacts.emailPrimary}`}
                className={`w-8 h-8 rounded border flex items-center justify-center hover:text-[#c8a96e] hover:border-[#c8a96e] transition-colors ${
                  isDark
                    ? "border-[#252830] text-neutral-400 bg-[#12151c]"
                    : "border-[#d8dde6] text-neutral-600 bg-white shadow-sm"
                }`}
                aria-label="Email Studio"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={SITE_INFO.contacts.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded border flex items-center justify-center hover:text-emerald-500 hover:border-emerald-500 transition-colors ${
                  isDark
                    ? "border-[#252830] text-neutral-400 bg-[#12151c]"
                    : "border-[#d8dde6] text-neutral-600 bg-white shadow-sm"
                }`}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
              Navigation
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo("home")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("about")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  About the Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("expertise")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Practice Expertise
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("services")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Scope of Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("projects")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Project Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("enquiry")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Start Project Enquiry
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Design Disciplines */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
              Disciplines
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo("expertise")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Residential Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("expertise")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Commercial &amp; Shopping Complex Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("expertise")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Interior Architecture &amp; Joinery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("expertise")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Urban Planning &amp; Precincts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("expertise")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Landscape &amp; Public Parks
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("services")}
                  className={`transition-colors cursor-pointer text-left ${
                    isDark ? "hover:text-white text-[#9ca3af]" : "hover:text-black text-[#4b5563]"
                  }`}
                >
                  Statutory Municipal Sanctions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contacts */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
              Contact &amp; Studios
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a
                    href={`tel:${SITE_INFO.contacts.phonePrimary}`}
                    className={`block ${isDark ? "hover:text-white" : "hover:text-black font-medium text-neutral-800"}`}
                  >
                    {SITE_INFO.contacts.phonePrimary}
                  </a>
                  <a
                    href={`tel:${SITE_INFO.contacts.phoneSecondary}`}
                    className={`block ${isDark ? "hover:text-white" : "hover:text-black"}`}
                  >
                    {SITE_INFO.contacts.phoneSecondary}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${SITE_INFO.contacts.emailPrimary}`}
                  className={`hover:text-[#c8a96e] break-all ${isDark ? "text-[#9ca3af]" : "text-[#4b5563]"}`}
                >
                  {SITE_INFO.contacts.emailPrimary}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                <span>{SITE_INFO.contacts.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] ${
            isDark ? "text-[#787f8d]" : "text-[#6b7280]"
          }`}
        >
          <div className="text-center sm:text-left">
            &copy; 2026 <strong className={isDark ? "text-neutral-300" : "text-neutral-900"}>Abhishek Mohalkar</strong> · Mohalkar Architects &amp; Planners. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5">
              Designed by{" "}
              <span className="text-[#c8a96e] font-semibold tracking-wide hover:text-[#dfc085] transition-colors">
                Mali Studio&apos;s
              </span>
            </span>
            <span className={isDark ? "text-neutral-700 hidden sm:inline" : "text-neutral-300 hidden sm:inline"}>
              |
            </span>
            <button
              onClick={() => navigateTo("admin")}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark ? "text-neutral-500 hover:text-[#c8a96e]" : "text-neutral-600 hover:text-black"
              }`}
              title="Mohalkar Studio Executive Console"
            >
              <Lock className="w-3 h-3 text-[#c8a96e]" />
              <span>Studio Portal</span>
            </button>
            <span className={isDark ? "text-neutral-700 hidden sm:inline" : "text-neutral-300 hidden sm:inline"}>
              |
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#c8a96e] hover:underline transition-colors cursor-pointer font-medium"
              title="Return to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
