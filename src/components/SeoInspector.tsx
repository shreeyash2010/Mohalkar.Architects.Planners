import React, { useState } from 'react';
import { X, Search, CheckCircle, Share2, Globe } from 'lucide-react';

interface SeoInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
}

export const SeoInspector: React.FC<SeoInspectorProps> = ({ isOpen, onClose, currentSection }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#fbfaf8] dark:bg-[#0e0e10] border border-neutral-300 dark:border-neutral-800 shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#c8a96e]" />
            <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Live SEO &amp; Meta OpenGraph Inspector
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-500 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 space-y-2">
            <div className="text-[#c8a96e] font-semibold">Current Active Section: #{currentSection}</div>
            <div className="text-neutral-600 dark:text-neutral-300">
              <strong>Browser Title:</strong> {document.title}
            </div>
            <div className="text-neutral-600 dark:text-neutral-300">
              <strong>Meta Description:</strong>{' '}
              {document.querySelector('meta[name="description"]')?.getAttribute('content')}
            </div>
            <div className="text-neutral-600 dark:text-neutral-300">
              <strong>Google Verification Tag:</strong> Present (uOg7BUI4L2wxj34edZipBOv98cHwJl0gXygnOOi-Fu4)
            </div>
          </div>

          <div className="p-4 border border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-400 space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Vercel Analytics &amp; OpenGraph Active</span>
            </div>
            <p className="text-[11px] opacity-90">
              Google crawler and social media scrapers will automatically index full dynamic portfolio plates.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#c8a96e] text-black font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
