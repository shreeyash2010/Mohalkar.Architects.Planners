import React from "react";
import { Home, Grid, Sparkles, Layers, MessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface MobileBottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { isDark } = useTheme();

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "projects", label: "Projects", icon: Grid },
    { id: "expertise", label: "Expertise", icon: Sparkles },
    { id: "services", label: "Services", icon: Layers },
    { id: "enquiry", label: "Contact", icon: MessageSquare },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden px-2 py-2 safe-area-bottom shadow-2xl backdrop-blur-xl border-t transition-colors ${
        isDark
          ? "bg-[#0a0c10]/95 border-[#252830]"
          : "bg-white/95 border-[#e2e6ee] shadow-lg"
      }`}
      aria-label="Mobile Navigation Dock"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-all cursor-pointer rounded-lg relative ${
                isActive
                  ? "text-[#c8a96e]"
                  : isDark
                  ? "text-neutral-400 hover:text-neutral-200"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#c8a96e] rounded-full shadow-[0_0_8px_#c8a96e]" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 ${
                  isActive
                    ? isDark
                      ? "text-white font-semibold"
                      : "text-neutral-900 font-semibold"
                    : ""
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
