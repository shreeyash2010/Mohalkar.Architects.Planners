import React, { useState, useEffect } from "react";
import { MessageCircle, X, ArrowUpRight } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomeSection } from "./components/HomeSection";
import { AboutSection } from "./components/AboutSection";
import { ExpertiseSection } from "./components/ExpertiseSection";
import { ServicesSection } from "./components/ServicesSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { EnquirySection } from "./components/EnquirySection";
import { AdminDashboard } from "./components/AdminDashboard";
import { ProjectModal } from "./components/ProjectModal";
import { LeadershipModal } from "./components/LeadershipModal";
import { CostEstimatorModal } from "./components/CostEstimatorModal";
import { MobileBottomBar } from "./components/MobileBottomBar";
import { ProjectItem } from "./data/projectsData";
import { getPublishedProjects, recordPageView } from "./utils/projectStorage";
import { LEADERSHIP_PROFILES, SITE_INFO } from "./data/siteData";
import { MetaTagManager } from "./components/MetaTagManager";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null);
  const [estimatorOpen, setEstimatorOpen] = useState<boolean>(false);
  const [appliedEstimate, setAppliedEstimate] = useState<{
    type: string;
    area: number;
    tier: string;
    estimatedWeeks: string;
  } | null>(null);
  const [whatsappBubbleOpen, setWhatsappBubbleOpen] = useState<boolean>(false);

  // Reactive published projects list
  const [publishedProjects, setPublishedProjects] = useState<ProjectItem[]>(() =>
    getPublishedProjects()
  );

  useEffect(() => {
    const handleUpdate = () => setPublishedProjects(getPublishedProjects());
    window.addEventListener("mohalkar:projects-updated", handleUpdate);
    return () => window.removeEventListener("mohalkar:projects-updated", handleUpdate);
  }, []);

  // Record real live page view telemetry
  useEffect(() => {
    if (activeTab !== "admin") {
      recordPageView();
    }
  }, [activeTab]);

  // Sync hash with activeTab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (
        [
          "home",
          "about",
          "expertise",
          "services",
          "projects",
          "enquiry",
          "contact",
          "admin",
        ].includes(hash)
      ) {
        setActiveTab(hash === "contact" ? "enquiry" : hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Keyboard shortcut for studio admin: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        handleTabChange("admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedLeader =
    LEADERSHIP_PROFILES.find((p) => p.id === selectedLeaderId) || null;

  // If in admin mode, display the executive studio console
  if (activeTab === "admin") {
    return (
      <div className={isDark ? "dark" : "light"}>
        <MetaTagManager activeTab="admin" />
        <AdminDashboard
          onExit={() => handleTabChange("home")}
          onNavigateToProjects={() => handleTabChange("projects")}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#c8a96e] ${
        isDark
          ? "bg-[#0c0e12] text-[#e2e4e8] selection:text-[#0c0e12]"
          : "bg-[#f8f9fb] text-[#1a1d24] selection:text-white"
      }`}
    >
      {/* Dynamic SEO Meta Tag Manager */}
      <MetaTagManager
        activeTab={activeTab}
        selectedProject={selectedProject}
        selectedLeader={selectedLeader}
      />

      {/* Persistent 3-Zone Navbar with Light/Dark Mode Toggler */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main View Router */}
      <main className="flex-1 pb-24 sm:pb-28 lg:pb-16">
        {activeTab === "home" && (
          <HomeSection
            setActiveTab={handleTabChange}
            onSelectLeader={setSelectedLeaderId}
            onOpenEstimator={() => setEstimatorOpen(true)}
          />
        )}

        {activeTab === "about" && (
          <AboutSection
            setActiveTab={handleTabChange}
            onSelectLeader={setSelectedLeaderId}
          />
        )}

        {activeTab === "expertise" && (
          <ExpertiseSection
            setActiveTab={handleTabChange}
            onOpenEstimator={() => setEstimatorOpen(true)}
          />
        )}

        {activeTab === "services" && (
          <ServicesSection setActiveTab={handleTabChange} />
        )}

        {activeTab === "projects" && (
          <ProjectsSection
            setActiveTab={handleTabChange}
            onSelectProject={setSelectedProject}
            projects={publishedProjects}
          />
        )}

        {activeTab === "enquiry" && (
          <EnquirySection initialEstimate={appliedEstimate} />
        )}
      </main>

      {/* Persistent Footer with discreet Admin Portal trigger */}
      <Footer setActiveTab={handleTabChange} />

      {/* Mobile & Tablet Bottom Navigation Dock */}
      <MobileBottomBar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Project Lightbox & High-Res Blueprint Inspector Modal */}
      <ProjectModal
        project={selectedProject}
        allProjects={publishedProjects}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
      />

      {/* Leadership Profile Modal */}
      <LeadershipModal
        profile={selectedLeader}
        onClose={() => setSelectedLeaderId(null)}
        onOpenEnquiry={() => {
          setSelectedLeaderId(null);
          handleTabChange("enquiry");
        }}
      />

      {/* Interactive Scope & Cost Estimator Modal */}
      <CostEstimatorModal
        isOpen={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        onApplyEstimate={(details) => {
          setAppliedEstimate(details);
          handleTabChange("enquiry");
        }}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 lg:bottom-6 lg:right-6 z-40 flex flex-col items-end">
        {whatsappBubbleOpen && (
          <div
            className={`mb-3 w-68 sm:w-72 rounded-xl p-4 text-xs space-y-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 border ${
              isDark
                ? "bg-[#141720] border-[#252830] text-neutral-300"
                : "bg-white border-[#d8dde6] text-neutral-700 shadow-xl"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-2 border-b ${
                isDark ? "border-[#252830]" : "border-[#e5e9f0]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Mohalkar Studio Direct
                </span>
              </div>
              <button
                onClick={() => setWhatsappBubbleOpen(false)}
                className={`cursor-pointer ${
                  isDark ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
                aria-label="Close message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className={`leading-relaxed text-[11px] ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
              Chat directly with Founder &amp; Principal Architect Abhishek Mohalkar regarding your upcoming project.
            </p>
            <a
              href={SITE_INFO.contacts.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-[#25d366] hover:bg-[#20ba59] text-black font-semibold uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 transition-colors text-[10px] shadow-sm"
            >
              <span>Open WhatsApp Chat</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <button
          onClick={() => setWhatsappBubbleOpen(!whatsappBubbleOpen)}
          className="w-13 h-13 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/20"
          title="Direct WhatsApp with Principal Architect"
          aria-label="WhatsApp with Principal Architect"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </button>
      </div>

      {/* Vercel Web Analytics */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
