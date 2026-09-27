import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, ChevronDown, Check } from "lucide-react";
import { useTheme, ThemeMode } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: "button" | "segmented" | "dropdown" | "switch";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
  variant = "button",
}) => {
  const { resolvedTheme, isDark, setThemeMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Segmented Pill Control (Clean 2-way Light/Dark toggle)
  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl border transition-all ${
          isDark
            ? "bg-[#141722] border-[#262c3d]"
            : "bg-[#edf0f5] border-[#d4dbe8]"
        } ${className}`}
        role="group"
        aria-label="Theme mode selection"
      >
        <button
          type="button"
          onClick={() => setThemeMode("light")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            !isDark
              ? "bg-white text-amber-700 shadow-sm font-semibold border border-[#d6dce7]"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
          title="Light Theme"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setThemeMode("dark")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            isDark
              ? "bg-[#252b3d] text-[#c8a96e] shadow-sm font-semibold"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
          title="Dark Theme"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // 2-way Dropdown selector
  if (variant === "dropdown") {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-all ${
            isDark
              ? "bg-[#141722] hover:bg-[#1e2334] border-[#272d3f] text-neutral-300"
              : "bg-white hover:bg-[#f3f5f8] border-[#d4dbe8] text-neutral-800 shadow-sm"
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          )}
          <span className="capitalize">{isDark ? "Dark" : "Light"}</span>
          <ChevronDown className="w-3 h-3 text-neutral-400 ml-0.5" />
        </button>

        {isOpen && (
          <div
            className={`absolute right-0 mt-1.5 w-36 rounded-xl border shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-100 ${
              isDark
                ? "bg-[#131620] border-[#292f42] text-neutral-200"
                : "bg-white border-[#dce2ec] text-neutral-800"
            }`}
          >
            {(
              [
                { mode: "light" as ThemeMode, label: "Light Theme", icon: Sun },
                { mode: "dark" as ThemeMode, label: "Dark Theme", icon: Moon },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isSelected = resolvedTheme === item.mode;
              return (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => {
                    setThemeMode(item.mode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-[#1e2436] text-[#c8a96e] font-semibold"
                        : "bg-[#f0f4fb] text-[#b88c38] font-semibold"
                      : isDark
                      ? "hover:bg-[#1a1e2b] text-neutral-300"
                      : "hover:bg-[#f4f6fa] text-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#c8a96e]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Switch representation
  if (variant === "switch") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Theme mode is ${isDark ? "dark" : "light"}. Click to toggle.`}
        title={`Theme: ${isDark ? "Dark Theme" : "Light Theme"} (Click to toggle)`}
        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96e] ${
          isDark
            ? "bg-[#1a1e28] border-[#2d3240]"
            : "bg-[#e5e9f0] border-[#cbd2df]"
        } ${className}`}
      >
        <span
          className={`pointer-events-none inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white text-black shadow-md ring-0 transition duration-200 ease-in-out ${
            isDark
              ? "translate-x-7 bg-[#252a38] text-[#c8a96e]"
              : "translate-x-0 bg-[#ffffff] text-amber-600"
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Sun className="w-3.5 h-3.5 fill-current" />
          )}
        </span>
      </button>
    );
  }

  // Default button: click to toggle (Light <-> Dark)
  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Current: ${isDark ? "Dark Mode" : "Light Mode"}. Click to switch theme.`}
      title={`Switch to ${isDark ? "Light Mode" : "Dark Mode"}`}
      className={`relative p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96e] ${
        isDark
          ? "bg-[#141720] hover:bg-[#1f2430] border border-[#252830] text-[#c8a96e] hover:text-white"
          : "bg-white hover:bg-[#f1f4f9] border border-[#d4dbe8] text-neutral-800 hover:text-black shadow-sm"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:rotate-45 transition-transform duration-300" />
        )}
      </div>

      {showLabel && (
        <span
          className={`text-xs font-semibold tracking-wide ${
            isDark ? "text-neutral-300" : "text-neutral-800"
          }`}
        >
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
};
