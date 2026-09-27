import React from 'react';
import { Home, Layers, Building, Wrench, Send, Calculator } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MobileBottomBarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  onOpenEstimator: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentSection,
  onNavigate,
  onOpenEstimator
}) => {
  const { isDark } = useTheme();

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: Building },
    { id: 'estimator', label: 'Estimate', icon: Calculator, isSpecial: true },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'enquiry', label: 'Contact', icon: Send }
  ];

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t transition-colors ${
        isDark
          ? 'bg-[#0e0e10]/95 backdrop-blur-md border-neutral-800'
          : 'bg-[#fbfaf8]/95 backdrop-blur-md border-neutral-200'
      }`}
    >
      <div className="grid grid-cols-5 h-14">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={onOpenEstimator}
                className="flex flex-col items-center justify-center text-center cursor-pointer text-[#c8a96e]"
              >
                <div className="w-8 h-8 rounded-full bg-[#c8a96e]/15 border border-[#c8a96e]/40 flex items-center justify-center mb-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-semibold">Estimate</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isActive
                  ? 'text-[#c8a96e] font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
