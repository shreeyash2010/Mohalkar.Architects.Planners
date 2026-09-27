import React, { useState } from "react";
import { X, Calculator, ArrowRight, Check, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface CostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEstimate: (details: {
    type: string;
    area: number;
    tier: string;
    estimatedWeeks: string;
  }) => void;
}

export const CostEstimatorModal: React.FC<CostEstimatorModalProps> = ({
  isOpen,
  onClose,
  onApplyEstimate,
}) => {
  const { isDark } = useTheme();
  const [projectType, setProjectType] = useState<string>("residential");
  const [areaSqFt, setAreaSqFt] = useState<number>(2500);
  const [tier, setTier] = useState<string>("full");

  if (!isOpen) return null;

  // Calculation parameters
  const typeLabels: Record<string, { label: string; baseRate: number; timeWeeks: number }> = {
    residential: { label: "Luxury Residential Bungalow", baseRate: 65, timeWeeks: 6 },
    commercial: { label: "Commercial / Retail Mall", baseRate: 85, timeWeeks: 10 },
    interior: { label: "Bespoke Interior Architecture", baseRate: 110, timeWeeks: 5 },
    landscape: { label: "Landscape & Open Spaces", baseRate: 40, timeWeeks: 4 },
    urban: { label: "Urban Precinct / Township", baseRate: 35, timeWeeks: 12 },
  };

  const currentType = typeLabels[projectType] || typeLabels.residential;

  // Tier multiplier
  const tierMultipliers: Record<string, { multiplier: number; label: string; desc: string }> = {
    concept: {
      multiplier: 0.6,
      label: "Concept & Sanction Sets",
      desc: "Schematic floor plans, massing, zoning & municipal approval sets.",
    },
    full: {
      multiplier: 1.0,
      label: "Complete Architectural & Working Drawings",
      desc: "Comprehensive GFC working drawings, electrical, plumbing, elevations & sections.",
    },
    premium: {
      multiplier: 1.45,
      label: "Full Design + 3D Walkthrough + Site Supervision",
      desc: "Architectural drawings, photorealistic 3D renders, and scheduled site quality inspections.",
    },
  };

  const selectedTier = tierMultipliers[tier] || tierMultipliers.full;
  const estimatedWeeks = Math.max(
    3,
    Math.round(currentType.timeWeeks * (areaSqFt / 2500) ** 0.4 * selectedTier.multiplier)
  );

  const handleApply = () => {
    onApplyEstimate({
      type: currentType.label,
      area: areaSqFt,
      tier: selectedTier.label,
      estimatedWeeks: `${estimatedWeeks} – ${estimatedWeeks + 2} Weeks`,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-xl max-h-[92vh] overflow-y-auto border rounded-xl shadow-2xl p-5 sm:p-8 transition-colors ${
          isDark
            ? "bg-[#12151c] border-[#252830] text-[#e2e4e8]"
            : "bg-white border-[#dce2ec] text-neutral-900 shadow-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? "text-neutral-400 hover:text-white hover:bg-[#1f242e]"
              : "text-neutral-500 hover:text-black hover:bg-[#f1f3f6]"
          }`}
          aria-label="Close Estimator"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-1">
          <Calculator className="w-4 h-4" />
          <span>Interactive Estimator</span>
        </div>
        <h3
          className={`font-serif text-2xl font-bold mb-2 ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          Project Scope &amp; Timeline Calculator
        </h3>
        <p
          className={`text-xs mb-6 ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          Calibrate your project dimensions to understand typical documentation milestones and design delivery timelines with Mohalkar Architects.
        </p>

        <div className="space-y-5">
          {/* Typology */}
          <div>
            <label
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              1. Select Project Typology
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(typeLabels).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setProjectType(key)}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                    projectType === key
                      ? "bg-[#c8a96e]/15 border-[#c8a96e] text-[#8c6d32] dark:text-white font-bold"
                      : isDark
                      ? "bg-[#181c24] border-[#252830] text-neutral-400 hover:text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-700 hover:text-black"
                  }`}
                >
                  {item.label.split(" ")[0]} {item.label.split(" ")[1] || ""}
                </button>
              ))}
            </div>
          </div>

          {/* Area Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                2. Built-Up Area (sq.ft)
              </label>
              <span className="font-mono text-sm font-bold text-[#c8a96e]">
                {areaSqFt.toLocaleString()} sq.ft
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="15000"
              step="100"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#c8a96e] ${
                isDark ? "bg-[#252830]" : "bg-[#e2e6ef]"
              }`}
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
              <span>800 sq.ft</span>
              <span>5,000 sq.ft</span>
              <span>15,000+ sq.ft</span>
            </div>
          </div>

          {/* Scope Depth Tier */}
          <div>
            <label
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              3. Scope &amp; Depth of Drawings
            </label>
            <div className="space-y-2">
              {Object.entries(tierMultipliers).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setTier(key)}
                  className={`w-full p-3 rounded-lg text-left border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    tier === key
                      ? isDark
                        ? "bg-[#c8a96e]/10 border-[#c8a96e]"
                        : "bg-[#fefaf3] border-[#c8a96e] shadow-sm"
                      : isDark
                      ? "bg-[#161a22] border-[#252830] hover:border-neutral-700"
                      : "bg-[#f8f9fc] border-[#d8dde6] hover:border-neutral-400"
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {tier === key && <Check className="w-3.5 h-3.5 text-[#c8a96e]" />}
                      {item.label}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Box */}
          <div
            className={`border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDark ? "bg-[#181c24] border-[#252830]" : "bg-[#f4f6fa] border-[#d8dde6]"
            }`}
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#c8a96e] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Estimated Milestone Duration
              </p>
              <h4
                className={`font-serif text-xl font-bold mt-0.5 ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {estimatedWeeks} to {estimatedWeeks + 2} Weeks
              </h4>
              <p
                className={`text-[11px] ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                From initial discovery workshop to construction-ready drawing set.
              </p>
            </div>

            <button
              onClick={handleApply}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0c0e12] bg-[#c8a96e] hover:bg-[#dfc085] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shadow-md active:scale-95"
            >
              <span>Apply to Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
