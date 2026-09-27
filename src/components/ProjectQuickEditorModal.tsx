import React, { useState } from "react";
import {
  X,
  Save,
  Trash2,
  Upload,
  Plus,
  Layers,
  MapPin,
  Lock,
  Unlock,
  Check,
  CheckCircle2,
  Loader2,
  Sparkles,
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";
import { ProjectItem, PROJECT_CATEGORIES } from "../data/projectsData";
import { STUDIO_DRAWING_PRESETS } from "./AdminDashboard";
import { compressImageFile, compressMultipleImageFiles } from "../utils/imageCompressor";
import {
  getPublishedProjects,
  savePublishedProjects,
  getWorkingProjects,
  saveWorkingProjects,
  logAdminActivity,
  deleteWorkingProject,
  verifyAdminPassword
} from "../utils/projectStorage";
import { useTheme } from "../context/ThemeContext";

interface ProjectQuickEditorModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSaveSuccess?: (updated: ProjectItem) => void;
}

export const ProjectQuickEditorModal: React.FC<ProjectQuickEditorModalProps> = ({
  project,
  onClose,
  onSaveSuccess,
}) => {
  const { isDark } = useTheme();

  // Admin PIN check state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem("mohalkar_admin_session_auth") === "true";
  });
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  // Edit form state
  const [formData, setFormData] = useState<ProjectItem>(() => {
    if (project) {
      return {
        ...project,
        gallery: project.gallery ? [...project.gallery] : [],
      };
    }
    return {
      id: `proj-${Date.now()}`,
      title: "",
      alt: "",
      category: "architecture",
      tag: "ARCHITECTURE",
      image: "/images/project6.jpeg",
      gallery: [],
      featured: true,
      location: "Maharashtra, India",
      scale: "Architectural Spec",
      scope: "Complete Architectural Design & Turnkey Planning",
    };
  });

  const [activeImageTab, setActiveImageTab] = useState<"upload" | "presets" | "url">("upload");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!project) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(pinInput)) {
      sessionStorage.setItem("mohalkar_admin_session_auth", "true");
      setIsAdminUnlocked(true);
      setPinError("");
    } else {
      setPinError("Incorrect security passcode.");
    }
  };

  // Cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessing(true);
      showToast("Optimizing cover image...");
      const compressed = await compressImageFile(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.82 });
      if (compressed) {
        setFormData((prev) => ({ ...prev, image: compressed }));
        showToast("Cover image updated and optimized!");
      }
    } catch {
      showToast("Failed to process cover image.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk multiple site pictures upload
  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setIsProcessing(true);
      showToast(`Optimizing ${files.length} site photos...`);
      const compressed = await compressMultipleImageFiles(files, { maxWidth: 1200, maxHeight: 1200, quality: 0.78 });
      if (compressed.length > 0) {
        setFormData((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...compressed],
        }));
        showToast(`Added ${compressed.length} photos to project gallery!`);
      }
    } catch {
      showToast("Failed to process some gallery photos.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      showToast("Project title is required.");
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Update in published projects
      const published = getPublishedProjects();
      const pubIndex = published.findIndex((p) => p.id === formData.id);
      let updatedPublished: ProjectItem[];
      if (pubIndex !== -1) {
        updatedPublished = [...published];
        updatedPublished[pubIndex] = { ...formData };
      } else {
        updatedPublished = [formData, ...published];
      }
      savePublishedProjects(updatedPublished);

      // 2. Also sync to working projects pipeline
      const working = getWorkingProjects();
      const workIndex = working.findIndex((w) => w.id === formData.id);
      if (workIndex !== -1) {
        working[workIndex] = {
          ...working[workIndex],
          title: formData.title,
          category: formData.category,
          tag: formData.tag,
          image: formData.image,
          gallery: formData.gallery,
          location: formData.location || working[workIndex].location,
          scale: formData.scale || working[workIndex].scale,
          scope: formData.scope || working[workIndex].scope,
          featured: formData.featured,
        };
        saveWorkingProjects(working);
      }

      logAdminActivity({
        type: "edit",
        title: "Website Project Updated",
        description: `Updated project "${formData.title}" (${formData.category}) directly from public website inspector.`,
        targetName: formData.title,
        targetCategory: formData.category,
      });

      // Dispatch global react update event
      window.dispatchEvent(new CustomEvent("mohalkar:projects-updated"));

      if (onSaveSuccess) {
        onSaveSuccess(formData);
      }

      showToast("Project successfully updated on live website!");
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (e) {
      console.error("Failed saving project:", e);
      showToast("Failed to save changes. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to remove "${formData.title}" from the website?`)) {
      return;
    }

    deleteWorkingProject(formData.id);
    logAdminActivity({
      type: "delete",
      title: "Project Removed from Website",
      description: `Removed project "${formData.title}" from active portfolio.`,
      targetName: formData.title,
      targetCategory: formData.category,
    });

    window.dispatchEvent(new CustomEvent("mohalkar:projects-updated"));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
          isDark
            ? "bg-[#11141d] border-[#292f42] text-white"
            : "bg-white border-[#d8dde6] text-neutral-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b shrink-0 ${
            isDark ? "border-[#202535] bg-[#151924]" : "border-neutral-200 bg-neutral-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c8a96e]/20 text-[#c8a96e] flex items-center justify-center border border-[#c8a96e]/40">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg">
                  Edit Existing Project
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c8a96e] text-[#0c0e12] font-bold">
                  Live Site Editor
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Changes saved here reflect immediately on the main portfolio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authentication Screen if not authenticated */}
        {!isAdminUnlocked ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#c8a96e]/20 text-[#c8a96e] flex items-center justify-center border border-[#c8a96e]/40">
              <Lock className="w-7 h-7" />
            </div>
            <div className="max-w-md">
              <h4 className="font-serif font-bold text-lg mb-1">
                Studio Admin Authentication
              </h4>
              <p className="text-xs text-neutral-400">
                Please enter the studio administration passcode to edit this project.
              </p>
            </div>

            <form onSubmit={handleUnlockPin} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                maxLength={32}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                placeholder="Enter Studio Passcode"
                className="w-full text-center tracking-widest text-sm font-mono px-4 py-2.5 rounded-xl border bg-black/40 border-[#31374a] text-white focus:outline-none focus:border-[#c8a96e]"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-rose-400 font-medium">{pinError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Unlock Live Project Editor
              </button>
            </form>
          </div>
        ) : (
          /* Editor Body */
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* 1. Title & Typology */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      alt: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-medium border bg-black/30 border-[#2d3345] focus:border-[#c8a96e] focus:outline-none"
                  placeholder="e.g. Havle Residence & Villa Architecture"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Typology Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                      tag: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-medium border bg-black/30 border-[#2d3345] focus:border-[#c8a96e] focus:outline-none cursor-pointer"
                >
                  {PROJECT_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#151924] text-white">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Scale, Location & Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Built-up Area / Scale
                </label>
                <input
                  type="text"
                  value={formData.scale || ""}
                  onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                  placeholder="e.g. 5,000 sq.ft or 12 Acres"
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-medium border bg-black/30 border-[#2d3345] focus:border-[#c8a96e] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Project Location
                </label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bhoom, Pune, or Dharashiv"
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-medium border bg-black/30 border-[#2d3345] focus:border-[#c8a96e] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Architectural Scope &amp; Engineering Specifications
              </label>
              <textarea
                rows={2}
                value={formData.scope || ""}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                placeholder="Key design features, solar shading louvers, NBC fire codes, structural details..."
                className="w-full px-3.5 py-2 rounded-xl text-xs font-medium border bg-black/30 border-[#2d3345] focus:border-[#c8a96e] focus:outline-none"
              />
            </div>

            {/* 3. Primary Cover Photo Selection */}
            <div className="space-y-2.5 pt-2 border-t border-[#202535]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Primary Cover Drawing Plate</span>
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveImageTab("upload")}
                    className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                      activeImageTab === "upload"
                        ? "bg-[#c8a96e] text-[#0c0e12]"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageTab("presets")}
                    className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                      activeImageTab === "presets"
                        ? "bg-[#c8a96e] text-[#0c0e12]"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Studio Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageTab("url")}
                    className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                      activeImageTab === "url"
                        ? "bg-[#c8a96e] text-[#0c0e12]"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {activeImageTab === "upload" && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-[#232838]">
                  <div className="w-16 h-12 rounded-lg border border-[#c8a96e] overflow-hidden shrink-0 bg-[#161a24]">
                    <img
                      src={formData.image}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="flex-1 border-2 border-dashed border-[#333a4f] hover:border-[#c8a96e] rounded-xl p-3 text-center cursor-pointer transition-colors">
                    <span className="text-xs text-[#c8a96e] font-semibold flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose New Cover Picture / Blueprint</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Automatically compressed &amp; optimized for web
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                  </label>
                </div>
              )}

              {activeImageTab === "presets" && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl bg-black/30 border border-[#232838]">
                  {STUDIO_DRAWING_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`relative aspect-4/3 rounded-lg overflow-hidden border cursor-pointer ${
                        formData.image === preset.url
                          ? "border-[#c8a96e] ring-2 ring-[#c8a96e]"
                          : "border-[#2d3345] opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] p-0.5 text-center text-neutral-300 truncate">
                        {preset.title}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeImageTab === "url" && (
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-mono border bg-black/30 border-[#2d3345] focus:border-[#c8a96e] focus:outline-none"
                />
              )}
            </div>

            {/* 4. Multiple Ongoing Site Progress Photos & Drawing Plates */}
            <div className="space-y-2.5 pt-2 border-t border-[#202535]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#c8a96e]" />
                    <span>Project Photo &amp; Blueprint Gallery</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/30">
                      {(formData.gallery || []).length + 1} Total Views
                    </span>
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    Add ongoing site progress photos, foundation casts, elevations, or CAD drawings.
                  </p>
                </div>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c8a96e]/15 hover:bg-[#c8a96e] text-[#c8a96e] hover:text-[#0c0e12] border border-[#c8a96e]/40 rounded-lg text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto shadow-sm">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Multiple Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleMultipleUpload}
                  />
                </label>
              </div>

              <div className="bg-[#0a0c12] p-3 rounded-xl border border-[#232734]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto pr-1">
                  {/* Primary Cover Thumbnail */}
                  <div className="relative rounded-lg overflow-hidden border border-[#c8a96e] aspect-4/3 bg-[#161a24] shadow">
                    <img
                      src={formData.image}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-[#c8a96e] text-[#0c0e12] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      Cover Plate
                    </div>
                  </div>

                  {/* Gallery Photos */}
                  {(formData.gallery || []).map((picUrl, pIdx) => (
                    <div
                      key={pIdx}
                      className="relative rounded-lg overflow-hidden border border-[#272b38] group aspect-4/3 bg-[#161a24]"
                    >
                      <img
                        src={picUrl}
                        alt={`Photo ${pIdx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-1 left-1 bg-black/75 text-neutral-300 text-[9px] font-mono px-1.5 py-0.5 rounded">
                        #{pIdx + 1}
                      </div>

                      {/* Hover Actions: Make Cover & Delete */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => {
                            const currentCover = formData.image;
                            const updatedGallery = [...(formData.gallery || [])];
                            updatedGallery[pIdx] = currentCover;
                            setFormData({
                              ...formData,
                              image: picUrl,
                              gallery: updatedGallery,
                            });
                            showToast("Set as primary cover plate!");
                          }}
                          className="px-2 py-1 bg-[#c8a96e] text-[#0c0e12] text-[10px] font-bold rounded shadow hover:bg-[#dfc085] cursor-pointer"
                        >
                          Make Cover
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.gallery || []).filter((_, idx) => idx !== pIdx);
                            setFormData({ ...formData, gallery: updated });
                            showToast("Photo removed from gallery.");
                          }}
                          className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-medium rounded hover:bg-rose-500 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {isAdminUnlocked && (
          <div
            className={`flex items-center justify-between px-5 py-3.5 border-t shrink-0 ${
              isDark ? "border-[#202535] bg-[#151924]" : "border-neutral-200 bg-neutral-50"
            }`}
          >
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Live Site</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Site...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="absolute bottom-16 right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c0e12]/95 border border-[#c8a96e] text-white text-xs shadow-2xl backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
