import React, { useState } from 'react';
import { X, Download, Compass, Layers, CheckCircle2, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { Project } from '../data/projectsData';
import { generateProjectPdf } from '../utils/blueprintPdfGenerator';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigateToEnquiry: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onNavigateToEnquiry
}) => {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = project.gallery?.length > 0 ? project.gallery : [project.heroImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#fbfaf8] dark:bg-[#0e0e10] border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-[#c8a96e] uppercase">
              {project.category} Monograph
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-xs font-mono text-neutral-500">{project.year}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => generateProjectPdf(project)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-[#c8a96e] border border-[#c8a96e]/40 hover:bg-[#c8a96e] hover:text-black transition-colors cursor-pointer"
              title="Download Architectural Plate PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF Plate</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Main Gallery Display */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
              <img
                src={images[activeImageIndex]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 shrink-0 border-2 overflow-hidden transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#c8a96e] opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Architectural Metrics */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-4xl font-light text-neutral-900 dark:text-neutral-50">
              {project.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-xs font-mono">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block mb-1">LOCATION</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">{project.location}</span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block mb-1">SUPER AREA</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">{project.area}</span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block mb-1">STATUS</span>
                <span className="text-[#c8a96e] font-semibold">{project.status}</span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block mb-1">TYPOLOGY TIER</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">{project.budgetTier || 'Ultra Luxury'}</span>
              </div>
            </div>
          </div>

          {/* Narrative & Concepts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-neutral-100">
                1. Architectural Summary
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-neutral-100">
                2. Bioclimatic Concept &amp; Engineering
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
                {project.concept}
              </p>
            </div>
          </div>

          {/* Scope Deliverables */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-neutral-100">
              3. Commission Scope &amp; Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.scope.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar Action */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-900/40 flex items-center justify-between">
          <button
            onClick={() => generateProjectPdf(project)}
            className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-[#c8a96e] flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Architectural Monograph Plate</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateToEnquiry(project.title);
            }}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a96e] hover:bg-[#dfc38d] text-neutral-950 transition-colors cursor-pointer"
          >
            Inquire For Similar Typology
          </button>
        </div>
      </div>
    </div>
  );
};
