import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

export type ThemeMode = "system" | "light" | "dark";
export type Theme = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: Theme;
  resolvedTheme: Theme;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setTheme: (theme: Theme | ThemeMode) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial preference from localStorage or default to system
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mohalkar_theme_mode") || localStorage.getItem("mohalkar_theme");
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved as ThemeMode;
      }
    }
    return "system"; // Default to system preference
  });

  // Track system preference in real-time
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true; // Fallback to dark if media query is unavailable
  });

  // Listen to OS system color scheme changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    setSystemPrefersDark(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  // Compute the resolved active theme
  const resolvedTheme: Theme = useMemo(() => {
    if (themeMode === "system") {
      return systemPrefersDark ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, systemPrefersDark]);

  // Apply classes and attributes to DOM root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (resolvedTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
      body.style.backgroundColor = "#f8f9fb";
      body.style.color = "#181a20";
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
      body.style.backgroundColor = "#0c0e12";
      body.style.color = "#e2e4e8";
    }

    try {
      localStorage.setItem("mohalkar_theme_mode", themeMode);
      localStorage.setItem("mohalkar_theme", resolvedTheme);
    } catch {
      // Ignore storage errors in restricted iframe
    }

    window.dispatchEvent(
      new CustomEvent("mohalkar:theme-changed", {
        detail: { theme: resolvedTheme, themeMode },
      })
    );
  }, [resolvedTheme, themeMode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const setTheme = useCallback((newTheme: Theme | ThemeMode) => {
    setThemeModeState(newTheme);
  }, []);

  // Cycle through System -> Light -> Dark -> System
  const cycleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      if (prev === "system") return "light";
      if (prev === "light") return "dark";
      return "system";
    });
  }, []);

  // Simple toggle for switches
  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      if (prev === "system") {
        return systemPrefersDark ? "light" : "dark";
      }
      return prev === "dark" ? "light" : "dark";
    });
  }, [systemPrefersDark]);

  const value = useMemo(
    () => ({
      themeMode,
      theme: resolvedTheme,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
      isLight: resolvedTheme === "light",
      isSystem: themeMode === "system",
      setThemeMode,
      setTheme,
      toggleTheme,
      cycleTheme,
    }),
    [themeMode, resolvedTheme, setThemeMode, setTheme, toggleTheme, cycleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
