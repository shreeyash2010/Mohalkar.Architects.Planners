import React, { useState } from 'react';
import { X, Calculator, Download, ArrowRight, Sparkles } from 'lucide-react';
import { generateCostEstimatePdf } from '../utils/blueprintPdfGenerator';

interface CostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFillEnquiry: (data: { typology: string; sqft: string; budget: string }) => void;
}

export const CostEstimatorModal: React.FC<CostEstimatorModalProps> = ({
  isOpen,
  onClose,
  onFillEnquiry
}) => {
  if (!isOpen) return null;

  const [typology, setTypology] = useState('Residential');
  const [sqft, setSqft] = useState<number>(4500);
  const [qualityTier, setQualityTier] = useState<'Ultra Luxury' | 'Premium Executive' | 'Standard Spec'>('Ultra Luxury');
  const [clientName, setClientName] = useState('');

  // Base rate per sqft in INR by typology and finish tier
  const rateCards: Record<string, Record<string, { min: number; max: number }>> = {
    Residential: {
      'Ultra Luxury': { min: 3800, max: 5500 },
      'Premium Executive': { min: 2800, max: 3800 },
      'Standard Spec': { min: 2200, max: 2800 }
    },
    Commercial: {
      'Ultra Luxury': { min: 3200, max: 4800 },
      'Premium Executive': { min: 2400, max: 3200 },
      'Standard Spec': { min: 1900, max: 2400 }
    },
    Interior: {
      'Ultra Luxury': { min: 2500, max: 4500 },
      'Premium Executive': { min: 1800, max: 2500 },
      'Standard Spec': { min: 1200, max: 1800 }
    },
    Landscape: {
      'Ultra Luxury': { min: 800, max: 1500 },
      'Premium Executive': { min: 500, max: 800 },
      'Standard Spec': { min: 350, max: 500 }
    },
    Industrial: {
      'Ultra Luxury': { min: 2200, max: 3000 },
      'Premium Executive': { min: 1600, max: 2200 },
      'Standard Spec': { min: 1200, max: 1600 }
    },
    'Urban Planning': {
      'Ultra Luxury': { min: 450, max: 850 },
      'Premium Executive': { min: 300, max: 450 },
      'Standard Spec': { min: 180, max: 300 }
    }
  };

  const currentRates = rateCards[typology]?.[qualityTier] || { min: 2500, max: 3800 };
  const costMin = sqft * currentRates.min;
  const costMax = sqft * currentRates.max;

  const formattedMin = (costMin / 100000).toFixed(2);
  const formattedMax = (costMax / 100000).toFixed(2);
  const budgetString = `₹${formattedMin}L - ₹${formattedMax}L`;

  const handleDownloadPdf = () => {
    generateCostEstimatePdf({
      typology,
      sqft,
      qualityTier,
      estimatedCostMin: costMin,
      estimatedCostMax: costMax,
      clientName: clientName || undefined
    });
  };

  const handleProceedToBrief = () => {
    onFillEnquiry({
      typology,
      sqft: `${sqft.toLocaleString('en-IN')} sq.ft`,
      budget: budgetString
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#fbfaf8] dark:bg-[#0e0e10] border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#c8a96e]" />
            <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Architectural Feasibility &amp; Scope Calculator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculator Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs font-mono">
          {/* Typology Selection */}
          <div className="space-y-2">
            <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
              1. Project Typology
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Residential', 'Commercial', 'Interior', 'Landscape', 'Industrial', 'Urban Planning'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypology(type)}
                  className={`py-2 px-3 text-center border transition-all cursor-pointer ${
                    typology === type
                      ? 'border-[#c8a96e] bg-[#c8a96e] text-black font-semibold'
                      : 'border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Area Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                2. Super Built-Up Area
              </label>
              <span className="text-sm font-semibold text-[#c8a96e]">
                {sqft.toLocaleString('en-IN')} SQ.FT
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="250"
              value={sqft}
              onChange={e => setSqft(Number(e.target.value))}
              className="w-full accent-[#c8a96e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>500 sq.ft (Studio/Pavilion)</span>
              <span>25,000 sq.ft</span>
              <span>50,000+ sq.ft (Estate/Campus)</span>
            </div>
          </div>

          {/* Specification Finish Tier */}
          <div className="space-y-2">
            <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
              3. Specification &amp; Material Finish Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { tier: 'Standard Spec', desc: 'Civil + Standard Finishes' },
                { tier: 'Premium Executive', desc: 'Engineered + Italian Marble' },
                { tier: 'Ultra Luxury', desc: 'Bespoke Basalt, Brass & Bioclimatic' }
              ].map(item => (
                <button
                  key={item.tier}
                  type="button"
                  onClick={() => setQualityTier(item.tier as any)}
                  className={`p-2.5 text-left border transition-all cursor-pointer ${
                    qualityTier === item.tier
                      ? 'border-[#c8a96e] bg-[#c8a96e]/15 text-[#c8a96e] font-semibold'
                      : 'border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                  }`}
                >
                  <div className="text-[11px] font-semibold">{item.tier}</div>
                  <div className="text-[9px] opacity-75 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Client Name */}
          <div className="space-y-1.5">
            <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
              Client / Estate Name (For PDF Statement)
            </label>
            <input
              type="text"
              placeholder="e.g., Shinde Villa / Zenith Commercial"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="w-full p-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          {/* Results Display */}
          <div className="p-4 border border-[#c8a96e]/60 bg-linear-to-r from-[#c8a96e]/10 to-transparent space-y-2">
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
              Estimated Construction &amp; Architecture Budget
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-light text-neutral-900 dark:text-neutral-100">
              ₹{formattedMin} Lakhs – ₹{formattedMax} Lakhs
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
              *Approx. ₹{currentRates.min} – ₹{currentRates.max} per sq.ft including civil structure, façade &amp; architectural MEP.
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDownloadPdf}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:border-[#c8a96e] text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-[#c8a96e] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Estimate PDF</span>
          </button>

          <button
            onClick={handleProceedToBrief}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a96e] hover:bg-[#dfc38d] text-neutral-950 transition-colors cursor-pointer"
          >
            <span>Auto-fill Project Brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
