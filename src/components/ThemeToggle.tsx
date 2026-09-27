import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme mode"
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 border cursor-pointer ${
        isDark
          ? 'bg-neutral-900 border-neutral-800 text-[#c8a96e] hover:border-[#c8a96e]/40 shadow-inner'
          : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:border-[#c8a96e]/60 shadow-xs'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12 text-[#a38247]" />
      )}
    </button>
  );
};
