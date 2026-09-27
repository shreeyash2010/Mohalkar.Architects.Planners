import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Share2,
  MessageCircle,
  MapPin,
  Maximize2,
  Layers,
  Info,
  ChevronUp,
  ChevronDown,
  Download,
  Loader2,
  CheckCircle2,
  FileDown
} from "lucide-react";
import { ProjectItem } from "../data/projectsData";
import { recordBlueprintInspection } from "../utils/projectStorage";
import { useTheme } from "../context/ThemeContext";
import { downloadSampleBlueprint } from "../utils/blueprintPdfGenerator";

interface ProjectModalProps {
  project: ProjectItem | null;
  allProjects: ProjectItem[];
  onClose: () => void;
  onSelectProject: (p: ProjectItem) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  allProjects,
  onClose,
  onSelectProject,
}) => {
  const { isDark } = useTheme();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showDetailsMobile, setShowDetailsMobile] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const lastTapRef = useRef<number>(0);

  // Computed all project images (Cover + Gallery)
  const allProjectImages = project ? [project.image, ...(project.gallery || [])] : [];
  const currentImage = allProjectImages[activeImageIndex] || project?.image || "";

  const handleDownloadBlueprint = async () => {
    if (!project || isDownloading) return;
    try {
      setIsDownloading(true);
      setDownloadStatus("Generating blueprint PDF...");
      await downloadSampleBlueprint(project, (status) => setDownloadStatus(status));
      setToastMessage(`Sample Blueprint for "${project.title}" downloaded successfully!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error("Failed to download blueprint:", err);
      setToastMessage("Failed to generate blueprint. Please try again.");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsDownloading(false);
      setDownloadStatus("");
    }
  };

  // Record live telemetry on blueprint inspection
  useEffect(() => {
    if (project) {
      recordBlueprintInspection(project.id);
    }
  }, [project]);

  // Minimum swipe distance in px
  const minSwipeDistance = 50;

  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleDoubleTap = (e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      setZoomLevel((prev) => (prev > 1.2 ? 1 : 2));
    }
    lastTapRef.current = now;
  };

  // Reset zoom & active image whenever project changes
  useEffect(() => {
    setZoomLevel(1);
    setCopied(false);
    setShowDetailsMobile(false);
    setActiveImageIndex(0);
  }, [project]);

  const currentIndex = project
    ? allProjects.findIndex((p) => p.id === project.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectProject(allProjects[currentIndex - 1]);
    } else if (allProjects.length > 0) {
      onSelectProject(allProjects[allProjects.length - 1]);
    }
  }, [currentIndex, allProjects, onSelectProject]);

  const handleNext = useCallback(() => {
    if (currentIndex < allProjects.length - 1) {
      onSelectProject(allProjects[currentIndex + 1]);
    } else if (allProjects.length > 0) {
      onSelectProject(allProjects[0]);
    }
  }, [currentIndex, allProjects, onSelectProject]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose, handlePrev, handleNext]);

  if (!project) return null;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.35, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.35, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappInquireText = encodeURIComponent(
    `Hello Mohalkar Architects, I am reviewing your architectural drawing "${project.title}" (${project.tag}, ${project.scale || "Drawing Set"}) and would like to consult on a similar project.`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className={`relative w-full h-full sm:h-auto sm:max-h-[95vh] max-w-6xl border-0 sm:border sm:rounded-xl overflow-hidden shadow-2xl flex flex-col transition-colors ${
          isDark
            ? "bg-[#101318] sm:border-[#252830] text-[#e2e4e8]"
            : "bg-white sm:border-[#dce2ec] text-neutral-900 shadow-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStartHandler}
        onTouchMove={onTouchMoveHandler}
        onTouchEnd={onTouchEndHandler}
      >
        {/* Top Header Bar */}
        <div
          className={`flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b shrink-0 gap-2 ${
            isDark ? "border-[#252830] bg-[#161a22]" : "border-[#e5e9f0] bg-[#f8f9fb]"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c8a96e] font-semibold shrink-0 bg-[#c8a96e]/10 px-2 py-0.5 rounded border border-[#c8a96e]/30">
              {project.tag}
            </span>
            <div className="min-w-0 flex-1">
              <h3
                className={`font-serif text-sm sm:text-lg font-bold truncate ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {project.title}
              </h3>
              {(project.location || project.scale) && (
                <div
                  className={`hidden sm:flex items-center gap-2 text-[11px] font-mono mt-0.5 ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  {project.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c8a96e]" />
                      {project.location}
                    </span>
                  )}
                  {project.scale && (
                    <>
                      <span>·</span>
                      <span className={isDark ? "text-neutral-300 font-semibold" : "text-neutral-800 font-semibold"}>
                        {project.scale}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile details toggle button */}
            <button
              onClick={() => setShowDetailsMobile(!showDetailsMobile)}
              className={`sm:hidden p-1.5 rounded border flex items-center gap-1 text-[11px] ${
                isDark
                  ? "text-neutral-300 hover:text-white bg-[#1a1f29] border-[#252830]"
                  : "text-neutral-700 hover:text-black bg-white border-[#d8dde6]"
              }`}
              title="Toggle Details"
            >
              <Info className="w-3.5 h-3.5 text-[#c8a96e]" />
              <span className="text-[10px] font-mono">Specs</span>
              {showDetailsMobile ? (
                <ChevronUp className="w-3 h-3 text-neutral-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              )}
            </button>

            {/* Zoom Controls */}
            <div
              className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 rounded border ${
                isDark ? "bg-[#0c0e12] border-[#252830]" : "bg-white border-[#d8dde6]"
              }`}
            >
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.7}
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#c8a96e] px-1 font-semibold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={handleDownloadBlueprint}
              disabled={isDownloading}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                isDark
                  ? "bg-[#1c2230] hover:bg-[#c8a96e] text-[#c8a96e] hover:text-[#0c0e12] border-[#c8a96e]/40"
                  : "bg-white hover:bg-[#c8a96e] text-[#8c6d32] hover:text-[#0c0e12] border-[#d8dde6] hover:border-[#c8a96e] shadow-sm"
              }`}
              title="Download sample blueprint PDF"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Blueprint</span>
                </>
              )}
            </button>

            {/* Share link button */}
            <button
              onClick={handleShare}
              className={`p-1.5 rounded transition-colors ${
                isDark
                  ? "text-neutral-400 hover:text-white hover:bg-[#252830]"
                  : "text-neutral-600 hover:text-black hover:bg-[#f1f3f6]"
              }`}
              title="Copy Link"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1 cursor-pointer"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Specs Banner */}
        {showDetailsMobile && (
          <div
            className={`sm:hidden border-b px-4 py-3 space-y-2 text-xs animate-in slide-in-from-top-2 duration-200 ${
              isDark ? "bg-[#161a24] border-[#252830]" : "bg-[#f8f9fc] border-[#e2e6ee]"
            }`}
          >
            <div
              className={`flex items-center justify-between text-[11px] pb-1 border-b ${
                isDark ? "text-neutral-400 border-[#202530]" : "text-neutral-600 border-[#e5e9f0]"
              }`}
            >
              <span className="text-[#c8a96e] font-semibold">Plate Specs</span>
              <span className="font-mono">
                {currentIndex + 1} of {allProjects.length}
              </span>
            </div>
            {project.location && (
              <div className={`flex items-center gap-1.5 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                <MapPin className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                <span>
                  <strong>Location:</strong> {project.location}
                </span>
              </div>
            )}
            {project.scale && (
              <div className={`flex items-center gap-1.5 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                <Maximize2 className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                <span>
                  <strong>Scale / Dimension:</strong> {project.scale}
                </span>
              </div>
            )}
            {project.scope && (
              <div className={`flex items-start gap-1.5 pt-1 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                <Layers className="w-3.5 h-3.5 text-[#c8a96e] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  <strong>Scope:</strong> {project.scope}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Main Image Inspector Area */}
        <div
          className={`relative flex-1 overflow-auto flex flex-col items-center justify-center p-2 sm:p-4 select-none touch-pan-y ${
            isDark ? "bg-[#090b0e]" : "bg-[#f4f6f9]"
          }`}
          onTouchEnd={handleDoubleTap}
        >
          <div className="relative flex-1 flex items-center justify-center w-full min-h-[40vh]">
            <img
              src={currentImage}
              alt={project.alt || project.title}
              className="transition-transform duration-200 ease-out object-contain max-h-[50vh] sm:max-h-[62vh] max-w-full rounded shadow-xl"
              style={{ transform: `scale(${zoomLevel})` }}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                const filename = currentImage.split("/").pop();
                if (filename && !target.src.endsWith(`/images/${filename}`)) {
                  target.src = `/images/${filename}`;
                } else {
                  target.src = "/images/hugo-sousa-BghGseQbAkA-unsplash.jpg";
                }
              }}
            />

            {/* Desktop/Tablet Floating Navigation Arrows (Next/Prev Projects) */}
            <button
              onClick={handlePrev}
              className={`hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full border transition-all shadow-lg cursor-pointer ${
                isDark
                  ? "bg-[#161a22]/85 hover:bg-[#c8a96e] text-white hover:text-black border-[#252830]"
                  : "bg-white/90 hover:bg-[#c8a96e] text-black hover:text-black border-[#d8dde6]"
              }`}
              title="Previous Project (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className={`hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full border transition-all shadow-lg cursor-pointer ${
                isDark
                  ? "bg-[#161a22]/85 hover:bg-[#c8a96e] text-white hover:text-black border-[#252830]"
                  : "bg-white/90 hover:bg-[#c8a96e] text-black hover:text-black border-[#d8dde6]"
              }`}
              title="Next Project (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {copied && (
              <div className="absolute bottom-4 bg-[#c8a96e] text-black text-xs font-semibold px-3 py-1 rounded shadow-md">
                Link copied!
              </div>
            )}
          </div>

          {/* Multiple Pictures / Site Progress Gallery Strip */}
          {allProjectImages.length > 1 && (
            <div className="w-full pt-2 flex items-center justify-center gap-2 overflow-x-auto pb-1 shrink-0 z-10">
              <div
                className={`flex items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-md shadow-lg max-w-full overflow-x-auto scrollbar-none ${
                  isDark ? "bg-[#12151f]/90 border-[#252838]" : "bg-white/90 border-[#d8dde6]"
                }`}
              >
                <span className="text-[10px] font-mono text-[#c8a96e] px-2 font-bold uppercase tracking-wider shrink-0 hidden sm:inline">
                  {allProjectImages.length} Views:
                </span>
                {allProjectImages.map((imgUrl, imgIdx) => {
                  const isActive = activeImageIndex === imgIdx;
                  return (
                    <button
                      key={imgIdx}
                      type="button"
                      onClick={() => setActiveImageIndex(imgIdx)}
                      className={`relative w-12 sm:w-16 h-9 sm:h-11 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? "border-[#c8a96e] ring-2 ring-[#c8a96e] scale-105"
                          : "border-transparent opacity-60 hover:opacity-100 hover:border-neutral-400"
                      }`}
                      title={imgIdx === 0 ? "Cover Drawing" : `Site Progress Photo #${imgIdx}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${imgIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[7px] font-mono text-white text-center">
                        {imgIdx === 0 ? "Cover" : `#${imgIdx}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta & Mobile Navigation Bar */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-t gap-2.5 shrink-0 ${
            isDark ? "border-[#252830] bg-[#13161c]" : "border-[#e5e9f0] bg-[#f8f9fb]"
          }`}
        >
          {/* Mobile Previous / Next Bar */}
          <div
            className={`flex sm:hidden items-center justify-between w-full gap-2 pb-2 border-b ${
              isDark ? "border-[#252830]" : "border-[#e5e9f0]"
            }`}
          >
            <button
              onClick={handlePrev}
              className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                isDark
                  ? "bg-[#1c212b] border-[#252830] text-neutral-200"
                  : "bg-white border-[#d8dde6] text-neutral-800 shadow-sm"
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-[#c8a96e]" />
              <span>Previous Plate</span>
            </button>
            <div className="flex flex-col items-center px-1">
              <span
                className={`text-[11px] font-mono font-semibold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                {currentIndex + 1} / {allProjects.length}
              </span>
              <span
                className={`text-[9px] uppercase tracking-wider ${
                  isDark ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                Plates
              </span>
            </div>
            <button
              onClick={handleNext}
              className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                isDark
                  ? "bg-[#1c212b] border-[#252830] text-neutral-200"
                  : "bg-white border-[#d8dde6] text-neutral-800 shadow-sm"
              }`}
            >
              <span>Next Plate</span>
              <ChevronRight className="w-4 h-4 text-[#c8a96e]" />
            </button>
          </div>

          {/* Desktop Drawing Specs summary */}
          <div
            className={`hidden sm:flex items-center gap-3 text-xs min-w-0 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            <span className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
              Plate {currentIndex + 1} of {allProjects.length}
            </span>
            <span>·</span>
            {project.scope ? (
              <span className={`truncate max-w-lg ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                {project.scope}
              </span>
            ) : (
              <span className="font-mono text-neutral-500">MOHALKAR ARCHITECTS ARCHIVE</span>
            )}
          </div>

          {/* Actions: Download Blueprint & WhatsApp Inquiry */}
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadBlueprint}
              disabled={isDownloading}
              className={`w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer active:scale-95 border disabled:opacity-50 ${
                isDark
                  ? "bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] border-[#c8a96e]"
                  : "bg-[#c8a96e] hover:bg-[#b8985c] text-[#0c0e12] border-[#c8a96e] shadow-sm"
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0c0e12]" />
                  <span>Generating Blueprint...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#0c0e12]" />
                  <span>Download Sample Blueprint</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/919146079235?text=${whatsappInquireText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/70 dark:border-emerald-600/50 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Consult on Blueprint</span>
            </a>
          </div>
        </div>

        {/* Modal-level Download Feedback Toast */}
        {(downloadStatus || toastMessage) && (
          <div className="absolute bottom-16 right-4 sm:right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border shadow-2xl backdrop-blur-md ${
                isDark
                  ? "bg-[#141822]/95 border-[#c8a96e]/40 text-white"
                  : "bg-white/95 border-[#c8a96e]/60 text-neutral-900 shadow-xl"
              }`}
            >
              {downloadStatus ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#c8a96e] animate-spin shrink-0" />
                  <span className="text-xs font-medium text-[#c8a96e]">{downloadStatus}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-medium">{toastMessage}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
