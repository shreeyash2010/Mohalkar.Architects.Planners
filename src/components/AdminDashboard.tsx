import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Users,
  Eye,
  Globe,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  Upload,
  X,
  Lock,
  Unlock,
  Settings,
  Layers,
  Home,
  Building2,
  Trees,
  Search,
  SlidersHorizontal,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Laptop,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  ImageIcon,
  UploadCloud,
  Check,
  Activity,
  History,
  Download,
  ListFilter,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  RotateCcw,
  LayoutGrid,
  ListOrdered,
  KeyRound,
  Key,
  EyeOff,
  Save,
  UserPlus,
  UserCheck,
  UserX,
  UserCog,
  Copy,
  Shield,
  BadgeCheck
} from "lucide-react";
import { ProjectItem, PROJECT_CATEGORIES, PROJECTS_DATA } from "../data/projectsData";
import {
  WorkingProject,
  ViewerInsight,
  ClientEnquiry,
  MOCK_VIEWER_INSIGHTS,
  AdminActivity,
  ActivityActionType,
  AdminUser
} from "../data/adminData";
import {
  getWorkingProjects,
  saveWorkingProjects,
  updateWorkingProject,
  deleteWorkingProject,
  publishProjectToLiveSite,
  unpublishProjectFromLiveSite,
  getClientEnquiries,
  saveClientEnquiries,
  deleteClientEnquiry,
  clearAllEnquiries,
  restoreDemoEnquiries,
  getPublishedProjects,
  savePublishedProjects,
  getStudioAnalytics,
  saveStudioAnalytics,
  getAdminActivities,
  logAdminActivity,
  clearAdminActivities,
  restoreDefaultActivities,
  getAdminPassword,
  verifyAdminPassword,
  saveAdminPassword,
  getAdminUsers,
  saveAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
  verifyAdminUserCredentials,
  getCurrentAdminUser,
  setCurrentAdminUser
} from "../utils/projectStorage";
import { compressImageFile, compressMultipleImageFiles } from "../utils/imageCompressor";
import { SITE_INFO } from "../data/siteData";
import { SeoInspector } from "./SeoInspector";
import { applyMetaTags } from "../utils/metaManager";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

// Architectural blueprints and 3D render asset presets for 1-click selection
export const STUDIO_DRAWING_PRESETS = [
  { url: "/images/project6.jpeg", title: "Modern Villa 3D Perspective", type: "Residential" },
  { url: "/images/project2.jpeg", title: "Glasshouse Contemporary Facade", type: "Residential" },
  { url: "/images/project3.jpg", title: "Commercial Plaza Hub 3D", type: "Commercial" },
  { url: "/images/project1.jpg", title: "High-End Residential Elevation", type: "Residential" },
  { url: "/images/resi1.png", title: "Architectural Floor Plan Blueprint", type: "Working" },
  { url: "/images/resi2.png", title: "Townhouse Row Scheme Elevation", type: "Residential" },
  { url: "/images/commercial1.png", title: "Commercial Mall Floor Plate", type: "Commercial" },
  { url: "/images/landscape9.jpg", title: "Agro-Tourism & NA Layout Master Plan", type: "Landscape" },
  { url: "/images/landscape10.jpg", title: "Botanical Lakefront Master Layout", type: "Landscape" },
  { url: "/images/landscape1.jpg", title: "Contour Land Subdivision Scheme", type: "Landscape" },
  { url: "/images/project7.jpg", title: "Civil Sanction Elevation Drawing", type: "Working" },
  { url: "/images/project8.jpg", title: "Terrace & Courtyard Detail Plan", type: "Residential" },
];

interface AdminDashboardProps {
  onExit: () => void;
  onNavigateToProjects: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExit,
  onNavigateToProjects,
}) => {
  const { isDark } = useTheme();
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("mohalkar_admin_auth") === "true";
  });
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState<
    "projects" | "insights" | "enquiries" | "activity" | "properties" | "security" | "users"
  >("projects");

  // Multi-Admin Users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getAdminUsers());
  const [currentAdminUser, setCurrentAdminUserState] = useState<AdminUser | null>(() => getCurrentAdminUser());
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [editingAdminUser, setEditingAdminUser] = useState<AdminUser | null>(null);
  const [userToDeleteModal, setUserToDeleteModal] = useState<AdminUser | null>(null);
  const [showUserPasswords, setShowUserPasswords] = useState<Record<string, boolean>>({});
  const [selectedLoginUserId, setSelectedLoginUserId] = useState<string>("");
  const [loginUsernameInput, setLoginUsernameInput] = useState<string>("");

  // User Form State for Adding / Editing
  const [userForm, setUserForm] = useState<{
    name: string;
    username: string;
    password: string;
    role: AdminUser["role"];
    accessLevel: AdminUser["accessLevel"];
    email: string;
    phone: string;
    status: "active" | "suspended";
  }>({
    name: "",
    username: "",
    password: "",
    role: "Associate Architect",
    accessLevel: "Project Manager",
    email: "",
    phone: "",
    status: "active",
  });

  // Change Password state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>("");
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>("");
  const [passwordChangeError, setPasswordChangeError] = useState<string>("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string>("");
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);

  // Helper to generate a memorable secure password
  const generateSuggestedPassword = (): string => {
    const prefixes = ["mohalkar", "studio", "arch", "design", "pune", "bhoom"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${randomPrefix}${randomNum}`;
  };

  // Activity Feed & Audit Trail state
  const [activities, setActivities] = useState<AdminActivity[]>(() => getAdminActivities());
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const [activitySearch, setActivitySearch] = useState<string>("");
  const [showActivityConfirmClear, setShowActivityConfirmClear] = useState<boolean>(false);

  // Project management state
  const [workingProjects, setWorkingProjects] = useState<WorkingProject[]>([]);
  const [publishedProjects, setPublishedProjects] = useState<ProjectItem[]>([]);
  const [projectSubFilter, setProjectSubFilter] = useState<
    "all" | "working" | "completed" | "published"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [projectSearch, setProjectSearch] = useState<string>("");

  // Project Display & Drag-and-Drop Reorder state
  const [projectDisplayMode, setProjectDisplayMode] = useState<"pipeline" | "reorder">("pipeline");
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [dragSourceType, setDragSourceType] = useState<"working" | "published">("published");

  // Edit Project Modal state & Image selection tab
  const [editingProject, setEditingProject] = useState<WorkingProject | null>(null);
  const [editImageTab, setEditImageTab] = useState<"upload" | "presets" | "url">("upload");

  // Add Project Modal Image selection tab
  const [addImageTab, setAddImageTab] = useState<"upload" | "presets" | "url">("upload");

  // Delete Project Confirmation Modal state
  const [projectToDelete, setProjectToDelete] = useState<WorkingProject | null>(null);

  // Analytics & Calibration state
  const [analytics, setAnalytics] = useState<ViewerInsight>(() => getStudioAnalytics());
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);
  const [analyticsForm, setAnalyticsForm] = useState<ViewerInsight>(() => getStudioAnalytics());
  const [ga4Id, setGa4Id] = useState<string>(() => {
    return localStorage.getItem("mohalkar_ga4_id") || "";
  });

  // Enquiries state
  const [enquiries, setEnquiries] = useState<ClientEnquiry[]>([]);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>("all");

  // Notification toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "info";
  } | null>(null);

  // New Project Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProjectForm, setNewProjectForm] = useState<{
    title: string;
    category: "residential" | "commercial" | "landscape" | "architecture" | "interior" | "urban" | "working";
    scale: string;
    location: string;
    client: string;
    scope: string;
    image: string;
    gallery: string[];
    status: "working" | "completed" | "published";
    progress: number;
    estimatedBudget: string;
  }>({
    title: "",
    category: "residential",
    scale: "4,500 sq.ft",
    location: "Pune, Maharashtra",
    client: "",
    scope: "Complete Architectural Design & Turnkey Working Blueprints",
    image: "/images/project6.jpeg",
    gallery: [],
    status: "working",
    progress: 75,
    estimatedBudget: "₹75 Lakhs",
  });

  // Load data on mount & whenever updated
  const reloadData = () => {
    setWorkingProjects(getWorkingProjects());
    setPublishedProjects(getPublishedProjects());
    setEnquiries(getClientEnquiries());
    const freshAnalytics = getStudioAnalytics();
    setAnalytics(freshAnalytics);
    setActivities(getAdminActivities());
    setAdminUsers(getAdminUsers());
    setCurrentAdminUserState(getCurrentAdminUser());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("mohalkar:projects-updated", handleUpdate);
    window.addEventListener("mohalkar:analytics-updated", handleUpdate);
    window.addEventListener("mohalkar:enquiries-updated", handleUpdate);
    window.addEventListener("mohalkar:activities-updated", handleUpdate);
    window.addEventListener("mohalkar:admin-users-updated", handleUpdate);
    return () => {
      window.removeEventListener("mohalkar:projects-updated", handleUpdate);
      window.removeEventListener("mohalkar:analytics-updated", handleUpdate);
      window.removeEventListener("mohalkar:enquiries-updated", handleUpdate);
      window.removeEventListener("mohalkar:activities-updated", handleUpdate);
      window.removeEventListener("mohalkar:admin-users-updated", handleUpdate);
    };
  }, []);

  // Dynamically update document title & meta tags based on active admin console tab
  useEffect(() => {
    applyMetaTags({ activeTab: "admin", adminSubTab: activeTab });
  }, [activeTab]);

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle local single image file selection from computer or phone with automatic compression
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose a valid image file (PNG, JPG, WEBP).", "info");
      return;
    }

    try {
      showToast("Optimizing cover image...", "info");
      const compressedDataUrl = await compressImageFile(file, {
        maxWidth: 1400,
        maxHeight: 1400,
        quality: 0.82,
      });
      if (compressedDataUrl) {
        onSuccess(compressedDataUrl);
        showToast("Cover image updated and optimized successfully!");
      }
    } catch (err) {
      console.error("Error compressing cover image:", err);
      showToast("Failed to process image.", "info");
    }
  };

  // Handle uploading multiple site/progress pictures simultaneously with automatic web optimization
  const handleMultipleImagesFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrls: string[]) => void
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      showToast("Please choose valid image files (PNG, JPG, WEBP).", "info");
      return;
    }

    try {
      showToast(`Optimizing ${validFiles.length} site photos for web storage...`, "info");
      const compressedPhotos = await compressMultipleImageFiles(
        validFiles,
        {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.78,
        }
      );

      if (compressedPhotos.length > 0) {
        onSuccess(compressedPhotos);
        showToast(`Successfully added and optimized ${compressedPhotos.length} site photos!`);
      }
    } catch (err) {
      console.error("Error compressing gallery photos:", err);
      showToast("Failed to process some gallery photos.", "info");
    }
  };

  // Delete a single client enquiry
  const handleDeleteEnquiry = (id: string, name: string) => {
    deleteClientEnquiry(id);
    logAdminActivity({
      type: "enquiry",
      title: "Client Enquiry Removed",
      description: `Deleted client enquiry lead from "${name}".`,
      targetName: name,
    });
    reloadData();
    showToast(`Enquiry from "${name}" deleted.`);
  };

  // Clear all demo client enquiries
  const handleClearAllEnquiries = () => {
    clearAllEnquiries();
    logAdminActivity({
      type: "enquiry",
      title: "Enquiries Pipeline Cleared",
      description: "Cleared all demo client enquiries to reset the incoming pipeline.",
    });
    reloadData();
    showToast("All demo client enquiries removed. Pipeline cleared.");
  };

  // Restore demo enquiries for testing
  const handleRestoreDemoEnquiries = () => {
    restoreDemoEnquiries();
    logAdminActivity({
      type: "enquiry",
      title: "Demo Enquiries Restored",
      description: "Restored sample client enquiries for portfolio testing.",
    });
    reloadData();
    showToast("Sample demo client enquiries restored.");
  };

  // Authenticate handler supporting multi-admin accounts with individual passwords
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginUsernameInput.trim() || selectedLoginUserId;
    const authenticatedUser = verifyAdminUserCredentials(identifier, pinInput);

    if (authenticatedUser) {
      sessionStorage.setItem("mohalkar_admin_auth", "true");
      setCurrentAdminUser(authenticatedUser);
      setCurrentAdminUserState(authenticatedUser);
      setIsAuthenticated(true);
      setPinError("");
      showToast(`Welcome ${authenticatedUser.name} (${authenticatedUser.role}). Studio Console unlocked.`);
      logAdminActivity({
        type: "user",
        title: "Admin Console Unlocked",
        description: `${authenticatedUser.name} (${authenticatedUser.role}) logged in successfully.`,
        actor: authenticatedUser.name,
      });
    } else {
      setPinError(
        identifier
          ? `Invalid passcode for "${identifier}". Please verify your credentials.`
          : "Invalid Studio Passcode. Please check your credentials."
      );
    }
  };

  const handleLogout = () => {
    if (currentAdminUser) {
      logAdminActivity({
        type: "user",
        title: "Admin Console Locked",
        description: `${currentAdminUser.name} logged out.`,
        actor: currentAdminUser.name,
      });
    }
    sessionStorage.removeItem("mohalkar_admin_auth");
    setCurrentAdminUser(null);
    setCurrentAdminUserState(null);
    setIsAuthenticated(false);
  };

  // Open Add Admin User Modal
  const handleOpenAddUserModal = () => {
    setUserForm({
      name: "",
      username: "",
      password: generateSuggestedPassword(),
      role: "Associate Architect",
      accessLevel: "Project Manager",
      email: "",
      phone: "",
      status: "active",
    });
    setIsAddUserModalOpen(true);
  };

  // Create new Admin User with custom password
  const handleCreateAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim()) {
      showToast("Please enter the user's full name.", "info");
      return;
    }
    const cleanUsername = userForm.username.trim().toLowerCase().replace(/\s+/g, "");
    if (!cleanUsername) {
      showToast("Please enter a username.", "info");
      return;
    }
    if (adminUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
      showToast(`Username "${cleanUsername}" already exists. Please choose a different username.`, "info");
      return;
    }
    if (!userForm.password.trim() || userForm.password.trim().length < 4) {
      showToast("Password must be at least 4 characters long.", "info");
      return;
    }

    const newUser = addAdminUser({
      ...userForm,
      username: cleanUsername,
    });

    logAdminActivity({
      type: "user",
      title: "New Admin User Created",
      description: `Added administrator "${newUser.name}" (${newUser.role}, Access: ${newUser.accessLevel}) with distinct password.`,
      targetName: newUser.name,
      actor: currentAdminUser?.name || "Super Admin",
    });

    reloadData();
    setIsAddUserModalOpen(false);
    showToast(`🎉 Admin user "${newUser.name}" added successfully!`);
  };

  // Open Edit User Modal
  const handleOpenEditUserModal = (user: AdminUser) => {
    setEditingAdminUser(user);
    setUserForm({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      accessLevel: user.accessLevel,
      email: user.email || "",
      phone: user.phone || "",
      status: user.status,
    });
  };

  // Save changes to existing user (including individual password)
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdminUser) return;

    if (!userForm.name.trim()) {
      showToast("Please enter the user's full name.", "info");
      return;
    }
    if (!userForm.password.trim() || userForm.password.trim().length < 4) {
      showToast("Password must be at least 4 characters long.", "info");
      return;
    }

    const cleanUsername = userForm.username.trim().toLowerCase().replace(/\s+/g, "");
    const duplicate = adminUsers.find(
      (u) => u.id !== editingAdminUser.id && u.username.toLowerCase() === cleanUsername
    );
    if (duplicate) {
      showToast(`Username "${cleanUsername}" already taken by another admin.`, "info");
      return;
    }

    const updated = updateAdminUser(editingAdminUser.id, {
      name: userForm.name.trim(),
      username: cleanUsername,
      password: userForm.password.trim(),
      role: userForm.role,
      accessLevel: userForm.accessLevel,
      email: userForm.email.trim(),
      phone: userForm.phone.trim(),
      status: userForm.status,
    });

    if (updated) {
      logAdminActivity({
        type: "user",
        title: "Admin User Updated",
        description: `Updated profile & credentials for "${userForm.name}".`,
        targetName: userForm.name,
        actor: currentAdminUser?.name || "Super Admin",
      });
      reloadData();
      setEditingAdminUser(null);
      showToast(`Profile & password for "${userForm.name}" updated successfully!`);
    } else {
      showToast("Failed to update user profile.", "info");
    }
  };

  // Toggle user active / suspended status
  const handleToggleUserStatus = (user: AdminUser) => {
    if (user.isDefault && user.status === "active") {
      showToast("Primary Super Admin account cannot be suspended.", "info");
      return;
    }
    const newStatus = user.status === "active" ? "suspended" : "active";
    updateAdminUser(user.id, { status: newStatus });
    logAdminActivity({
      type: "user",
      title: `Admin User ${newStatus === "active" ? "Activated" : "Suspended"}`,
      description: `Changed status of "${user.name}" to ${newStatus}.`,
      targetName: user.name,
      actor: currentAdminUser?.name || "Super Admin",
    });
    reloadData();
    showToast(`User "${user.name}" is now ${newStatus}.`);
  };

  // Delete Admin User
  const handleDeleteUser = (user: AdminUser) => {
    const res = deleteAdminUser(user.id);
    if (res.success) {
      logAdminActivity({
        type: "user",
        title: "Admin User Removed",
        description: `Deleted admin account for "${user.name}".`,
        targetName: user.name,
        actor: currentAdminUser?.name || "Super Admin",
      });
      reloadData();
      setUserToDeleteModal(null);
      showToast(res.message);
    } else {
      showToast(res.message, "info");
    }
  };

  // Change Admin Passcode Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError("");
    setPasswordChangeSuccess("");

    if (!verifyAdminPassword(currentPasswordInput)) {
      setPasswordChangeError("Current passcode is incorrect.");
      return;
    }

    if (newPasswordInput.trim().length < 4) {
      setPasswordChangeError("New passcode must be at least 4 characters long.");
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError("New passcode and confirmation do not match.");
      return;
    }

    const success = saveAdminPassword(newPasswordInput);
    if (success) {
      logAdminActivity({
        type: "edit",
        title: "Security Passcode Changed",
        description: "Studio administration master passcode was successfully updated.",
      });
      setPasswordChangeSuccess("Passcode updated successfully! Use your new passcode for future logins.");
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
      showToast("Studio administration passcode changed successfully!");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordChangeSuccess("");
      }, 1500);
    } else {
      setPasswordChangeError("Failed to update passcode. Please try again.");
    }
  };

  // 1-Click Publish to Live Website!
  const handlePublish = (workingId: string, title: string) => {
    const res = publishProjectToLiveSite(workingId);
    if (res.success) {
      logAdminActivity({
        type: "publish",
        title: "Project Published to Live Site",
        description: `Published "${title}" to the live public architectural portfolio.`,
        targetName: title,
      });
      reloadData();
      showToast(`🎉 "${title}" is now LIVE on the public website!`);
    } else {
      showToast("Unable to publish project. Please retry.", "info");
    }
  };

  // Drag and Drop handlers for Working Projects Pipeline
  const handleWorkingDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    setDragSourceType("working");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleWorkingDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverItemIndex !== index) {
      setDragOverItemIndex(index);
    }
  };

  const handleWorkingDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
      return;
    }

    const updated = [...workingProjects];
    const [removed] = updated.splice(draggedItemIndex, 1);
    updated.splice(dropIndex, 0, removed);

    setWorkingProjects(updated);
    saveWorkingProjects(updated);

    logAdminActivity({
      type: "edit",
      title: "Pipeline Projects Reordered",
      description: `Reordered project "${removed.title}" to position #${dropIndex + 1} in the studio pipeline.`,
      targetName: removed.title,
      targetCategory: removed.category,
    });

    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    showToast(`Moved "${removed.title}" to position #${dropIndex + 1}!`);
  };

  // Drag and Drop handlers for Published Projects (Live Website Display Order)
  const handlePublishedDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    setDragSourceType("published");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handlePublishedDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverItemIndex !== index) {
      setDragOverItemIndex(index);
    }
  };

  const handlePublishedDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
      return;
    }

    const updated = [...publishedProjects];
    const [removed] = updated.splice(draggedItemIndex, 1);
    updated.splice(dropIndex, 0, removed);

    setPublishedProjects(updated);
    savePublishedProjects(updated);

    logAdminActivity({
      type: "publish",
      title: "Live Website Display Order Updated",
      description: `Moved "${removed.title}" to position #${dropIndex + 1} on the live website showcase.`,
      targetName: removed.title,
      targetCategory: removed.category,
    });

    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    showToast(`Reordered! "${removed.title}" is now Plate #${dropIndex + 1} on the live website.`);
  };

  // Quick move single published project
  const handleMovePublishedProject = (index: number, direction: "up" | "down" | "top" | "bottom") => {
    const updated = [...publishedProjects];
    const item = updated[index];
    if (!item) return;

    let newIndex = index;
    if (direction === "up" && index > 0) newIndex = index - 1;
    else if (direction === "down" && index < updated.length - 1) newIndex = index + 1;
    else if (direction === "top") newIndex = 0;
    else if (direction === "bottom") newIndex = updated.length - 1;

    if (newIndex === index) return;

    updated.splice(index, 1);
    updated.splice(newIndex, 0, item);

    setPublishedProjects(updated);
    savePublishedProjects(updated);

    logAdminActivity({
      type: "publish",
      title: "Live Website Display Order Updated",
      description: `Moved "${item.title}" to position #${newIndex + 1} on the live website.`,
      targetName: item.title,
      targetCategory: item.category,
    });

    showToast(`Moved "${item.title}" to position #${newIndex + 1}!`);
  };

  // Quick move single working project in pipeline
  const handleMoveWorkingProject = (index: number, direction: "up" | "down" | "top" | "bottom") => {
    const updated = [...workingProjects];
    const item = updated[index];
    if (!item) return;

    let newIndex = index;
    if (direction === "up" && index > 0) newIndex = index - 1;
    else if (direction === "down" && index < updated.length - 1) newIndex = index + 1;
    else if (direction === "top") newIndex = 0;
    else if (direction === "bottom") newIndex = updated.length - 1;

    if (newIndex === index) return;

    updated.splice(index, 1);
    updated.splice(newIndex, 0, item);

    setWorkingProjects(updated);
    saveWorkingProjects(updated);

    logAdminActivity({
      type: "edit",
      title: "Pipeline Projects Reordered",
      description: `Moved "${item.title}" to position #${newIndex + 1} in the studio pipeline.`,
      targetName: item.title,
      targetCategory: item.category,
    });

    showToast(`Moved "${item.title}" to position #${newIndex + 1}!`);
  };

  const handleResetPublishedOrder = () => {
    if (!confirm("Reset public website project sequence to standard architectural portfolio order?")) return;
    const initial = PROJECTS_DATA;
    savePublishedProjects(initial);
    setPublishedProjects(getPublishedProjects());
    logAdminActivity({
      type: "publish",
      title: "Live Display Order Reset",
      description: "Reset project sequence on public website to standard studio curation.",
    });
    showToast("Public website project order reset to standard curation.");
  };

  // Open Edit Modal for any published project directly from Live Site Display Order
  const handleEditPublishedProject = (project: ProjectItem) => {
    const normalize = (str?: string) => (str || "").toLowerCase().trim();
    const existingWorking = workingProjects.find(
      (w) => w.id === project.id || (w.title && project.title && normalize(w.title) === normalize(project.title))
    );

    if (existingWorking) {
      setEditingProject(existingWorking);
    } else {
      const converted: WorkingProject = {
        id: project.id,
        title: project.title,
        alt: project.alt || project.title,
        category: project.category,
        tag: project.tag || project.category.toUpperCase(),
        image: project.image,
        gallery: project.gallery || [],
        featured: project.featured ?? true,
        location: project.location || "Maharashtra, India",
        scale: project.scale || "Architectural Spec",
        scope: project.scope || "Complete Architectural Design & Turnkey Working Blueprints",
        status: "published",
        progress: 100,
        stage: "Published",
        client: project.client || "Studio Client",
        notes: "Live website portfolio project plate",
        startDate: "2024",
        areaSqFt: project.scale,
      };
      setEditingProject(converted);
    }
  };

  // Unpublish project
  const handleUnpublish = (projectId: string, title: string) => {
    unpublishProjectFromLiveSite(projectId, title);
    logAdminActivity({
      type: "unpublish",
      title: "Project Unpublished from Live",
      description: `Unpublished "${title}" from live website and returned to working drafts.`,
      targetName: title,
    });
    reloadData();
    showToast(`"${title}" has been unpublished and moved to working drafts.`);
  };

  // Mark working project as completed
  const handleMarkCompleted = (workingId: string) => {
    const list = [...workingProjects];
    const item = list.find((p) => p.id === workingId);
    if (item) {
      item.status = "completed";
      item.stage = "Completed";
      item.progress = 100;
      saveWorkingProjects(list);
      setWorkingProjects(list);
      logAdminActivity({
        type: "status_change",
        title: "Status Toggled to Completed",
        description: `Toggled status of "${item.title}" to Completed (100% drawings verified, ready to publish).`,
        targetName: item.title,
        targetCategory: item.category,
      });
      showToast(`"${item.title}" marked as Completed. Ready to publish!`);
    }
  };

  // Quick status toggling between "working" | "completed" | "published"
  const handleQuickStatusToggle = (
    project: WorkingProject,
    nextStatus: "working" | "completed" | "published"
  ) => {
    if (project.status === nextStatus) return;
    const prevStatus = project.status;
    const list = [...workingProjects];
    const idx = list.findIndex((p) => p.id === project.id);
    if (idx === -1) return;

    const updatedItem: WorkingProject = { ...list[idx] };
    updatedItem.status = nextStatus;

    if (nextStatus === "published") {
      updatedItem.progress = 100;
      updatedItem.stage = "Published";
      list[idx] = updatedItem;
      saveWorkingProjects(list);
      publishProjectToLiveSite(project.id);
      logAdminActivity({
        type: "status_change",
        title: "Status Toggled to Published",
        description: `Toggled status of "${project.title}" from ${prevStatus.toUpperCase()} to PUBLISHED (now live in portfolio).`,
        targetName: project.title,
        targetCategory: project.category,
      });
      showToast(`Status toggled: "${project.title}" is now LIVE!`);
    } else if (nextStatus === "completed") {
      updatedItem.progress = 100;
      updatedItem.stage = "Completed";
      list[idx] = updatedItem;
      saveWorkingProjects(list);
      if (prevStatus === "published") {
        unpublishProjectFromLiveSite(project.id, project.title);
      }
      logAdminActivity({
        type: "status_change",
        title: "Status Toggled to Completed",
        description: `Toggled status of "${project.title}" from ${prevStatus.toUpperCase()} to COMPLETED (Ready to Publish).`,
        targetName: project.title,
        targetCategory: project.category,
      });
      showToast(`Status toggled: "${project.title}" set to Completed.`);
    } else {
      // "working"
      updatedItem.progress = updatedItem.progress === 100 ? 75 : updatedItem.progress;
      updatedItem.stage = "Working Drawings";
      list[idx] = updatedItem;
      saveWorkingProjects(list);
      if (prevStatus === "published") {
        unpublishProjectFromLiveSite(project.id, project.title);
      }
      logAdminActivity({
        type: "status_change",
        title: "Status Toggled to Working",
        description: `Toggled status of "${project.title}" from ${prevStatus.toUpperCase()} to WORKING (Drafts & Sanctions in progress).`,
        targetName: project.title,
        targetCategory: project.category,
      });
      showToast(`Status toggled: "${project.title}" moved to Working pipeline.`);
    }
    reloadData();
  };

  // Handle Save Edited Project
  const handleSaveEditedProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const prevStatus = editingProject.status;

    // Normalize progress based on stage
    let progress = editingProject.progress;
    let status = editingProject.status;
    if (editingProject.stage === "Completed" && status !== "published") {
      status = "completed";
      progress = 100;
    } else if (editingProject.stage === "Published") {
      status = "published";
      progress = 100;
    }

    const updated: WorkingProject = {
      ...editingProject,
      status,
      progress,
      tag: editingProject.category.charAt(0).toUpperCase() + editingProject.category.slice(1),
    };

    updateWorkingProject(updated);

    const statusChanged = prevStatus !== status;
    if (statusChanged) {
      logAdminActivity({
        type: "status_change",
        title: `Status Updated to ${status.toUpperCase()}`,
        description: `Updated status of "${updated.title}" from ${prevStatus.toUpperCase()} to ${status.toUpperCase()} (${updated.stage}, ${progress}% progress).`,
        targetName: updated.title,
        targetCategory: updated.category,
      });
    } else {
      logAdminActivity({
        type: "edit",
        title: "Project Specifications Updated",
        description: `Saved edits for "${updated.title}" (${updated.scale || "Project Space"}, ${updated.stage}).`,
        targetName: updated.title,
        targetCategory: updated.category,
      });
    }

    reloadData();
    setEditingProject(null);
    showToast(`Project "${updated.title}" updated successfully.`);
  };

  // Handle Delete Confirmed
  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    deleteWorkingProject(projectToDelete.id);
    logAdminActivity({
      type: "delete",
      title: "Project Deleted",
      description: `Deleted "${projectToDelete.title}" (${projectToDelete.category}) from working pipeline & live site.`,
      targetName: projectToDelete.title,
      targetCategory: projectToDelete.category,
    });
    reloadData();
    showToast(`Project "${projectToDelete.title}" deleted.`);
    setProjectToDelete(null);
  };

  // Handle Analytics Calibration Save
  const handleSaveAnalytics = (e: React.FormEvent) => {
    e.preventDefault();
    saveStudioAnalytics(analyticsForm);
    setAnalytics(analyticsForm);
    if (ga4Id.trim()) {
      localStorage.setItem("mohalkar_ga4_id", ga4Id.trim());
    } else {
      localStorage.removeItem("mohalkar_ga4_id");
    }
    logAdminActivity({
      type: "analytics",
      title: "Telemetry Calibrated",
      description: `Calibrated metrics to ${analyticsForm.totalPageViews.toLocaleString()} views, ${analyticsForm.uniqueVisitors.toLocaleString()} unique visitors.`,
    });
    setIsAnalyticsModalOpen(false);
    showToast("Analytics calibrated and saved successfully!");
  };

  // Reset Analytics to Baseline
  const handleResetAnalytics = () => {
    saveStudioAnalytics(MOCK_VIEWER_INSIGHTS);
    setAnalytics(MOCK_VIEWER_INSIGHTS);
    setAnalyticsForm(MOCK_VIEWER_INSIGHTS);
    logAdminActivity({
      type: "analytics",
      title: "Telemetry Reset to Baseline",
      description: "Studio telemetry and visitor numbers reset to benchmark baseline.",
    });
    setIsAnalyticsModalOpen(false);
    showToast("Analytics reset to studio baseline.");
  };

  // Create new project handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title.trim()) return;

    const newId = `work-${Date.now()}`;
    const newWorking: WorkingProject = {
      id: newId,
      title: newProjectForm.title,
      alt: newProjectForm.title,
      category: newProjectForm.category,
      tag: newProjectForm.category.charAt(0).toUpperCase() + newProjectForm.category.slice(1),
      image: newProjectForm.image,
      featured: true,
      location: newProjectForm.location,
      scale: newProjectForm.scale,
      scope: newProjectForm.scope,
      status: newProjectForm.status,
      progress: newProjectForm.status === "completed" || newProjectForm.status === "published" ? 100 : newProjectForm.progress,
      stage: newProjectForm.status === "completed" ? "Completed" : newProjectForm.status === "published" ? "Published" : "Working Drawings",
      client: newProjectForm.client || "Studio Client",
      startDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      areaSqFt: newProjectForm.scale,
      estimatedBudget: newProjectForm.estimatedBudget,
      gallery: newProjectForm.gallery || [],
      notes: "Created via Executive Studio Console",
    };

    const updated = [newWorking, ...workingProjects];
    saveWorkingProjects(updated);
    setWorkingProjects(updated);

    logAdminActivity({
      type: "create",
      title: "New Project Created",
      description: `Created new ${newProjectForm.category} project "${newProjectForm.title}" with ${(newProjectForm.gallery || []).length + 1} site drawings/photos (${newProjectForm.scale || "Project Space"}).`,
      targetName: newProjectForm.title,
      targetCategory: newProjectForm.category,
    });

    if (newProjectForm.status === "published") {
      publishProjectToLiveSite(newId);
      logAdminActivity({
        type: "publish",
        title: "Published to Live Portfolio",
        description: `Published "${newProjectForm.title}" directly to live website portfolio.`,
        targetName: newProjectForm.title,
        targetCategory: newProjectForm.category,
      });
    }

    setIsAddModalOpen(false);
    showToast(
      newProjectForm.status === "published"
        ? `🎉 "${newProjectForm.title}" published directly to live website!`
        : `New project "${newProjectForm.title}" added to studio working pipeline.`
    );

    setNewProjectForm({
      title: "",
      category: "residential",
      scale: "4,500 sq.ft",
      location: "Pune, Maharashtra",
      client: "",
      scope: "Complete Architectural Design & Turnkey Working Blueprints",
      image: "/images/project6.jpeg",
      gallery: [],
      status: "working",
      progress: 75,
      estimatedBudget: "₹75 Lakhs",
    });
  };

  // Activity Log Actions
  const handleClearActivities = () => {
    clearAdminActivities();
    setActivities([]);
    setShowActivityConfirmClear(false);
    showToast("Activity history cleared.");
  };

  const handleRestoreDefaultActivities = () => {
    restoreDefaultActivities();
    setActivities(getAdminActivities());
    showToast("Sample activity audit trail restored.");
  };

  const handleExportActivityLog = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `mohalkar-activity-audit-${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Audit log exported as JSON.");
  };

  // Filtered and searched activities for the feed
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesType =
        activityTypeFilter === "all" || act.type === activityTypeFilter;
      const q = activitySearch.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        (act.targetName && act.targetName.toLowerCase().includes(q)) ||
        (act.targetCategory && act.targetCategory.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [activities, activityTypeFilter, activitySearch]);

  const activityStats = useMemo(() => {
    const total = activities.length;
    const statusChanges = activities.filter((a) => a.type === "status_change").length;
    const creates = activities.filter((a) => a.type === "create").length;
    const publishes = activities.filter((a) => a.type === "publish" || a.type === "unpublish").length;
    const deletes = activities.filter((a) => a.type === "delete").length;
    const others = activities.filter(
      (a) => a.type === "edit" || a.type === "enquiry" || a.type === "analytics"
    ).length;
    return { total, statusChanges, creates, publishes, deletes, others };
  }, [activities]);

  const getActivityBadge = (type: ActivityActionType) => {
    switch (type) {
      case "create":
        return {
          icon: <Plus className="w-3.5 h-3.5 text-emerald-400" />,
          bgColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          label: "PROJECT CREATED",
        };
      case "status_change":
        return {
          icon: <RefreshCw className="w-3.5 h-3.5 text-amber-400" />,
          bgColor: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          label: "STATUS TOGGLE",
        };
      case "publish":
        return {
          icon: <Globe className="w-3.5 h-3.5 text-[#c8a96e]" />,
          bgColor: "bg-[#c8a96e]/10 border-[#c8a96e]/30 text-[#c8a96e]",
          label: "PUBLISHED LIVE",
        };
      case "unpublish":
        return {
          icon: <Lock className="w-3.5 h-3.5 text-orange-400" />,
          bgColor: "bg-orange-500/10 border-orange-500/30 text-orange-400",
          label: "UNPUBLISHED",
        };
      case "delete":
        return {
          icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
          bgColor: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          label: "DELETED",
        };
      case "edit":
        return {
          icon: <Edit className="w-3.5 h-3.5 text-blue-400" />,
          bgColor: "bg-blue-500/10 border-blue-500/30 text-blue-400",
          label: "UPDATED",
        };
      case "enquiry":
        return {
          icon: <MessageCircle className="w-3.5 h-3.5 text-purple-400" />,
          bgColor: "bg-purple-500/10 border-purple-500/30 text-purple-400",
          label: "ENQUIRY",
        };
      case "analytics":
        return {
          icon: <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />,
          bgColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
          label: "TELEMETRY",
        };
      default:
        return {
          icon: <Activity className="w-3.5 h-3.5 text-neutral-400" />,
          bgColor: "bg-neutral-800 border-neutral-700 text-neutral-300",
          label: "ACTION",
        };
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return "Just now";
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getExactTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Filtered working projects
  const filteredWorkingProjects = useMemo(() => {
    return workingProjects.filter((p) => {
      const matchesSubFilter =
        projectSubFilter === "all" || p.status === projectSubFilter;
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      const q = projectSearch.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.client && p.client.toLowerCase().includes(q));
      return matchesSubFilter && matchesCategory && matchesSearch;
    });
  }, [workingProjects, projectSubFilter, categoryFilter, projectSearch]);

  // Counts for pipeline
  const stats = useMemo(() => {
    const totalWorking = workingProjects.filter((p) => p.status === "working").length;
    const totalCompleted = workingProjects.filter((p) => p.status === "completed").length;
    const totalPublished = publishedProjects.length;
    return { totalWorking, totalCompleted, totalPublished };
  }, [workingProjects, publishedProjects]);

  // If not authenticated, show PIN Gate
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 selection:bg-[#c8a96e] transition-colors ${
          isDark
            ? "bg-[#080a0f] text-[#e2e4e8] selection:text-[#0c0e12]"
            : "bg-[#f8f9fb] text-[#181a20] selection:text-white"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border transition-colors ${
            isDark ? "bg-[#12151e] border-[#252835]" : "bg-white border-[#dce2ec]"
          }`}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#c8a96e]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Quick Theme Toggle Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>

          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-6">
            <div
              className={`w-12 h-12 mx-auto rounded-xl border flex items-center justify-center text-[#c8a96e] shadow-inner ${
                isDark ? "bg-[#1a1e2b] border-[#c8a96e]/40" : "bg-[#f8f9fc] border-[#c8a96e]/60"
              }`}
            >
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c8a96e] font-bold">
                MOHALKAR ARCHITECTS &amp; PLANNERS
              </span>
              <h1
                className={`font-serif text-2xl font-bold ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Executive Studio Console
              </h1>
              <p
                className={`text-xs ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Enter your administrative credentials to unlock the Studio Console.
              </p>
            </div>
          </div>

          {/* PIN / Password Input Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className={`text-xs font-semibold flex items-center justify-between ${
                  isDark ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                <span>Admin Username (Optional)</span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {loginUsernameInput ? `@${loginUsernameInput}` : "Any active admin"}
                </span>
              </label>
              <input
                type="text"
                placeholder="Username (e.g. abhishek, shreeyash, manager)"
                value={loginUsernameInput}
                onChange={(e) => {
                  setLoginUsernameInput(e.target.value);
                  setSelectedLoginUserId("");
                  setPinError("");
                }}
                className={`w-full px-3.5 py-2 rounded-xl text-xs focus:outline-none transition-colors border ${
                  isDark
                    ? "bg-[#0d0f15] border-[#272b38] text-white placeholder-neutral-500 focus:border-[#c8a96e]"
                    : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400 focus:border-[#c8a96e]"
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label
                className={`text-xs font-semibold flex items-center justify-between ${
                  isDark ? "text-neutral-300" : "text-neutral-700"
                }`}
              >
                <span>Individual User Password / Passcode *</span>
                <span className="text-[11px] text-[#c8a96e] font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Distinct Passcode
                </span>
              </label>
              <input
                type="password"
                placeholder="Enter your individual password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                autoFocus
                className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors border font-mono ${
                  isDark
                    ? "bg-[#0d0f15] border-[#272b38] text-white placeholder-neutral-500 focus:border-[#c8a96e]"
                    : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400 focus:border-[#c8a96e]"
                }`}
              />
              {pinError && (
                <p className="text-xs text-rose-500 flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                className="w-full py-3 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-98"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Executive Console</span>
              </button>

              <button
                type="button"
                onClick={onExit}
                className={`w-full py-2.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? "bg-transparent hover:bg-[#1a1e28] text-neutral-400 hover:text-white border-[#252835]"
                    : "bg-[#f4f6fa] hover:bg-[#e8ecf4] text-neutral-700 hover:text-black border-[#d8dde6]"
                }`}
              >
                Return to Public Website
              </button>
            </div>
          </form>

          <div
            className={`mt-6 pt-4 border-t text-center text-[11px] flex items-center justify-center gap-1.5 ${
              isDark ? "border-[#1e232f] text-neutral-500" : "border-[#e5e9f0] text-neutral-500"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#c8a96e]" />
            <span>Authorized access only · Pune &amp; Bhoom Studio Administration</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-[#c8a96e] transition-colors ${
        isDark
          ? "bg-[#090b10] text-[#e2e4e8] selection:text-[#0c0e12]"
          : "bg-[#f8f9fb] text-[#181a20] selection:text-white"
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 border ${
            isDark
              ? "bg-[#141824] border-[#c8a96e] text-white"
              : "bg-white border-[#c8a96e] text-neutral-900 shadow-xl"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#c8a96e] shrink-0" />
          <span className="text-xs font-medium">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className={`ml-2 p-1 cursor-pointer ${
              isDark ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black"
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── TOP EXECUTIVE APP BAR ────────────────────── */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-colors ${
          isDark
            ? "bg-[#0e1118]/95 border-[#1e2330]"
            : "bg-white/95 border-[#e2e6ee] shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Studio Brand & Badge */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center text-[#c8a96e] shrink-0 ${
                isDark
                  ? "bg-[#181d28] border-[#c8a96e]/50"
                  : "bg-[#f4f6fa] border-[#c8a96e]/60"
              }`}
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                <span
                  className={`font-serif text-sm sm:text-lg font-bold tracking-wide truncate ${
                    isDark ? "text-white" : "text-neutral-900"
                  }`}
                >
                  <span className="hidden sm:inline">Mohalkar Executive Console</span>
                  <span className="sm:hidden">Executive Console</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-mono font-bold bg-[#c8a96e]/20 text-[#8c6d32] dark:text-[#c8a96e] border border-[#c8a96e]/40 shrink-0">
                  ADMIN
                </span>
              </div>
              <p
                className={`text-[11px] hidden md:block truncate ${
                  isDark ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                Principal Architect Abhishek Mohalkar · Working Pipeline &amp; Site Publishing
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Global Theme Toggler for Admin */}
            <ThemeToggle />

            {/* Quick Add Admin User Button with Distinct Passcode */}
            <button
              onClick={handleOpenAddUserModal}
              className="px-2.5 sm:px-3 sm:py-1.5 bg-[#c8a96e]/15 hover:bg-[#c8a96e] text-[#c8a96e] hover:text-[#0c0e12] border border-[#c8a96e]/40 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Add New Admin User with Individual Password"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Admin User</span>
              <span className="sm:hidden">Add Admin</span>
            </button>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className={`p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? "bg-[#161a24] hover:bg-[#1f2433] text-neutral-300 hover:text-white border-[#252936]"
                  : "bg-[#f4f6fa] hover:bg-[#e8ecf4] text-neutral-700 hover:text-black border-[#d8dde6] shadow-sm"
              }`}
              title="Change Studio Administration Passcode"
            >
              <KeyRound className="w-4 h-4 text-[#c8a96e]" />
              <span className="hidden md:inline">Change Passcode</span>
            </button>

            <button
              onClick={onNavigateToProjects}
              className={`p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? "bg-[#161a24] hover:bg-[#1f2433] text-neutral-300 hover:text-white border-[#252936]"
                  : "bg-[#f4f6fa] hover:bg-[#e8ecf4] text-neutral-700 hover:text-black border-[#d8dde6] shadow-sm"
              }`}
              title="Preview public projects grid"
            >
              <ExternalLink className="w-4 h-4 text-[#c8a96e]" />
              <span className="hidden md:inline">Live Projects</span>
            </button>

            <button
              onClick={onExit}
              className="px-2.5 sm:px-3.5 py-1.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Return to website homepage"
            >
              <span className="hidden sm:inline">Exit Console</span>
              <span className="sm:hidden">Exit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className={`p-2 sm:p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? "text-neutral-400 hover:text-rose-400 hover:bg-[#1a1e28]"
                  : "text-neutral-500 hover:text-rose-600 hover:bg-rose-50"
              }`}
              title="Lock & Log out"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="max-w-7xl mx-auto pt-2.5 sm:pt-3 flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none text-xs -mx-3 px-3 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-2 px-1.5 sm:px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "projects"
                ? "border-[#c8a96e] text-[#c8a96e] font-semibold"
                : isDark
                ? "border-transparent text-neutral-400 hover:text-white"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Projects &amp; Publishing</span>
            <span className="sm:hidden">Projects</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isDark
                  ? "bg-[#1b202c] text-neutral-300"
                  : "bg-[#eef2f8] text-neutral-700"
              }`}
            >
              {stats.totalCompleted}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`pb-2 px-1.5 sm:px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "users"
                ? "border-[#c8a96e] text-[#c8a96e] font-semibold"
                : isDark
                ? "border-transparent text-neutral-400 hover:text-white"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Users &amp; Passwords</span>
            <span className="sm:hidden">Users</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono border ${
                isDark
                  ? "bg-[#1b202c] text-[#c8a96e] border-[#c8a96e]/30"
                  : "bg-[#fef8ee] text-[#8c6d32] border-[#c8a96e]/40"
              }`}
            >
              {adminUsers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("insights")}
            className={`pb-2 px-1.5 sm:px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "insights"
                ? "border-[#c8a96e] text-[#c8a96e] font-semibold"
                : isDark
                ? "border-transparent text-neutral-400 hover:text-white"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Viewer Insights &amp; Analytics</span>
            <span className="sm:hidden">Analytics</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab("enquiries")}
            className={`pb-2 px-1.5 sm:px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "enquiries"
                ? "border-[#c8a96e] text-[#c8a96e] font-semibold"
                : isDark
                ? "border-transparent text-neutral-400 hover:text-white"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Client Enquiries</span>
            <span className="sm:hidden">Enquiries</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-mono">
              {enquiries.filter((e) => e.status === "new").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-2 px-1.5 sm:px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "activity"
                ? "border-[#c8a96e] text-[#c8a96e] font-semibold"
                : isDark
                ? "border-transparent text-neutral-400 hover:text-white"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Recent Activity Feed</span>
            <span className="sm:hidden">Activity</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono border ${
                isDark
                  ? "bg-[#1b202c] text-[#c8a96e] border-[#c8a96e]/30"
                  : "bg-[#fef8ee] text-[#8c6d32] border-[#c8a96e]/40"
              }`}
            >
              {activities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("properties")}
            className={`pb-2 px-1.5 sm:px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "properties"
                ? "border-[#c8a96e] text-[#c8a96e] font-semibold"
                : isDark
                ? "border-transparent text-neutral-400 hover:text-white"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Website Properties &amp; Health</span>
            <span className="sm:hidden">Properties</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-2 px-1.5 sm:px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === "security"
                ? "border-[#c8a96e] text-[#c8a96e] font-semibold"
                : isDark
                ? "border-transparent text-neutral-400 hover:text-white"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Security &amp; Passcode</span>
            <span className="sm:hidden">Security</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONSOLE CONTENT ───────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* ════════════════════════════════════════════
            TAB 1: PROJECTS WORKING & PUBLISHING SUITE
           ════════════════════════════════════════════ */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Pipeline KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl flex items-center justify-between transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                    In Progress / Working Drawings
                  </span>
                  <div className={`text-2xl font-bold font-serif mt-0.5 ${isDark ? "text-white" : "text-neutral-900"}`}>

                    {stats.totalWorking} Projects
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Design drafting, structural &amp; site execution
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-4 rounded-xl flex items-center justify-between shadow-lg transition-colors border ${
                isDark ? "bg-[#12151f] border-emerald-500/30 shadow-emerald-500/5" : "bg-white border-emerald-500/40 shadow-emerald-500/10"
              }`}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                      Completed &amp; Ready to Publish
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-emerald-300 mt-0.5">
                    {stats.totalCompleted} Projects
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-1">
                    Drawings verified. 1-click publishing enabled.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-4 rounded-xl flex items-center justify-between transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                    Live on Website Portfolio
                  </span>
                  <div className="text-2xl font-bold font-serif text-[#c8a96e] mt-0.5">
                    {stats.totalPublished} Plates
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Publicly visible in Residential, Commercial &amp; Landscape
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/20 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Recent Activity Feed Widget */}
            <div className={`p-4 rounded-xl space-y-3 shadow-lg transition-colors border ${
              isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#c8a96e]/10 border border-[#c8a96e]/40 flex items-center justify-center text-[#c8a96e]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-neutral-900"}`}>
                        Recent Studio Activity Feed
                      </h4>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1c2130] text-[#c8a96e] border border-[#c8a96e]/30 hidden sm:inline-block">
                        LIVE LOG
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Real-time visibility into project creations, deletions, status toggles, and live site publishing.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isDark
                      ? "bg-[#181d28] hover:bg-[#222738] text-[#c8a96e] hover:text-[#dfc085] border-[#c8a96e]/30"
                      : "bg-[#fef8ee] hover:bg-[#faeed8] text-[#8c6d32] border-[#c8a96e]/40 shadow-sm"
                  }`}
                  >
                    <span>Open Full Activity Audit ({activities.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Latest 3 Activity Items */}
              {activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {activities.slice(0, 3).map((act) => {
                    const badge = getActivityBadge(act.type);
                    return (
                      <div
                        key={act.id}
                        onClick={() => setActiveTab("activity")}
                        className={`p-3 rounded-lg flex items-start gap-2.5 transition-all text-xs cursor-pointer group border ${
                        isDark
                          ? "bg-[#0b0d14] border-[#1e2330] hover:border-[#c8a96e]/40"
                          : "bg-[#f8f9fc] border-[#e2e6ee] hover:border-[#c8a96e]/60 shadow-sm"
                      }`}
                      >
                        <div className={`p-1.5 rounded-md border shrink-0 ${badge.bgColor}`}>
                          {badge.icon}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-neutral-300 font-semibold truncate">
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                              {getRelativeTime(act.timestamp)}
                            </span>
                          </div>
                          <p className="text-neutral-300 text-[11px] line-clamp-2 leading-relaxed group-hover:text-white transition-colors">
                            {act.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-neutral-500 bg-[#0a0c12] rounded-lg border border-[#1e2330]">
                  No activities logged yet. Actions like project creation, deletion, or status toggling will stream here automatically.
                </div>
              )}
            </div>

            {/* Filter & Action Controls Bar + Drag & Drop Mode Switcher */}
            <div className={`p-3 sm:p-4 rounded-xl flex flex-col gap-3 transition-colors border ${
              isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
            }`}>
              {/* Top Row: View Mode Switcher + Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-[#1e2330] pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase tracking-wider hidden sm:inline">
                    View Mode:
                  </span>
                  <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border w-full sm:w-auto transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f0f3f8] border-[#d8dde6]"
                  }`}>
                    <button
                      type="button"
                      onClick={() => setProjectDisplayMode("pipeline")}
                      className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                        projectDisplayMode === "pipeline"
                          ? "bg-[#c8a96e] text-[#0c0e12] shadow"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Pipeline Cards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjectDisplayMode("reorder")}
                      className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                        projectDisplayMode === "reorder"
                          ? "bg-[#c8a96e] text-[#0c0e12] shadow"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Live Reorder</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#0c0e12]/40 text-[9px] font-mono font-bold shrink-0">
                        {publishedProjects.length}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {projectDisplayMode === "reorder" && (
                    <button
                      type="button"
                      onClick={handleResetPublishedOrder}
                      className={`flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isDark
                          ? "bg-[#181d28] hover:bg-[#222738] text-neutral-300 hover:text-white border-[#2c3244]"
                          : "bg-white hover:bg-[#f0f3f8] text-neutral-700 hover:text-neutral-900 border-[#d0d6e2] shadow-sm"
                      }`}
                      title="Reset project order to default studio curation"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>Reset Order</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex-1 sm:flex-initial justify-center px-3.5 py-2 sm:py-1.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>New Project</span>
                  </button>
                </div>
              </div>

              {/* Bottom Row: Status Filter Pills + Search Bar */}
              {projectDisplayMode === "pipeline" && (
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
                    <button
                      onClick={() => setProjectSubFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                        projectSubFilter === "all"
                          ? "bg-[#c8a96e] text-[#0c0e12] font-semibold"
                          : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                      }`}
                    >
                      All ({workingProjects.length})
                    </button>
                    <button
                      onClick={() => setProjectSubFilter("working")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        projectSubFilter === "working"
                          ? "bg-blue-500 text-white font-semibold"
                          : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                      }`}
                    >
                      <span>Working</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-black/30">
                        {stats.totalWorking}
                      </span>
                    </button>
                    <button
                      onClick={() => setProjectSubFilter("completed")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        projectSubFilter === "completed"
                          ? "bg-emerald-500 text-black font-semibold"
                          : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                      }`}
                    >
                      <span>Ready</span>
                      <span className="text-[10px] font-mono px-1.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">
                        {stats.totalCompleted}
                      </span>
                    </button>
                    <button
                      onClick={() => setProjectSubFilter("published")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                        projectSubFilter === "published"
                          ? "bg-[#c8a96e] text-[#0c0e12] font-semibold"
                          : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                      }`}
                    >
                      Published ({workingProjects.filter((p) => p.status === "published").length})
                    </button>
                  </div>

                  {/* Typology Dropdown & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className={`text-xs rounded-lg px-2.5 py-2 focus:border-[#c8a96e] focus:outline-none w-full sm:w-auto cursor-pointer border transition-colors ${
                        isDark
                          ? "bg-[#181c27] border-[#252936] text-white"
                          : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                      }`}
                    >
                      <option value="all">All Typologies</option>
                      <option value="residential">Residential Only</option>
                      <option value="commercial">Commercial Only</option>
                      <option value="landscape">Landscape Only</option>
                    </select>

                    <div className="relative w-full sm:w-48">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className={`w-full pl-8 pr-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-[#c8a96e] transition-colors ${
                          isDark
                            ? "bg-[#181c27] border-[#252936] text-white placeholder-neutral-500"
                            : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* VIEW A: DEDICATED LIVE SITE DISPLAY REORDERING WORKSPACE (DRAG & DROP) */}
            {projectDisplayMode === "reorder" && (
              <div className={`rounded-xl p-3 sm:p-5 lg:p-6 space-y-4 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                {/* Header Banner */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#202535]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                  }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-neutral-900"}`}>

                        Live Website Project Sequence
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/40 text-[9px] sm:text-[10px] font-mono font-bold">
                        DRAG &amp; DROP ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Drag projects or use the arrow buttons to change display order on the live website. Changes apply immediately in real time.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#c8a96e] font-mono bg-[#161a26] px-3 py-1.5 rounded-lg border border-[#c8a96e]/30 self-start sm:self-auto shrink-0">
                    <GripVertical className="w-4 h-4" />
                    <span>{publishedProjects.length} Projects Live</span>
                  </div>
                </div>

                {/* Reorderable List */}
                <div className="space-y-2.5">
                  {publishedProjects.map((project, index) => {
                    const isDragging = dragSourceType === "published" && draggedItemIndex === index;
                    const isDragOver = dragSourceType === "published" && dragOverItemIndex === index;

                    return (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={(e) => handlePublishedDragStart(e, index)}
                        onDragOver={(e) => handlePublishedDragOver(e, index)}
                        onDrop={(e) => handlePublishedDrop(e, index)}
                        onDragEnd={() => {
                          setDraggedItemIndex(null);
                          setDragOverItemIndex(null);
                        }}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border transition-all duration-150 ${
                          isDragging
                            ? "opacity-40 border-dashed border-[#c8a96e] bg-[#1a1e2b] scale-[0.99]"
                            : isDragOver
                            ? "border-[#c8a96e] ring-2 ring-[#c8a96e]/50 bg-[#161b27]"
                            : isDark ? "bg-[#0d1017] border-[#202535] hover:border-neutral-600 hover:bg-[#111420]" : "bg-white border-[#e0e5ee] hover:border-[#c8a96e]/60 hover:bg-[#fcfdfe] shadow-sm"
                        }`}
                      >
                        {/* Left Side: Drag Handle + Plate # + Thumbnail + Info */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          {/* Drag Handle */}
                          <div
                            className="p-1.5 sm:p-2 text-neutral-400 hover:text-[#c8a96e] rounded-lg hover:bg-black/40 cursor-grab active:cursor-grabbing transition-colors shrink-0"
                            title="Click and drag to reorder"
                          >
                            <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>

                          {/* Position Badge */}
                          <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center shrink-0 ${
                            isDark ? "bg-[#161924] border-[#2b3144]" : "bg-[#f0f3f8] border-[#d8dde6]"
                          }`}>
                            <span className="text-[7px] sm:text-[9px] text-neutral-500 font-mono leading-none">PL</span>
                            <span className="text-[10px] sm:text-xs font-mono font-bold text-[#c8a96e] leading-none mt-0.5">
                              #{index + 1}
                            </span>
                          </div>

                          {/* Cover Thumbnail */}
                          <div className="w-12 h-9 sm:w-16 sm:h-12 rounded-lg overflow-hidden border border-[#2b3144] shrink-0 bg-black/40 relative">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                            {project.gallery && project.gallery.length > 0 && (
                              <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] sm:text-[8px] font-mono text-center text-[#c8a96e]">
                                +{project.gallery.length}
                              </div>
                            )}
                          </div>

                          {/* Project Details */}
                          <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <h4 className={`font-serif font-bold text-xs sm:text-sm truncate max-w-[160px] sm:max-w-none ${isDark ? "text-white" : "text-neutral-900"}`}>

                                {project.title}
                              </h4>
                              <span
                                className={`px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold uppercase rounded border shrink-0 ${
                                  project.category === "residential"
                                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                    : project.category === "commercial"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                }`}
                              >
                                {project.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-neutral-400 font-mono truncate">
                              {project.location && (
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-[#c8a96e] shrink-0" />
                                  <span className="truncate">{project.location}</span>
                                </span>
                              )}
                              {project.scale && (
                                <span className="text-neutral-300 hidden sm:inline">
                                  · {project.scale}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Micro Shift Controls + Edit Button */}
                        <div className={`flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto shrink-0 p-1.5 rounded-xl border ${
                            isDark ? "bg-[#080a0f] border-[#1e2330]" : "bg-[#f1f4f9] border-[#d8dde6]"
                          }`}>
                          <button
                            type="button"
                            onClick={() => handleEditPublishedProject(project)}
                            className={`flex-1 sm:flex-initial justify-center px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isDark
                                ? "bg-[#181d28] hover:bg-[#c8a96e] text-neutral-300 hover:text-[#0c0e12] border-[#2b3144]"
                                : "bg-white hover:bg-[#c8a96e] text-neutral-800 hover:text-[#0c0e12] border-[#d0d6e2] shadow-sm"
                            }`}
                            title="Edit project specs, blueprint & photos"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#c8a96e]" />
                            <span>Edit Project</span>
                          </button>

                          <div className="h-4 w-[1px] bg-[#222736]" />

                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMovePublishedProject(index, "top")}
                              className="p-1.5 text-neutral-400 hover:text-[#c8a96e] hover:bg-[#1a1e2a] dark:hover:bg-[#1a1e2a] hover:bg-[#e2e7f0] rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer touch-manipulation"
                              title="Move to Top (#1)"
                            >
                              <ChevronsUp className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMovePublishedProject(index, "up")}
                              className="p-1.5 text-neutral-400 hover:text-[#c8a96e] hover:bg-[#1a1e2a] dark:hover:bg-[#1a1e2a] hover:bg-[#e2e7f0] rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer touch-manipulation"
                              title="Move Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              disabled={index === publishedProjects.length - 1}
                              onClick={() => handleMovePublishedProject(index, "down")}
                              className="p-1.5 text-neutral-400 hover:text-[#c8a96e] hover:bg-[#1a1e2a] dark:hover:bg-[#1a1e2a] hover:bg-[#e2e7f0] rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer touch-manipulation"
                              title="Move Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              disabled={index === publishedProjects.length - 1}
                              onClick={() => handleMovePublishedProject(index, "bottom")}
                              className="p-1.5 text-neutral-400 hover:text-[#c8a96e] hover:bg-[#1a1e2a] dark:hover:bg-[#1a1e2a] hover:bg-[#e2e7f0] rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer touch-manipulation"
                              title="Move to Bottom"
                            >
                              <ChevronsDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW B: PIPELINE CARDS GRID */}
            {projectDisplayMode === "pipeline" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWorkingProjects.map((project, index) => {
                  const isCompleted = project.status === "completed";
                  const isPublished = project.status === "published";
                  const isWorking = project.status === "working";
                  const isDragging = dragSourceType === "working" && draggedItemIndex === index;
                  const isDragOver = dragSourceType === "working" && dragOverItemIndex === index;

                  return (
                    <div
                      key={project.id}
                      draggable
                      onDragStart={(e) => handleWorkingDragStart(e, index)}
                      onDragOver={(e) => handleWorkingDragOver(e, index)}
                      onDrop={(e) => handleWorkingDrop(e, index)}
                      onDragEnd={() => {
                        setDraggedItemIndex(null);
                        setDragOverItemIndex(null);
                      }}
                      className={`rounded-xl border p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between gap-4 ${
                        isDark ? "bg-[#12151f]" : "bg-white shadow-sm"
                      } ${
                        isDragging
                          ? "opacity-40 border-dashed border-[#c8a96e]"
                          : isDragOver
                          ? "border-[#c8a96e] ring-2 ring-[#c8a96e]/50"
                          : isCompleted
                          ? isDark
                            ? "border-emerald-500/50 shadow-lg shadow-emerald-500/5 bg-gradient-to-br from-[#12151f] to-[#121c17]"
                            : "border-emerald-500/60 shadow-lg shadow-emerald-500/10 bg-gradient-to-br from-white to-emerald-50/40"
                          : isPublished
                          ? isDark ? "border-[#c8a96e]/40" : "border-[#c8a96e]/60 shadow-sm"
                          : isDark ? "border-[#232734]" : "border-[#e2e6ee]"
                      }`}
                    >
                      <div>
                        {/* Top Header & Badges + Drag Handle */}
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Drag Handle */}
                            <div
                              className="p-1 text-neutral-400 hover:text-[#c8a96e] rounded cursor-grab active:cursor-grabbing"
                              title="Drag to reorder pipeline"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                                project.category === "residential"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                  : project.category === "commercial"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              }`}
                            >
                              {project.category}
                            </span>

                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded ${
                                isCompleted
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : isPublished
                                  ? "bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/30"
                                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              }`}
                            >
                              ● {project.stage}
                            </span>
                          </div>

                          {/* Top action icons: Reorder Shift + Edit and Delete */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveWorkingProject(index, "up")}
                              className="p-1 text-neutral-500 hover:text-[#c8a96e] hover:bg-[#1a1e28] rounded transition-colors disabled:opacity-20 cursor-pointer"
                              title="Move card up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === filteredWorkingProjects.length - 1}
                              onClick={() => handleMoveWorkingProject(index, "down")}
                              className="p-1 text-neutral-500 hover:text-[#c8a96e] hover:bg-[#1a1e28] rounded transition-colors disabled:opacity-20 cursor-pointer"
                              title="Move card down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProject(project)}
                              className="p-1.5 text-neutral-400 hover:text-[#c8a96e] hover:bg-[#1a1e28] rounded-lg transition-colors cursor-pointer ml-1"
                              title="Edit Project Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setProjectToDelete(project)}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      {/* Title & Specs */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#c8a96e] font-semibold">
                          <span>Project Name:</span>
                        </div>
                        <h3 className={`font-serif text-base sm:text-lg font-bold leading-snug ${isDark ? "text-white" : "text-neutral-900"}`}>

                          {project.title || "Untitled Project"}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400 pt-2">
                        {project.client && (
                          <div className="truncate">
                            <span className="text-neutral-500">Client: </span>
                            <span className="text-neutral-300">{project.client}</span>
                          </div>
                        )}
                        {project.location && (
                          <div className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#c8a96e]" />
                            <span className="text-neutral-300">{project.location}</span>
                          </div>
                        )}
                        {(project.scale || project.areaSqFt) && (
                          <div className="truncate">
                            <span className="text-neutral-500">Project Space: </span>
                            <span className="text-[#c8a96e] font-medium">
                              {project.scale || project.areaSqFt}
                            </span>
                          </div>
                        )}
                        {project.estimatedBudget && (
                          <div>
                            <span className="text-neutral-500">Est. Budget: </span>
                            <span className="text-[#c8a96e] font-semibold">
                              {project.estimatedBudget}
                            </span>
                          </div>
                        )}
                      </div>

                      {project.notes && (
                        <p className="text-xs text-neutral-400 italic mt-2.5 bg-[#0a0c12] p-2.5 rounded-lg border border-white/5">
                          &ldquo;{project.notes}&rdquo;
                        </p>
                      )}

                      {/* Ongoing Site & Progress Photos Preview Strip */}
                      <div className={`mt-3 p-2.5 rounded-xl border space-y-1.5 ${
                          isDark ? "bg-[#0a0c12] border-[#202432]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                        }`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-semibold flex items-center gap-1.5 ${isDark ? "text-neutral-300" : "text-neutral-800"}`}>
                            <Layers className="w-3.5 h-3.5 text-[#c8a96e]" />
                            <span>Site &amp; Progress Photos</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#181d28] text-[#c8a96e] border border-[#c8a96e]/30">
                              {(project.gallery?.length || 0) + 1} Pics
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingProject(project)}
                            className="text-[#c8a96e] hover:underline text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add / Manage Pics</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {/* Cover Photo */}
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-[#c8a96e] shrink-0 group">
                            <img src={project.image} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[8px] font-mono text-white">
                              Cover
                            </div>
                          </div>

                          {/* Gallery Photos */}
                          {(project.gallery || []).map((pic, gIdx) => (
                            <div
                              key={gIdx}
                              className="relative w-14 h-10 rounded-lg overflow-hidden border border-[#272b38] shrink-0"
                            >
                              <img src={pic} alt={`Site ${gIdx + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[7px] text-center text-neutral-300 font-mono">
                                #{gIdx + 1}
                              </div>
                            </div>
                          ))}

                          {/* Add more button tile */}
                          <button
                            type="button"
                            onClick={() => setEditingProject(project)}
                            className={`w-14 h-10 rounded-lg border border-dashed flex flex-col items-center justify-center text-[9px] shrink-0 transition-colors cursor-pointer ${
                              isDark
                                ? "border-[#384054] hover:border-[#c8a96e] bg-[#121520] hover:bg-[#181d28] text-neutral-400 hover:text-[#c8a96e]"
                                : "border-[#cbd3e0] hover:border-[#c8a96e] bg-white hover:bg-[#f1f4f9] text-neutral-600 hover:text-[#c8a96e]"
                            }`}
                            title="Add more photos of this ongoing project"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Pic</span>
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-neutral-400">Execution Progress</span>
                          <span
                            className={`font-bold ${
                              isCompleted || isPublished
                                ? "text-emerald-400"
                                : "text-blue-400"
                            }`}
                          >
                            {project.progress}%
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-[#1a1e2a]" : "bg-[#e5e9f2]"}`}>
                          <div
                            className={`h-full transition-all duration-500 ${
                              isCompleted || isPublished
                                ? "bg-emerald-400"
                                : "bg-gradient-to-r from-blue-500 to-[#c8a96e]"
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-[#1e2330] flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-[11px] text-neutral-400 flex items-center gap-2 flex-wrap">
                        {/* Quick Status Toggle Dropdown */}
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${
                            isDark ? "bg-[#0b0e15] border-[#232734]" : "bg-[#f1f4f9] border-[#d8dde6]"
                          }`}>
                          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">Status:</span>
                          <select
                            value={project.status}
                            onChange={(e) =>
                              handleQuickStatusToggle(project, e.target.value as any)
                            }
                            className={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer ${
                              isPublished
                                ? "text-[#c8a96e]"
                                : isCompleted
                                ? "text-emerald-400"
                                : "text-blue-400"
                            }`}
                            title="Quick toggle status between Working / Completed / Published"
                          >
                            <option value="working" className={isDark ? "bg-[#12151e] text-blue-400" : "bg-white text-blue-600"}>
                              ● Working Draft
                            </option>
                            <option value="completed" className={isDark ? "bg-[#12151e] text-emerald-400" : "bg-white text-emerald-600"}>
                              ● Completed (Ready)
                            </option>
                            <option value="published" className={isDark ? "bg-[#12151e] text-[#c8a96e]" : "bg-white text-[#8c6d32]"}>
                              ● Published Live
                            </option>
                          </select>
                        </div>

                        {isPublished ? (
                          <span className="text-[#c8a96e] hidden sm:flex items-center gap-1 font-medium text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Live {project.publishedAt}
                          </span>
                        ) : isCompleted ? (
                          <span className="text-emerald-400 hidden sm:flex items-center gap-1 font-medium text-[11px]">
                            <Sparkles className="w-3.5 h-3.5" /> Ready to publish
                          </span>
                        ) : (
                          <span className="text-neutral-400 hidden sm:inline text-[11px]">
                            Stage: {project.stage}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                            isDark
                              ? "bg-[#181c27] hover:bg-[#202534] text-neutral-300 hover:text-white border-[#272c3b]"
                              : "bg-[#f4f6fa] hover:bg-[#e8ecf4] text-neutral-700 hover:text-black border-[#d8dde6]"
                          }`}
                          title="Edit details"
                        >
                          <Edit className="w-3 h-3 text-[#c8a96e]" />
                          <span>Edit</span>
                        </button>

                        {isWorking && (
                          <button
                            onClick={() => handleMarkCompleted(project.id)}
                            className="px-3 py-1.5 bg-[#1a1f2c] hover:bg-emerald-950/60 text-emerald-400 hover:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        )}

                        {isCompleted && (
                          <button
                            onClick={() => handlePublish(project.id, project.title)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#c8a96e] hover:opacity-90 text-[#0c0e12] text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 animate-pulse"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Publish to Live Site</span>
                          </button>
                        )}

                        {isPublished && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={onNavigateToProjects}
                              className="px-2.5 py-1.5 bg-[#181d28] hover:bg-[#202636] text-[#c8a96e] text-xs font-medium rounded-lg border border-[#c8a96e]/30 flex items-center gap-1 cursor-pointer"
                              title="Inspect on live page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Live</span>
                            </button>
                            <button
                              onClick={() => handleUnpublish(project.id, project.title)}
                              className="px-2 py-1.5 bg-transparent hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 text-xs rounded-lg transition-colors cursor-pointer"
                              title="Remove from public view"
                            >
                              Unpublish
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

            {filteredWorkingProjects.length === 0 && (
              <div className={`text-center py-12 rounded-xl border p-6 space-y-3 transition-colors ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <Layers className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="text-neutral-300 text-sm font-semibold">
                  No projects match your current filter.
                </p>
                <button
                  onClick={() => {
                    setProjectSubFilter("all");
                    setCategoryFilter("all");
                    setProjectSearch("");
                  }}
                  className="text-xs text-[#c8a96e] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB 2: VIEWER INSIGHTS & ANALYTICS
           ════════════════════════════════════════════ */}
        {activeTab === "insights" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Analytics Accuracy & Correction Banner */}
            <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
              isDark
                ? "border-[#c8a96e]/40 bg-gradient-to-r from-[#181d29] via-[#141822] to-[#1a1c22]"
                : "border-[#c8a96e]/60 bg-gradient-to-r from-[#fdfbf7] via-[#faf5ea] to-[#fdfbf7]"
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Baseline + Live Telemetry Active
                  </span>
                  {ga4Id && (
                    <span className="text-[10px] font-mono text-[#c8a96e] bg-black/40 px-2 py-0.5 rounded border border-[#c8a96e]/30">
                      GA4: {ga4Id}
                    </span>
                  )}
                </div>
                <h3 className={`font-serif text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Analytics Accuracy &amp; Studio Data Calibration
                </h3>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  These metrics combine studio benchmark data with real-time in-browser telemetry (tracking live page impressions and blueprint inspections). If your actual analytics from Google Analytics 4 (GA4) or Search Console differ, you can <strong>calibrate or correct them anytime</strong> using the button on the right.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => {
                    setAnalyticsForm(analytics);
                    setIsAnalyticsModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Calibrate / Correct Numbers</span>
                </button>
              </div>
            </div>

            {/* Real-time KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className={`p-4 rounded-xl space-y-1 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Total Page Impressions</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className={`text-2xl font-bold font-serif ${isDark ? "text-white" : "text-neutral-900"}`}>

                  {analytics.totalPageViews.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  +18.4% weekly trend
                </div>
              </div>

              <div className={`p-4 rounded-xl space-y-1 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Unique Visitors</span>
                  <Users className="w-4 h-4 text-[#c8a96e]" />
                </div>
                <div className={`text-2xl font-bold font-serif ${isDark ? "text-white" : "text-neutral-900"}`}>

                  {analytics.uniqueVisitors.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Avg session {analytics.avgDurationMinutes}m
                </div>
              </div>

              <div className={`p-4 rounded-xl space-y-1 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Active Sessions Now</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-2xl font-bold font-serif text-emerald-400">
                  {analytics.activeNow} Viewers
                </div>
                <div className="text-[11px] text-neutral-400">
                  Real-time active browsers
                </div>
              </div>

              <div className={`p-4 rounded-xl space-y-1 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Blueprint Inspections</span>
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <div className={`text-2xl font-bold font-serif ${isDark ? "text-white" : "text-neutral-900"}`}>

                  {analytics.blueprintInspections.toLocaleString()}
                </div>
                <div className="text-[11px] text-blue-400">
                  High-res modal inspections
                </div>
              </div>
            </div>

            {/* Daily Traffic Visual Graph & Typology Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Daily Traffic Chart */}
              <div className={`lg:col-span-7 p-5 rounded-xl space-y-4 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-serif text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>

                      7-Day Visitor Activity &amp; Inquiries
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Portfolio engagement across Maharashtra &amp; international clients
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Telemetry
                  </span>
                </div>

                {/* Simulated Bar Chart */}
                <div className="pt-4 flex items-end justify-between gap-2 h-44">
                  {analytics.dailyTraffic.map((item, idx) => {
                    const heightPercent = Math.min(100, Math.round((item.views / 750) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.views}
                        </span>
                        <div
                          className={`w-full rounded-t transition-all duration-300 ${isDark ? "bg-[#1b202d] group-hover:bg-[#c8a96e]" : "bg-[#e2e7f0] group-hover:bg-[#c8a96e]"}`}
                          style={{ height: `${Math.max(15, heightPercent)}%` }}
                        />
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {item.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Typology Interest Breakdown */}
              <div className={`lg:col-span-5 p-5 rounded-xl space-y-4 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <h3 className={`font-serif text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>

                  Visitor Discipline Interest
                </h3>
                <div className="space-y-3 pt-1">
                  {analytics.categoryInterest.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300 font-medium">{cat.category}</span>
                        <span className="text-neutral-400 font-mono">{cat.percent}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-[#191d29]" : "bg-[#e5e9f2]"}`}>
                        <div
                          className="h-full bg-gradient-to-r from-[#c8a96e] to-[#e4cc99] rounded-full"
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Geographic Origin & Top Inspected Plates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Geographic Traffic */}
              <div className={`p-5 rounded-xl space-y-3 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c8a96e]" />
                  <h3 className={`font-serif text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>

                    Geographic Traffic Origin
                  </h3>
                </div>
                <div className="space-y-2 pt-1">
                  {analytics.topCities.map((city, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-[#1c202d] last:border-0"
                    >
                      <span className="text-neutral-300">{city.city}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-400 font-mono">{city.count} hits</span>
                        <span className="px-2 py-0.5 rounded bg-[#181c28] text-[#c8a96e] font-mono text-[10px] font-bold">
                          {city.percent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Inspected Plates */}
              <div className={`p-5 rounded-xl space-y-3 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#c8a96e]" />
                  <h3 className={`font-serif text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>

                    Most Inspected Project Blueprints
                  </h3>
                </div>
                <div className="space-y-2 pt-1">
                  {analytics.topViewedProjects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-[#1c202d] last:border-0"
                    >
                      <div className="truncate pr-2">
                        <span className="font-mono text-[#c8a96e] text-[10px] mr-2">
                          #{idx + 1}
                        </span>
                        <span className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>{proj.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-neutral-400">
                          {proj.category}
                        </span>
                        <span className="font-mono text-neutral-300 font-semibold">
                          {proj.views} views
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB 3: CLIENT ENQUIRIES & LEADS PIPELINE
           ════════════════════════════════════════════ */}
        {activeTab === "enquiries" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Explainer & Demo Control Banner */}
            <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDark
                ? "border-[#272b38] bg-gradient-to-r from-[#12151f] via-[#141824] to-[#12151f]"
                : "border-[#e2e6ee] bg-gradient-to-r from-white via-[#fbfcfe] to-white shadow-sm"
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/30">
                    Lead Telemetry
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Target: mohalkararchitectsandplanners@gmail.com
                  </span>
                </div>
                <h3 className={`font-serif text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Client Enquiry Transmission Pipeline
                </h3>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  <strong>Are these enquiries real?</strong> The 3 initial leads (Vikramaditya Shinde, Sunil Deshmukh, Anand Jadhav) were pre-loaded as demo samples. All real inquiries submitted by visitors on your website automatically transmit to your studio email and appear here in real time. You can <strong>remove the demo leads</strong> anytime below.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {enquiries.length > 0 ? (
                  <button
                    onClick={handleClearAllEnquiries}
                    className="w-full sm:w-auto px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded-xl border border-rose-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Remove all demo enquiry cards"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Demo Enquiries</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRestoreDemoEnquiries}
                    className="w-full sm:w-auto px-3.5 py-2 bg-[#181c28] hover:bg-[#222738] text-[#c8a96e] text-xs font-medium rounded-xl border border-[#c8a96e]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Reload sample enquiry cards for preview"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore Demo Enquiries</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Count Header */}
            <div className={`p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors border ${
              isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
            }`}>
              <div>
                <span className="text-xs font-mono text-neutral-300">
                  Showing <strong>{enquiries.filter((e) => enquiryStatusFilter === "all" || e.status === enquiryStatusFilter).length}</strong> of {enquiries.length} Lead Records
                </span>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
                {["all", "new", "in_review", "quoted"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      enquiryStatusFilter === st
                        ? "bg-[#c8a96e] text-[#0c0e12] font-semibold"
                        : "bg-[#181c28] text-neutral-400 hover:text-white"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Enquiries List */}
            <div className="space-y-3">
              {enquiries
                .filter((e) => enquiryStatusFilter === "all" || e.status === enquiryStatusFilter)
                .map((enq) => (
                  <div
                    key={enq.id}
                    className={`p-3.5 sm:p-5 rounded-xl space-y-3 transition-colors border ${
                    isDark ? "bg-[#12151f] border-[#232734] hover:border-[#c8a96e]/50" : "bg-white border-[#e2e6ee] hover:border-[#c8a96e]/60 shadow-sm"
                  }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-serif text-sm sm:text-base font-bold ${isDark ? "text-white" : "text-neutral-900"} truncate`}>
                            {enq.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              enq.status === "new"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : enq.status === "in_review"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {enq.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 leading-relaxed">
                          {enq.date} · Location: <strong className="text-neutral-300">{enq.location}</strong> · Typology: <strong className="text-[#c8a96e]">{enq.projectType}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="text-xs font-mono text-[#c8a96e] font-semibold">
                          {enq.budget}
                        </span>
                        <button
                          onClick={() => handleDeleteEnquiry(enq.id, enq.name)}
                          className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Delete this enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed p-3 rounded-lg border ${
                      isDark ? "bg-[#0d0f16] text-neutral-300 border-[#1e2330]" : "bg-[#f8f9fc] text-neutral-700 border-[#e5e9f0]"
                    }`}>
                      &ldquo;{enq.message}&rdquo;
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2.5">
                      <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono truncate">
                        <span className="truncate">{enq.phone}</span>
                        <span>·</span>
                        <span className="truncate">{enq.email}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${enq.name}, Abhishek Mohalkar here from Mohalkar Architects regarding your ${enq.projectType} inquiry.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors text-center"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">WhatsApp</span>
                        </a>

                        <a
                          href={`mailto:${enq.email}?subject=${encodeURIComponent(
                            `Mohalkar Architects - Architectural Proposal for ${enq.projectType}`
                          )}`}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-colors text-center ${
                            isDark
                              ? "bg-[#181c28] hover:bg-[#222738] text-neutral-300 hover:text-white border-[#292e3d]"
                              : "bg-[#f4f6fa] hover:bg-[#e8ecf4] text-neutral-700 hover:text-black border-[#d8dde6] shadow-sm"
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                          <span className="truncate">Send Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Empty state when no enquiries present */}
              {enquiries.filter((e) => enquiryStatusFilter === "all" || e.status === enquiryStatusFilter).length === 0 && (
                <div className={`text-center py-12 rounded-xl border p-6 space-y-3 transition-colors ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className={`font-serif text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>

                    Enquiry Pipeline Clean &amp; Ready
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Demo leads have been removed. When clients submit their project briefs via the website form, their details, contact information, and project scope will appear here immediately and dispatch to <code className="text-[#c8a96e]">mohalkararchitectsandplanners@gmail.com</code>.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleRestoreDemoEnquiries}
                      className="text-xs text-[#c8a96e] hover:underline cursor-pointer inline-flex items-center gap-1.5 font-medium"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Restore Demo Enquiries (for preview)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB 4: RECENT ACTIVITY FEED & SITE AUDIT
           ════════════════════════════════════════════ */}
        {activeTab === "activity" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Activity Header & Audit Actions */}
            <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
              isDark
                ? "border-[#c8a96e]/30 bg-gradient-to-r from-[#171b26] via-[#12151f] to-[#171922]"
                : "border-[#c8a96e]/50 bg-gradient-to-r from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] shadow-sm"
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live Activity Stream Active
                  </span>
                  <span className="text-[10px] font-mono text-[#c8a96e] bg-black/40 px-2 py-0.5 rounded border border-[#c8a96e]/30">
                    {activities.length} Recorded Events
                  </span>
                </div>
                <h3 className={`font-serif text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Executive Activity Feed &amp; Site Management Audit
                </h3>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  Automatic audit trail logging all administrative actions — project creations, deletions, status toggles (Working / Completed / Published), specification updates, client inquiries, and live telemetry calibrations.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleExportActivityLog}
                  className="px-3 py-2 bg-[#181d28] hover:bg-[#222738] text-neutral-200 hover:text-white text-xs font-medium rounded-xl border border-[#2a2f3f] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Export activity logs as JSON file"
                >
                  <Download className="w-3.5 h-3.5 text-[#c8a96e]" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={handleRestoreDefaultActivities}
                  className="px-3 py-2 bg-[#181d28] hover:bg-[#222738] text-neutral-300 hover:text-white text-xs font-medium rounded-xl border border-[#2a2f3f] transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Restore default sample activity trail"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#c8a96e]" />
                  <span>Restore Defaults</span>
                </button>

                <button
                  onClick={() => setShowActivityConfirmClear(true)}
                  className="px-3 py-2 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-medium rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Clear entire activity log"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Clear Feed</span>
                </button>
              </div>
            </div>

            {/* Activity Stream Statistics KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className={`p-4 rounded-xl space-y-1 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Total Logged Actions</span>
                  <History className="w-4 h-4 text-neutral-400" />
                </div>
                <div className={`text-2xl font-bold font-serif ${isDark ? "text-white" : "text-neutral-900"}`}>

                  {activityStats.total}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Full audit events in memory
                </div>
              </div>

              <div className={`p-4 rounded-xl space-y-1 shadow-lg transition-colors border ${
                isDark ? "bg-[#12151f] border-amber-500/30 shadow-amber-500/5" : "bg-white border-amber-500/40 shadow-amber-500/10"
              }`}>
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Status Toggles</span>
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-serif text-amber-400">
                  {activityStats.statusChanges}
                </div>
                <div className="text-[11px] text-amber-300/80">
                  Workflow stage &amp; status transitions
                </div>
              </div>

              <div className={`p-4 rounded-xl space-y-1 shadow-lg transition-colors border ${
                isDark ? "bg-[#12151f] border-emerald-500/30 shadow-emerald-500/5" : "bg-white border-emerald-500/40 shadow-emerald-500/10"
              }`}>
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Projects Created</span>
                  <Plus className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-serif text-emerald-400">
                  {activityStats.creates}
                </div>
                <div className="text-[11px] text-emerald-300/80">
                  New architectural plans added
                </div>
              </div>

              <div className={`p-4 rounded-xl space-y-1 shadow-lg transition-colors border ${
                isDark ? "bg-[#12151f] border-[#c8a96e]/30 shadow-[#c8a96e]/5" : "bg-white border-[#c8a96e]/40 shadow-[#c8a96e]/10"
              }`}>
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Live Site Publishes</span>
                  <Globe className="w-4 h-4 text-[#c8a96e]" />
                </div>
                <div className="text-2xl font-bold font-serif text-[#c8a96e]">
                  {activityStats.publishes}
                </div>
                <div className="text-[11px] text-[#dfc085]">
                  Public portfolio releases
                </div>
              </div>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className={`p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors border ${
              isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
            }`}>
              {/* Type Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs">
                <button
                  onClick={() => setActivityTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                    activityTypeFilter === "all"
                      ? "bg-[#c8a96e] text-[#0c0e12] font-semibold"
                      : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                  }`}
                >
                  All Actions ({activityStats.total})
                </button>

                <button
                  onClick={() => setActivityTypeFilter("status_change")}
                  className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activityTypeFilter === "status_change"
                      ? "bg-amber-500 text-black font-semibold"
                      : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Status Toggles ({activityStats.statusChanges})</span>
                </button>

                <button
                  onClick={() => setActivityTypeFilter("create")}
                  className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activityTypeFilter === "create"
                      ? "bg-emerald-500 text-black font-semibold"
                      : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Created ({activityStats.creates})</span>
                </button>

                <button
                  onClick={() => setActivityTypeFilter("publish")}
                  className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activityTypeFilter === "publish"
                      ? "bg-[#c8a96e] text-[#0c0e12] font-semibold"
                      : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Published Live ({activityStats.publishes})</span>
                </button>

                <button
                  onClick={() => setActivityTypeFilter("delete")}
                  className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activityTypeFilter === "delete"
                      ? "bg-rose-500 text-white font-semibold"
                      : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Deleted ({activityStats.deletes})</span>
                </button>

                <button
                  onClick={() => setActivityTypeFilter("edit")}
                  className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activityTypeFilter === "edit"
                      ? "bg-blue-500 text-white font-semibold"
                      : isDark ? "bg-[#181c27] text-neutral-400 hover:text-white" : "bg-[#f4f6fa] text-neutral-600 hover:text-neutral-900 border border-[#d8dfea]"
                  }`}
                >
                  <Edit className="w-3 h-3" />
                  <span>Edits &amp; Others ({activityStats.others})</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search logs by title, scope, client..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className={`w-full pl-8 pr-8 py-2 rounded-xl text-xs focus:outline-none focus:border-[#c8a96e] transition-colors border ${
                    isDark
                      ? "bg-[#0b0d14] border-[#252835] text-white placeholder-neutral-500"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                  }`}
                />
                {activitySearch && (
                  <button
                    onClick={() => setActivitySearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Chronological Activity Feed Stream */}
            <div className="space-y-3">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => {
                  const badge = getActivityBadge(act.type);
                  return (
                    <div
                      key={act.id}
                      className={`p-4 sm:p-5 rounded-xl transition-all shadow-sm flex flex-col sm:flex-row items-start gap-4 group border ${
                        isDark ? "bg-[#12151f] border-[#232734] hover:border-[#383e52]" : "bg-white border-[#e2e6ee] hover:border-[#cbd2df]"
                      }`}
                    >
                      {/* Left Badge Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner ${badge.bgColor}`}
                      >
                        {badge.icon}
                      </div>

                      {/* Content Body */}
                      <div className="flex-1 min-w-0 space-y-1.5 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${badge.bgColor}`}
                            >
                              {badge.label}
                            </span>

                            <h4 className={`font-serif text-sm sm:text-base font-bold ${isDark ? "text-white" : "text-neutral-900"} group-hover:text-[#c8a96e] transition-colors`}>
                              {act.title}
                            </h4>

                            {act.targetCategory && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181c28] text-neutral-300 border border-[#262b3a]">
                                {act.targetCategory}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono shrink-0">
                            <span className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>

                              {getRelativeTime(act.timestamp)}
                            </span>
                            <span>·</span>
                            <span className="text-neutral-500">
                              {getExactTime(act.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className={`text-xs leading-relaxed p-3 rounded-lg border ${
                            isDark ? "bg-[#0b0e15] text-neutral-300 border-[#1e2330]" : "bg-[#f8f9fc] text-neutral-700 border-[#e5e9f0]"
                          }`}>
                          {act.description}
                        </p>

                        {/* Footer Details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-1.5 text-[11px] text-neutral-400">
                          <div className="flex items-center gap-2 truncate">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                            <span className="truncate">Logged by: <strong className="text-neutral-300">{act.actor || "Principal Architect Abhishek Mohalkar"}</strong></span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-[10px] text-neutral-500 uppercase">
                              Event: {act.type.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center py-16 rounded-xl border p-6 space-y-4 transition-colors ${
                  isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-[#1b202c] border border-[#2b3142] flex items-center justify-center text-neutral-400 mx-auto">
                    <Activity className="w-6 h-6 text-[#c8a96e]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className={`font-serif text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>

                      No Activity Logs Found
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                      {activitySearch || activityTypeFilter !== "all"
                        ? "No activity events match your current filter criteria. Try resetting filters."
                        : "The activity stream is empty. Any project creations, status toggles, or publishing will be automatically recorded here."}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    {activitySearch || activityTypeFilter !== "all" ? (
                      <button
                        onClick={() => {
                          setActivityTypeFilter("all");
                          setActivitySearch("");
                        }}
                        className="px-4 py-2 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Reset Filter &amp; Search
                      </button>
                    ) : (
                      <button
                        onClick={handleRestoreDefaultActivities}
                        className="px-4 py-2 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Restore Sample Audit Logs</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB 5: WEBSITE PROPERTIES & SYSTEM HEALTH
           ════════════════════════════════════════════ */}
        {activeTab === "properties" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Architecture & Stack Properties */}
              <div className="bg-[#12151f] border border-[#232734] p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#c8a96e]" />
                  <h3 className={`font-serif text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>

                    Platform &amp; Infrastructure
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1c202d]">
                    <span className="text-neutral-400">Framework Engine</span>
                    <span className={`font-mono ${isDark ? "text-white" : "text-neutral-900"}`}>React 19 + Vite 8.3 (SPA)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1c202d]">
                    <span className="text-neutral-400">Styling Engine</span>
                    <span className={`font-mono ${isDark ? "text-white" : "text-neutral-900"}`}>Tailwind CSS v4</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1c202d]">
                    <span className="text-neutral-400">Direct Email Protocol</span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> FormSubmit.co Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1c202d]">
                    <span className="text-neutral-400">Target Studio Inbox</span>
                    <span className="text-[#c8a96e] font-mono">mohalkararchitectsandplanners@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-neutral-400">Total Asset Drawings</span>
                    <span className={`font-mono ${isDark ? "text-white" : "text-neutral-900"}`}>87+ High-Res Sheets</span>
                  </div>
                </div>
              </div>

              {/* Studio Registration & Directory */}
              <div className="bg-[#12151f] border border-[#232734] p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#c8a96e]" />
                  <h3 className={`font-serif text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>

                    Studio Entity &amp; Directory
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1c202d]">
                    <span className="text-neutral-400">Principal Architect</span>
                    <span className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>Abhishek Mohalkar</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1c202d]">
                    <span className="text-neutral-400">CoA Registration</span>
                    <span className={`font-mono ${isDark ? "text-white" : "text-neutral-900"}`}>Council of Architecture Licensed</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1c202d]">
                    <span className="text-neutral-400">Primary Phone</span>
                    <span className={`font-mono ${isDark ? "text-white" : "text-neutral-900"}`}>{SITE_INFO.contacts.phonePrimary}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1c202d]">
                    <span className="text-neutral-400">Direct WhatsApp</span>
                    <span className="text-emerald-400 font-mono">{SITE_INFO.contacts.phoneSecondary}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-neutral-400">Studio Footprint</span>
                    <span className="text-neutral-300">Pune &amp; Bhoom (Dharashiv Region)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic SEO & Meta Tag Inspector */}
            <SeoInspector />
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB 6: ADMIN SECURITY & PASSCODE MANAGEMENT
           ════════════════════════════════════════════ */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Security Banner */}
            <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
              isDark
                ? "border-[#c8a96e]/40 bg-gradient-to-r from-[#181d29] via-[#141822] to-[#1a1c22]"
                : "border-[#c8a96e]/60 bg-gradient-to-r from-[#fdfbf7] via-[#faf5ea] to-[#fdfbf7]"
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/30 flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" /> Studio Security Suite
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Encrypted Passcode Storage
                  </span>
                </div>
                <h3 className={`font-serif text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Admin Passcode &amp; Access Controls
                </h3>
                <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                  Manage the master security passcode used to unlock the Executive Studio Console and the live website project editor.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-[#1b202c] hover:bg-rose-950/40 text-neutral-300 hover:text-rose-400 border border-[#2d3448] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Console</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Change Passcode Form Card */}
              <div className={`lg:col-span-2 rounded-xl p-5 sm:p-6 space-y-5 transition-colors border ${
                isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
              }`}>
                <div className="flex items-center justify-between border-b border-[#1e2330] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#c8a96e]/15 border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e]">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-serif font-bold text-base ${isDark ? "text-white" : "text-neutral-900"}`}>
                        Change Studio Passcode
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Update your master credentials. Minimum 4 characters required.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="px-2.5 py-1 text-xs text-neutral-400 hover:text-[#c8a96e] bg-[#181c28] rounded-lg border border-[#272b38] flex items-center gap-1.5 cursor-pointer"
                  >
                    {showPasswordText ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Hide Characters</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Show Characters</span>
                      </>
                    )}
                  </button>
                </div>

                {passwordChangeSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="font-medium">{passwordChangeSuccess}</span>
                  </div>
                )}

                {passwordChangeError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span className="font-medium">{passwordChangeError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Current Passcode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                      <span>Current Passcode *</span>
                      <span className="text-[11px] text-neutral-500 font-mono">Verify identity</span>
                    </label>
                    <input
                      type={showPasswordText ? "text" : "password"}
                      value={currentPasswordInput}
                      onChange={(e) => {
                        setCurrentPasswordInput(e.target.value);
                        setPasswordChangeError("");
                      }}
                      placeholder="Enter current studio passcode"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                      required
                    />
                  </div>

                  {/* New Passcode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        New Passcode *
                      </label>
                      <input
                        type={showPasswordText ? "text" : "password"}
                        value={newPasswordInput}
                        onChange={(e) => {
                          setNewPasswordInput(e.target.value);
                          setPasswordChangeError("");
                        }}
                        placeholder="Create new passcode (4+ chars)"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Confirm New Passcode *
                      </label>
                      <input
                        type={showPasswordText ? "text" : "password"}
                        value={confirmPasswordInput}
                        onChange={(e) => {
                          setConfirmPasswordInput(e.target.value);
                          setPasswordChangeError("");
                        }}
                        placeholder="Re-type new passcode"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Strength & Validation Hint */}
                  <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#1e2330] text-neutral-400" : "bg-[#f8f9fc] border-[#e2e6ee] text-neutral-600"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-300 text-[11px]">Passcode Requirements:</span>
                      {newPasswordInput && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            newPasswordInput.length >= 8
                              ? "bg-emerald-500/20 text-emerald-400"
                              : newPasswordInput.length >= 4
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {newPasswordInput.length >= 8
                            ? "Strong Passcode"
                            : newPasswordInput.length >= 4
                            ? "Good Length"
                            : "Too Short"}
                        </span>
                      )}
                    </div>
                    <ul className="text-[11px] space-y-1 list-disc list-inside text-neutral-400">
                      <li className={newPasswordInput.length >= 4 ? "text-emerald-400" : ""}>
                        Minimum 4 characters (alphanumeric or digits)
                      </li>
                      <li className={newPasswordInput && newPasswordInput === confirmPasswordInput ? "text-emerald-400" : ""}>
                        Confirmation passcode must match exactly
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPasswordInput("");
                        setNewPasswordInput("");
                        setConfirmPasswordInput("");
                        setPasswordChangeError("");
                      }}
                      className={`px-4 py-2.5 text-xs rounded-xl transition-colors cursor-pointer ${
                        isDark ? "text-neutral-400 hover:text-white bg-[#181c28]" : "text-neutral-700 hover:text-black bg-[#f0f3f8] border border-[#d8dfea]"
                      }`}
                    >
                      Clear Fields
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save New Passcode</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Col: Studio Security Policies & Info */}
              <div className="space-y-4">
                <div className={`rounded-xl p-5 space-y-3.5 text-xs transition-colors border ${
                  isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#c8a96e]" />
                    <h4 className={`font-serif font-bold text-sm ${isDark ? "text-white" : "text-neutral-900"}`}>
                      Access Scope &amp; Protection
                    </h4>
                  </div>

                  <p className="text-neutral-400 leading-relaxed">
                    This security passcode protects all administrative operations on the portfolio:
                  </p>

                  <div className="space-y-2 text-neutral-300 font-mono text-[11px]">
                    <div className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      isDark ? "bg-[#0b0e15] border-[#1e2330]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                    }`}>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Studio Executive Console</span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      isDark ? "bg-[#0b0e15] border-[#1e2330]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                    }`}>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Live Site Project Quick Editor</span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      isDark ? "bg-[#0b0e15] border-[#1e2330]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                    }`}>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>1-Click Project Publishing</span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                      isDark ? "bg-[#0b0e15] border-[#1e2330]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                    }`}>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Telemetry &amp; Analytics Calibration</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-5 space-y-3 text-xs transition-colors border ${
                  isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
                }`}>
                  <div className="flex items-center gap-2 text-[#c8a96e]">
                    <Lock className="w-4 h-4" />
                    <h4 className={`font-serif font-bold text-sm ${isDark ? "text-white" : "text-neutral-900"}`}>
                      Session Policy
                    </h4>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    Authentication is maintained in a secure session storage token and is automatically locked whenever the browser tab or window is closed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB 7: MULTI-ADMIN USERS & PASSWORDS DIRECTORY
           ════════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Multi-Admin Banner */}
            <div
              className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
                isDark
                  ? "border-[#c8a96e]/40 bg-gradient-to-r from-[#181d29] via-[#141822] to-[#1a1c22]"
                  : "border-[#c8a96e]/60 bg-gradient-to-r from-[#fdfbf7] via-[#faf5ea] to-[#fdfbf7]"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/30 flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5" /> Studio Multi-Admin Suite
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Independent Passwords per User
                  </span>
                </div>
                <h3 className={`font-serif text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Administrator Profiles &amp; Distinct Passcodes
                </h3>
                <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                  Add and manage studio administrators, associate architects, and project managers. Each user possesses their own unique username, distinct password, role permissions, and activity audit trail.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {/* Primary Add Admin User Action Button */}
                <button
                  type="button"
                  onClick={handleOpenAddUserModal}
                  className="px-4 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 active:scale-95 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add Admin User</span>
                </button>
              </div>
            </div>

            {/* Admin Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div
                className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                  isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                    Total Admins
                  </span>
                  <Users className="w-4 h-4 text-[#c8a96e]" />
                </div>
                <div className={`text-xl sm:text-2xl font-bold font-serif mt-1 ${isDark ? "text-white" : "text-neutral-900"}`}>
                  {adminUsers.length} Users
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Registered accounts</p>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                  isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                    Active Accounts
                  </span>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-emerald-400 mt-1">
                  {adminUsers.filter((u) => u.status === "active").length} Active
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Ready to authenticate</p>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                  isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                    Super Admins
                  </span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-amber-400 mt-1">
                  {adminUsers.filter((u) => u.accessLevel === "Super Admin").length} Executives
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Full control permissions</p>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
                  isDark ? "bg-[#12151f] border-[#232734]" : "bg-white border-[#e2e6ee] shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">
                    Project Managers
                  </span>
                  <UserCog className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-blue-400 mt-1">
                  {adminUsers.filter((u) => u.accessLevel !== "Super Admin").length} Leads
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Pipeline management</p>
              </div>
            </div>

            {/* Admin Users Directory List & Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className={`font-serif font-bold text-base ${isDark ? "text-white" : "text-neutral-900"}`}>
                    Studio User Directory ({adminUsers.length})
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Each user can unlock the console using their individual username or dedicated passcode.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddUserModal}
                  className="px-3 py-1.5 bg-[#c8a96e]/15 hover:bg-[#c8a96e] text-[#c8a96e] hover:text-[#0c0e12] border border-[#c8a96e]/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Admin</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminUsers.map((user) => {
                  const isPasswordRevealed = !!showUserPasswords[user.id];
                  const isCurrentUser = currentAdminUser?.id === user.id;

                  return (
                    <div
                      key={user.id}
                      className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 border transition-all relative ${
                        user.status === "suspended"
                          ? isDark
                            ? "bg-[#11131a]/60 border-neutral-800 opacity-75"
                            : "bg-neutral-100 border-neutral-300 opacity-75"
                          : isDark
                          ? "bg-[#12151f] border-[#232734] hover:border-[#c8a96e]/40 shadow-sm"
                          : "bg-white border-[#e2e6ee] hover:border-[#c8a96e]/60 shadow-sm"
                      }`}
                    >
                      {/* Top Badges & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {/* User Avatar */}
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold border shrink-0 ${
                              user.avatarColor || "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className={`font-serif font-bold text-sm truncate ${isDark ? "text-white" : "text-neutral-900"}`}>
                                {user.name}
                              </h5>
                              {user.isDefault && (
                                <span title="Primary Default Admin" className="text-[#c8a96e]">
                                  ★
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#c8a96e] font-mono block">
                              @{user.username}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                              user.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {user.status}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[9px] font-mono text-[#c8a96e] bg-[#c8a96e]/10 px-1.5 py-0.2 rounded border border-[#c8a96e]/30">
                              Current Session
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Roles & Permissions */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] border ${
                          isDark ? "bg-[#181c28] border-[#292f3f] text-neutral-300" : "bg-[#f4f6fa] border-[#d8dde6] text-neutral-800"
                        }`}>
                          {user.role}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border ${
                            user.accessLevel === "Super Admin"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {user.accessLevel}
                        </span>
                      </div>

                      {/* ── DISTINCT PASSWORD DISPLAY & TOGGLE ── */}
                      <div
                        className={`p-3 rounded-xl border space-y-1.5 transition-colors ${
                          isDark ? "bg-[#0b0e15] border-[#1f2433]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400 flex items-center gap-1 font-semibold">
                            <Key className="w-3 h-3 text-[#c8a96e]" />
                            <span>Individual Passcode:</span>
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            Unique Credential
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <div className="font-mono text-xs px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/5 flex-1 select-all truncate text-[#c8a96e] font-semibold tracking-wider">
                            {isPasswordRevealed ? user.password : "••••••••••••"}
                          </div>

                          {/* Show/Hide Password */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserPasswords((prev) => ({
                                ...prev,
                                [user.id]: !prev[user.id],
                              }));
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                              isDark
                                ? "bg-[#181c28] hover:bg-[#202534] border-[#2c3244] text-neutral-300"
                                : "bg-[#f0f3f8] hover:bg-[#e4e8f0] border-[#d8dde6] text-neutral-700"
                            }`}
                            title={isPasswordRevealed ? "Hide Password" : "Show Password"}
                          >
                            {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {/* Copy Password */}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(user.password);
                              showToast(`Copied password for "${user.name}" to clipboard!`);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                              isDark
                                ? "bg-[#181c28] hover:bg-[#202534] border-[#2c3244] text-neutral-300 hover:text-[#c8a96e]"
                                : "bg-[#f0f3f8] hover:bg-[#e4e8f0] border-[#d8dde6] text-neutral-700 hover:text-[#c8a96e]"
                            }`}
                            title="Copy Password to Clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Contact & Audit Meta */}
                      <div className="text-[11px] text-neutral-400 space-y-1">
                        {user.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3 h-3 text-neutral-500 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-[#1e2330] text-[10px]">
                          <span>Added {new Date(user.createdAt).toLocaleDateString()}</span>
                          {user.lastLogin && (
                            <span className="text-emerald-400 font-mono">
                              Active {Math.round((Date.now() - user.lastLogin) / (1000 * 60))}m ago
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Tools: Edit Profile & Password, Suspend, Delete */}
                      <div className="pt-2 border-t border-[#1e2330] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUserModal(user)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer flex-1 justify-center ${
                            isDark
                              ? "bg-[#181c28] hover:bg-[#202534] border-[#292f3f] text-neutral-200 hover:text-white"
                              : "bg-[#f4f6fa] hover:bg-[#e8ecf4] border-[#d8dde6] text-neutral-800 hover:text-black shadow-sm"
                          }`}
                        >
                          <Edit className="w-3 h-3 text-[#c8a96e]" />
                          <span>Edit &amp; Password</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(user)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer shrink-0 ${
                            user.status === "active"
                              ? isDark
                                ? "bg-[#181c28] hover:bg-amber-950/30 text-neutral-400 hover:text-amber-300 border-[#292f3f]"
                                : "bg-[#f4f6fa] hover:bg-amber-50 text-neutral-600 hover:text-amber-700 border-[#d8dde6]"
                              : isDark
                              ? "bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 border-emerald-500/30"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300"
                          }`}
                          title={user.status === "active" ? "Suspend Admin Account" : "Activate Account"}
                        >
                          {user.status === "active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setUserToDeleteModal(user)}
                          disabled={
                            adminUsers.length <= 1 ||
                            (user.accessLevel === "Super Admin" &&
                              adminUsers.filter((u) => u.accessLevel === "Super Admin" && u.status === "active").length <= 1)
                          }
                          className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
                            adminUsers.length <= 1 ||
                            (user.accessLevel === "Super Admin" &&
                              adminUsers.filter((u) => u.accessLevel === "Super Admin" && u.status === "active").length <= 1)
                              ? "opacity-30 cursor-not-allowed bg-transparent border-neutral-800 text-neutral-600"
                              : isDark
                              ? "bg-rose-950/20 hover:bg-rose-950/50 text-rose-400 border-rose-500/30 cursor-pointer"
                              : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 cursor-pointer"
                          }`}
                          title={
                            adminUsers.length <= 1
                              ? "Cannot delete the last remaining studio admin"
                              : user.accessLevel === "Super Admin" &&
                                adminUsers.filter((u) => u.accessLevel === "Super Admin" && u.status === "active").length <= 1
                              ? "Cannot delete the only active Super Admin account"
                              : `Delete ${user.name}'s account`
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanatory Help Card for Multi-User Passcodes */}
            <div
              className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                isDark ? "bg-[#10131c] border-[#1e2330]" : "bg-[#f8f9fc] border-[#e2e6ee]"
              }`}
            >
              <div className="flex items-center gap-2 text-[#c8a96e]">
                <ShieldCheck className="w-4 h-4" />
                <h4 className={`font-serif font-bold text-sm ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Multi-Admin Security &amp; Password Isolation Architecture
                </h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Mohalkar Architects supports distinct passwords for every team member. When team members access the Studio Control login gate, they can either click on their profile avatar and enter their specific password, or enter their unique username (e.g. <code>@abhishek</code>, <code>@shreeyash</code>, <code>@manager</code>) along with their individual password. Passwords can be changed or rotated at any time without affecting other users.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── EDIT WORKING PROJECT MODAL ───────────────── */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-3 sm:p-4 flex justify-center items-start sm:py-8">
          <div className={`w-full max-w-xl rounded-2xl p-4 sm:p-7 space-y-4 sm:space-y-5 shadow-2xl relative my-auto sm:my-0 border transition-colors ${
            isDark ? "bg-[#12151f] border-[#272b38] text-white" : "bg-white border-[#dce2ec] text-neutral-900 shadow-2xl"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#c8a96e] font-bold">
                  PROJECT SPECIFICATION EDITOR
                </span>
                <h3 className={`font-serif text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Edit Project Details
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark ? "bg-[#181c28] text-neutral-400 hover:text-white" : "bg-[#f0f3f8] text-neutral-600 hover:text-neutral-900"
              }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProject} className="space-y-4">
              <div className={`space-y-1.5 p-3.5 rounded-xl border transition-colors ${
                isDark ? "bg-[#171b26] border-[#2c3244]" : "bg-[#f8f9fc] border-[#e2e6ee]"
              }`}>
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? "text-white" : "text-neutral-900"}`}>
                    <span className="text-[#c8a96e]">●</span> Name of the Project (Project Title) *
                  </label>
                  <span className="text-[10px] font-mono uppercase text-[#c8a96e] bg-[#c8a96e]/10 px-2 py-0.5 rounded">
                    Required Field
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  placeholder="Enter Name of the Project (e.g. Skyline Commercial Tower Phase 3)"
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#c8a96e] focus:border-[#c8a96e] transition-colors border ${
                  isDark
                    ? "bg-[#0e1118] border-[#3b4256] text-white placeholder-neutral-400"
                    : "bg-white border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Discipline Typology *
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as any,
                      })
                    }
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  >
                    <option value="residential">Residential (Villas / Bungalows)</option>
                    <option value="commercial">Commercial (Malls / Plazas)</option>
                    <option value="landscape">Landscape (Master Subdivisions)</option>
                    <option value="architecture">Architecture General</option>
                    <option value="interior">Interior Design</option>
                    <option value="urban">Urban Planning</option>
                    <option value="working">Working Drawings</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Workflow Stage *
                  </label>
                  <select
                    value={editingProject.stage}
                    onChange={(e) => {
                      const newStage = e.target.value as any;
                      const newProgress =
                        newStage === "Completed" || newStage === "Published"
                          ? 100
                          : editingProject.progress === 100
                          ? 80
                          : editingProject.progress;
                      setEditingProject({
                        ...editingProject,
                        stage: newStage,
                        progress: newProgress,
                      });
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  >
                    <option value="Concept">Concept &amp; Sanction</option>
                    <option value="Working Drawings">Working Drawings</option>
                    <option value="Sanction Approval">Municipal Sanction</option>
                    <option value="Under Construction">Under Site Construction</option>
                    <option value="Completed">Completed (Ready to Publish)</option>
                    <option value="Published">Published on Website</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div className={`space-y-1.5 p-3 rounded-xl border transition-colors ${
                isDark ? "bg-[#0d0f16] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300">Execution Progress</span>
                  <span className="font-mono text-[#c8a96e] font-bold">
                    {editingProject.progress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={editingProject.progress}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      progress: Number(e.target.value),
                    })
                  }
                  className="w-full accent-[#c8a96e] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-200">
                    Project Space / Built-up Area (Scale)
                  </label>
                  <input
                    type="text"
                    value={editingProject.scale || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, scale: e.target.value })
                    }
                    placeholder="e.g. 4,500 sq.ft or 14 Acres (Project Space)"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingProject.location || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, location: e.target.value })
                    }
                    placeholder="e.g. Bhoom, Pune, Dharashiv"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editingProject.client || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, client: e.target.value })
                    }
                    placeholder="Client or firm name"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    value={editingProject.estimatedBudget || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, estimatedBudget: e.target.value })
                    }
                    placeholder="e.g. ₹95 Lakhs"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">
                  Internal Architectural Notes
                </label>
                <textarea
                  rows={2}
                  value={editingProject.notes || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, notes: e.target.value })
                  }
                  placeholder="Notes on drawing completion, structural checks, client approvals..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none resize-none border transition-colors ${
                  isDark
                    ? "bg-[#0e1118] border-[#272b38] text-white"
                    : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                }`}
                />
              </div>

              {/* ── PROJECT DRAWING / IMAGE SELECTION SECTION ── */}
              <div className="space-y-3 pt-3 border-t border-[#1e2330]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#c8a96e]" />
                    <label className="text-xs font-semibold text-neutral-200">
                      Project Drawing / Image *
                    </label>
                  </div>
                  <span className="text-[10px] font-mono text-[#c8a96e]">
                    Primary Portfolio Plate
                  </span>
                </div>

                {/* Current Active Image Preview Card */}
                <div className={`flex flex-col sm:flex-row items-center gap-3.5 p-3 rounded-xl border transition-colors ${
                  isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                }`}>
                  <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden border border-[#2d3242] bg-[#12151f] shrink-0 relative group">
                    <img
                      src={editingProject.image || "/images/project6.jpeg"}
                      alt={editingProject.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/project6.jpeg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[9px] font-mono text-white bg-black/80 px-2 py-0.5 rounded">
                        Active Plate
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-medium text-white">Current Project Plate</span>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-400 truncate max-w-xs">
                      {editingProject.image.startsWith("data:")
                        ? "Uploaded from local device"
                        : editingProject.image}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Visible in website gallery, discipline filters, and high-res blueprint inspector.
                    </p>
                  </div>
                </div>

                {/* Mode Selector Tabs: Upload File / Studio Presets / URL */}
                <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-lg border text-xs transition-colors ${
                  isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f0f3f8] border-[#d8dde6]"
                }`}>
                  <button
                    type="button"
                    onClick={() => setEditImageTab("upload")}
                    className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      editImageTab === "upload"
                        ? "bg-[#c8a96e] text-[#0c0e12] font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span className="truncate">Upload File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditImageTab("presets")}
                    className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      editImageTab === "presets"
                        ? "bg-[#c8a96e] text-[#0c0e12] font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="truncate">Studio Presets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditImageTab("url")}
                    className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      editImageTab === "url"
                        ? "bg-[#c8a96e] text-[#0c0e12] font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">Web URL</span>
                  </button>
                </div>

                {/* Mode A: Upload from Device */}
                {editImageTab === "upload" && (
                  <div className={`p-4 rounded-xl border border-dashed text-center space-y-2 transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#343a4a]" : "bg-[#f8f9fc] border-[#cbd2df]"
                  }`}>
                    <label className="cursor-pointer flex flex-col items-center gap-2 group py-2">
                      <div className="w-10 h-10 rounded-full bg-[#181c28] group-hover:bg-[#c8a96e]/20 text-[#c8a96e] flex items-center justify-center transition-colors">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white group-hover:text-[#c8a96e] transition-colors block">
                          Choose Image from Computer or Phone
                        </span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">
                          PNG, JPG, JPEG, WEBP renderings &amp; CAD blueprints
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileChange(e, (dataUrl) =>
                            setEditingProject({ ...editingProject, image: dataUrl })
                          )
                        }
                      />
                    </label>
                  </div>
                )}

                {/* Mode B: Studio Presets Gallery */}
                {editImageTab === "presets" && (
                  <div className={`space-y-2 p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                  }`}>
                    <span className="text-[11px] text-neutral-400 block font-medium">
                      Select an architectural drawing from the studio asset collection:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                      {STUDIO_DRAWING_PRESETS.map((preset, idx) => {
                        const isSelected = editingProject.image === preset.url;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() =>
                              setEditingProject({ ...editingProject, image: preset.url })
                            }
                            className={`relative rounded-lg overflow-hidden border aspect-4/3 text-left transition-all cursor-pointer group ${
                              isSelected
                                ? "border-[#c8a96e] ring-2 ring-[#c8a96e]/50"
                                : "border-[#232734] hover:border-neutral-500"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#c8a96e] text-[#0c0e12] flex items-center justify-center shadow">
                                <Check className="w-2.5 h-2.5 stroke-3" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1">
                              <span className="text-[8px] font-mono text-neutral-300 block truncate">
                                {preset.title}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mode C: Custom Web URL */}
                {editImageTab === "url" && (
                  <div className={`space-y-1.5 p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                  }`}>
                    <label className="text-[11px] text-neutral-400 block">
                      Enter external image or CDN URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or Google Drive / CDN link"
                      value={editingProject.image}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, image: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#12151f] border border-[#272b38] focus:border-[#c8a96e] rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
                    />
                  </div>
                )}

                {/* ── ONGOING PROJECT MULTIPLE SITE PHOTOS & DRAWING GALLERY ── */}
                <div className="space-y-3 pt-3 border-t border-[#1e2330]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? "text-white" : "text-neutral-900"}`}>

                        <Layers className="w-4 h-4 text-[#c8a96e]" />
                        <span>Ongoing Site Photos &amp; Drawing Gallery</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/30">
                          {(editingProject.gallery || []).length + 1} Total Photos
                        </span>
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Add multiple construction progress pics (excavation, foundation, elevation, site visits, blueprints).
                      </p>
                    </div>

                    {/* Quick Multi-Upload Button */}
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c8a96e]/15 hover:bg-[#c8a96e] text-[#c8a96e] hover:text-[#0c0e12] border border-[#c8a96e]/40 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm self-start sm:self-auto">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Multiple Pics</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleMultipleImagesFileChange(e, (newUrls) => {
                            const cur = editingProject.gallery || [];
                            setEditingProject({
                              ...editingProject,
                              gallery: [...cur, ...newUrls],
                            });
                          })
                        }
                      />
                    </label>
                  </div>

                  {/* Thumbnail Grid with Cover and Delete Actions */}
                  <div className={`p-3 rounded-xl border space-y-2.5 transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                  }`}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                      {/* 1. Primary Cover Photo Card */}
                      <div className="relative rounded-lg overflow-hidden border border-[#c8a96e] bg-[#12151f] aspect-4/3 group shadow">
                        <img
                          src={editingProject.image}
                          alt="Primary Cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-[#c8a96e] text-[#0c0e12] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          Cover Plate
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1 text-center">
                          <span className="text-[9px] font-mono text-[#c8a96e] block">
                            Main Portfolio Pic
                          </span>
                        </div>
                      </div>

                      {/* 2. Additional Gallery / Ongoing Site Progress Pics */}
                      {(editingProject.gallery || []).map((picUrl, pIdx) => (
                        <div
                          key={pIdx}
                          className="relative rounded-lg overflow-hidden border border-[#272b38] hover:border-neutral-500 bg-[#12151f] aspect-4/3 group transition-all"
                        >
                          <img
                            src={picUrl}
                            alt={`Site photo ${pIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-1 left-1 bg-black/75 backdrop-blur-sm text-neutral-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                            Site Pic #{pIdx + 1}
                          </div>

                          {/* Hover Actions: Set as Cover & Delete */}
                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={() => {
                                const currentCover = editingProject.image;
                                const newGallery = [...(editingProject.gallery || [])];
                                newGallery[pIdx] = currentCover;
                                setEditingProject({
                                  ...editingProject,
                                  image: picUrl,
                                  gallery: newGallery,
                                });
                                showToast(`Set as new cover plate!`);
                              }}
                              className="px-2 py-1 bg-[#c8a96e] text-[#0c0e12] text-[10px] font-bold rounded shadow hover:bg-[#dfc085] cursor-pointer"
                              title="Set this photo as primary cover"
                            >
                              Make Cover
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingProject.gallery || []).filter(
                                  (_, idx) => idx !== pIdx
                                );
                                setEditingProject({
                                  ...editingProject,
                                  gallery: updated,
                                });
                                showToast("Photo removed from gallery.");
                              }}
                              className="px-2 py-0.5 bg-rose-600/90 text-white text-[10px] font-medium rounded hover:bg-rose-500 cursor-pointer flex items-center gap-1"
                              title="Remove photo"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Preset / URL Append Bar */}
                    <div className="pt-2 border-t border-[#1e2330] flex items-center justify-between gap-2 flex-wrap text-xs">
                      <span className="text-[11px] text-neutral-400">
                        Need more sample architectural drawings?
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = editingProject.gallery || [];
                            const randomPreset =
                              STUDIO_DRAWING_PRESETS[
                                Math.floor(Math.random() * STUDIO_DRAWING_PRESETS.length)
                              ]?.url || "/images/arc4.jpg";
                            setEditingProject({
                              ...editingProject,
                              gallery: [...cur, randomPreset],
                            });
                            showToast("Added architectural plate preset to ongoing photos!");
                          }}
                          className="px-2 py-1 bg-[#1a1f2c] hover:bg-[#252c3e] text-neutral-300 text-[11px] rounded border border-[#2d3446] cursor-pointer"
                        >
                          + Add Studio Blueprint Preset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const toDelete = editingProject;
                    setEditingProject(null);
                    setProjectToDelete(toDelete);
                  }}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded-xl border border-rose-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Project</span>
                </button>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className={`w-full sm:w-auto px-4 py-2.5 text-xs rounded-xl cursor-pointer text-center transition-colors ${
                    isDark ? "text-neutral-400 hover:text-white bg-[#181c28]" : "text-neutral-700 hover:text-black bg-[#f0f3f8] border border-[#d8dfea]"
                  }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ────────────────── */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className={`w-full max-w-md rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative border transition-colors ${
            isDark ? "bg-[#12151f] border-rose-500/40 text-white" : "bg-white border-rose-500/50 text-neutral-900 shadow-2xl"
          }`}>
            <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className={`font-serif text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                Delete &ldquo;{projectToDelete.title}&rdquo;?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                This will permanently remove this project from your working pipeline. If it was already published, it will also be removed from the live website portfolio.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-2.5 pt-2 w-full">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className={`w-full sm:w-auto px-4 py-2.5 text-xs rounded-xl cursor-pointer text-center transition-colors ${
                isDark ? "text-neutral-300 hover:text-white bg-[#181c28]" : "text-neutral-700 hover:text-black bg-[#f0f3f8] border border-[#d8dfea]"
              }`}
              >
                No, Keep Project
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-lg text-center"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CALIBRATE ANALYTICS MODAL ────────────────── */}
      {isAnalyticsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start sm:py-8">
          <div className={`w-full max-w-xl rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative my-auto sm:my-0 border transition-colors ${
            isDark ? "bg-[#12151f] border-[#272b38] text-white" : "bg-white border-[#dce2ec] text-neutral-900 shadow-2xl"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#c8a96e] font-bold">
                  STUDIO TELEMETRY &amp; GA4 ENGINE
                </span>
                <h3 className={`font-serif text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Calibrate / Correct Analytics
                </h3>
              </div>
              <button
                onClick={() => setIsAnalyticsModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? "bg-[#181c28] text-neutral-400 hover:text-white" : "bg-[#f0f3f8] text-neutral-600 hover:text-neutral-900"
              }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs leading-relaxed p-3 rounded-xl border transition-colors ${
              isDark ? "bg-[#0e1118] text-neutral-300 border-[#232734]" : "bg-[#f8f9fc] text-neutral-700 border-[#e2e6ee]"
            }`}>
              💡 <strong>How it works:</strong> The site tracks real page impressions and blueprint inspections locally in the visitor&apos;s browser. Enter your actual studio metrics below from <strong>Google Analytics 4</strong> or <strong>Google Search Console</strong> to correct these values.
            </p>

            <form onSubmit={handleSaveAnalytics} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Total Page Impressions
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={analyticsForm.totalPageViews}
                    onChange={(e) =>
                      setAnalyticsForm({
                        ...analyticsForm,
                        totalPageViews: Number(e.target.value),
                      })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Unique Visitors
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={analyticsForm.uniqueVisitors}
                    onChange={(e) =>
                      setAnalyticsForm({
                        ...analyticsForm,
                        uniqueVisitors: Number(e.target.value),
                      })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Active Viewers Now
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={analyticsForm.activeNow}
                    onChange={(e) =>
                      setAnalyticsForm({
                        ...analyticsForm,
                        activeNow: Number(e.target.value),
                      })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Blueprint Inspections (Modal Clicks)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={analyticsForm.blueprintInspections}
                    onChange={(e) =>
                      setAnalyticsForm({
                        ...analyticsForm,
                        blueprintInspections: Number(e.target.value),
                      })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">
                  Google Analytics 4 (GA4) Measurement ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. G-ABC1234XYZ"
                  value={ga4Id}
                  onChange={(e) => setGa4Id(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                  isDark
                    ? "bg-[#0e1118] border-[#272b38] text-white placeholder-neutral-500"
                    : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                }`}
                />
                <p className="text-[11px] text-neutral-400">
                  If provided, this links your official Google Analytics tracking ID to your studio configuration.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={handleResetAnalytics}
                  className="w-full sm:w-auto px-3.5 py-2.5 text-xs text-neutral-400 hover:text-white bg-[#181c28] rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-center"
                  title="Reset to factory baseline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Baseline</span>
                </button>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsAnalyticsModalOpen(false)}
                    className={`w-full sm:w-auto px-4 py-2.5 text-xs rounded-xl cursor-pointer text-center transition-colors ${
                    isDark ? "text-neutral-400 hover:text-white bg-[#181c28]" : "text-neutral-700 hover:text-black bg-[#f0f3f8] border border-[#d8dfea]"
                  }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md text-center"
                  >
                    Save Calibrated Analytics
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD NEW PROJECT MODAL ───────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-4 flex justify-center items-start sm:py-8">
          <div className={`w-full max-w-xl rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative my-auto sm:my-0 border transition-colors ${
            isDark ? "bg-[#12151f] border-[#272b38] text-white" : "bg-white border-[#dce2ec] text-neutral-900 shadow-2xl"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#c8a96e] font-bold">
                  PROJECT PIPELINE WORKSPACE
                </span>
                <h3 className={`font-serif text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Add New Architectural Project
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? "bg-[#181c28] text-neutral-400 hover:text-white" : "bg-[#f0f3f8] text-neutral-600 hover:text-neutral-900"
              }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className={`space-y-1.5 p-3.5 rounded-xl border transition-colors ${
                isDark ? "bg-[#171b26] border-[#2c3244]" : "bg-[#f8f9fc] border-[#e2e6ee]"
              }`}>
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? "text-white" : "text-neutral-900"}`}>
                    <span className="text-[#c8a96e]">●</span> Name of the Project (Project Title) *
                  </label>
                  <span className="text-[10px] font-mono uppercase text-[#c8a96e] bg-[#c8a96e]/10 px-2 py-0.5 rounded">
                    Required Field
                  </span>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter Name of the Project (e.g. Skyline Commercial Tower Phase 3)"
                  value={newProjectForm.title}
                  onChange={(e) =>
                    setNewProjectForm({ ...newProjectForm, title: e.target.value })
                  }
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#c8a96e] focus:border-[#c8a96e] transition-colors border ${
                  isDark
                    ? "bg-[#0e1118] border-[#3b4256] text-white placeholder-neutral-400"
                    : "bg-white border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                }`}
                />
                <p className="text-[11px] text-neutral-400">
                  This project name will be displayed across working drawings, client reports, and the live portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Discipline Typology *
                  </label>
                  <select
                    value={newProjectForm.category}
                    onChange={(e) =>
                      setNewProjectForm({
                        ...newProjectForm,
                        category: e.target.value as any,
                      })
                    }
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  >
                    <option value="residential">Residential (Villas / Bungalows)</option>
                    <option value="commercial">Commercial (Malls / Plazas)</option>
                    <option value="landscape">Landscape (Master Subdivisions)</option>
                    <option value="architecture">Architecture General</option>
                    <option value="interior">Interior Design</option>
                    <option value="urban">Urban Planning</option>
                    <option value="working">Working Drawings</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Initial Stage / Status *
                  </label>
                  <select
                    value={newProjectForm.status}
                    onChange={(e) =>
                      setNewProjectForm({
                        ...newProjectForm,
                        status: e.target.value as any,
                      })
                    }
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                  }`}
                  >
                    <option value="working">Working in Progress (Drafting)</option>
                    <option value="completed">Completed (Ready to Publish)</option>
                    <option value="published">Publish to Live Site Immediately</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-200">
                    Project Space / Built-up Area (Scale)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4,500 sq.ft or 12 Acres (Project Space)"
                    value={newProjectForm.scale}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, scale: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white placeholder-neutral-400"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                  }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Project Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hinjawadi Pune, Bhoom, Dharashiv"
                    value={newProjectForm.location}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, location: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white placeholder-neutral-500"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                  }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shri Patil & Family"
                    value={newProjectForm.client}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, client: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white placeholder-neutral-500"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                  }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹85 Lakhs"
                    value={newProjectForm.estimatedBudget}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, estimatedBudget: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                    isDark
                      ? "bg-[#0e1118] border-[#272b38] text-white placeholder-neutral-500"
                      : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                  }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">
                  Architectural Scope / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail scope (e.g. Structural engineering, Vaastu compliance, Turnkey)"
                  value={newProjectForm.scope}
                  onChange={(e) =>
                    setNewProjectForm({ ...newProjectForm, scope: e.target.value })
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none resize-none border transition-colors ${
                  isDark
                    ? "bg-[#0e1118] border-[#272b38] text-white placeholder-neutral-500"
                    : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                }`}
                />
              </div>

              {/* ── PROJECT DRAWING / IMAGE SELECTION SECTION ── */}
              <div className="space-y-3 pt-3 border-t border-[#1e2330]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#c8a96e]" />
                    <label className="text-xs font-semibold text-neutral-200">
                      Project Drawing / Image *
                    </label>
                  </div>
                  <span className="text-[10px] font-mono text-[#c8a96e]">
                    Primary Portfolio Plate
                  </span>
                </div>

                {/* Current Active Image Preview Card */}
                <div className={`flex flex-col sm:flex-row items-center gap-3.5 p-3 rounded-xl border transition-colors ${
                  isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                }`}>
                  <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden border border-[#2d3242] bg-[#12151f] shrink-0 relative group">
                    <img
                      src={newProjectForm.image || "/images/project6.jpeg"}
                      alt="Selected preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/project6.jpeg";
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <span className="text-xs font-medium text-white block">Selected Plate</span>
                    <p className="text-[11px] font-mono text-neutral-400 truncate max-w-xs">
                      {newProjectForm.image.startsWith("data:")
                        ? "Uploaded from local device"
                        : newProjectForm.image}
                    </p>
                  </div>
                </div>

                {/* Mode Selector Tabs: Upload File / Studio Presets / URL */}
                <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-lg border text-xs transition-colors ${
                  isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f0f3f8] border-[#d8dde6]"
                }`}>
                  <button
                    type="button"
                    onClick={() => setAddImageTab("upload")}
                    className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      addImageTab === "upload"
                        ? "bg-[#c8a96e] text-[#0c0e12] font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span className="truncate">Upload File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddImageTab("presets")}
                    className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      addImageTab === "presets"
                        ? "bg-[#c8a96e] text-[#0c0e12] font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="truncate">Studio Presets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddImageTab("url")}
                    className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      addImageTab === "url"
                        ? "bg-[#c8a96e] text-[#0c0e12] font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">Web URL</span>
                  </button>
                </div>

                {/* Mode A: Upload from Device */}
                {addImageTab === "upload" && (
                  <div className={`p-4 rounded-xl border border-dashed text-center space-y-2 transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#343a4a]" : "bg-[#f8f9fc] border-[#cbd2df]"
                  }`}>
                    <label className="cursor-pointer flex flex-col items-center gap-2 group py-2">
                      <div className="w-10 h-10 rounded-full bg-[#181c28] group-hover:bg-[#c8a96e]/20 text-[#c8a96e] flex items-center justify-center transition-colors">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white group-hover:text-[#c8a96e] transition-colors block">
                          Choose Image from Computer or Phone
                        </span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">
                          PNG, JPG, JPEG, WEBP renderings &amp; CAD blueprints
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileChange(e, (dataUrl) =>
                            setNewProjectForm({ ...newProjectForm, image: dataUrl })
                          )
                        }
                      />
                    </label>
                  </div>
                )}

                {/* Mode B: Studio Presets Gallery */}
                {addImageTab === "presets" && (
                  <div className={`space-y-2 p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                  }`}>
                    <span className="text-[11px] text-neutral-400 block font-medium">
                      Select an architectural drawing from the studio asset collection:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                      {STUDIO_DRAWING_PRESETS.map((preset, idx) => {
                        const isSelected = newProjectForm.image === preset.url;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() =>
                              setNewProjectForm({ ...newProjectForm, image: preset.url })
                            }
                            className={`relative rounded-lg overflow-hidden border aspect-4/3 text-left transition-all cursor-pointer group ${
                              isSelected
                                ? "border-[#c8a96e] ring-2 ring-[#c8a96e]/50"
                                : "border-[#232734] hover:border-neutral-500"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#c8a96e] text-[#0c0e12] flex items-center justify-center shadow">
                                <Check className="w-2.5 h-2.5 stroke-3" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1">
                              <span className="text-[8px] font-mono text-neutral-300 block truncate">
                                {preset.title}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mode C: Custom Web URL */}
                {addImageTab === "url" && (
                  <div className={`space-y-1.5 p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                  }`}>
                    <label className="text-[11px] text-neutral-400 block">
                      Enter external image or CDN URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or CDN link"
                      value={newProjectForm.image}
                      onChange={(e) =>
                        setNewProjectForm({ ...newProjectForm, image: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#12151f] border border-[#272b38] focus:border-[#c8a96e] rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
                    />
                  </div>
                )}

                {/* ── ONGOING PROJECT MULTIPLE SITE PHOTOS & DRAWING GALLERY ── */}
                <div className="space-y-3 pt-3 border-t border-[#1e2330]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? "text-white" : "text-neutral-900"}`}>

                        <Layers className="w-4 h-4 text-[#c8a96e]" />
                        <span>Ongoing Site Photos &amp; Drawing Gallery</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c8a96e]/20 text-[#c8a96e] border border-[#c8a96e]/30">
                          {(newProjectForm.gallery || []).length + 1} Total Photos
                        </span>
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Attach multiple construction progress pics right during creation.
                      </p>
                    </div>

                    {/* Quick Multi-Upload Button */}
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c8a96e]/15 hover:bg-[#c8a96e] text-[#c8a96e] hover:text-[#0c0e12] border border-[#c8a96e]/40 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm self-start sm:self-auto">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Multiple Pics</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleMultipleImagesFileChange(e, (newUrls) => {
                            const cur = newProjectForm.gallery || [];
                            setNewProjectForm({
                              ...newProjectForm,
                              gallery: [...cur, ...newUrls],
                            });
                          })
                        }
                      />
                    </label>
                  </div>

                  {/* Thumbnail Grid with Cover and Delete Actions */}
                  <div className={`p-3 rounded-xl border space-y-2.5 transition-colors ${
                    isDark ? "bg-[#0a0c12] border-[#232734]" : "bg-[#f8f9fc] border-[#e2e6ee]"
                  }`}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                      {/* 1. Primary Cover Photo Card */}
                      <div className="relative rounded-lg overflow-hidden border border-[#c8a96e] bg-[#12151f] aspect-4/3 group shadow">
                        <img
                          src={newProjectForm.image}
                          alt="Primary Cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-[#c8a96e] text-[#0c0e12] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          Cover Plate
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1 text-center">
                          <span className="text-[9px] font-mono text-[#c8a96e] block">
                            Main Portfolio Pic
                          </span>
                        </div>
                      </div>

                      {/* 2. Additional Gallery / Ongoing Site Progress Pics */}
                      {(newProjectForm.gallery || []).map((picUrl, pIdx) => (
                        <div
                          key={pIdx}
                          className="relative rounded-lg overflow-hidden border border-[#272b38] hover:border-neutral-500 bg-[#12151f] aspect-4/3 group transition-all"
                        >
                          <img
                            src={picUrl}
                            alt={`Site photo ${pIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-1 left-1 bg-black/75 backdrop-blur-sm text-neutral-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                            Site Pic #{pIdx + 1}
                          </div>

                          {/* Hover Actions: Set as Cover & Delete */}
                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={() => {
                                const currentCover = newProjectForm.image;
                                const newGallery = [...(newProjectForm.gallery || [])];
                                newGallery[pIdx] = currentCover;
                                setNewProjectForm({
                                  ...newProjectForm,
                                  image: picUrl,
                                  gallery: newGallery,
                                });
                                showToast(`Set as new cover plate!`);
                              }}
                              className="px-2 py-1 bg-[#c8a96e] text-[#0c0e12] text-[10px] font-bold rounded shadow hover:bg-[#dfc085] cursor-pointer"
                              title="Set this photo as primary cover"
                            >
                              Make Cover
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = (newProjectForm.gallery || []).filter(
                                  (_, idx) => idx !== pIdx
                                );
                                setNewProjectForm({
                                  ...newProjectForm,
                                  gallery: updated,
                                });
                                showToast("Photo removed from gallery.");
                              }}
                              className="px-2 py-0.5 bg-rose-600/90 text-white text-[10px] font-medium rounded hover:bg-rose-500 cursor-pointer flex items-center gap-1"
                              title="Remove photo"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Preset Append */}
                    <div className="pt-2 border-t border-[#1e2330] flex items-center justify-between gap-2 flex-wrap text-xs">
                      <span className="text-[11px] text-neutral-400">
                        Need sample architectural blueprint presets?
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const cur = newProjectForm.gallery || [];
                          const randomPreset =
                            STUDIO_DRAWING_PRESETS[
                              Math.floor(Math.random() * STUDIO_DRAWING_PRESETS.length)
                            ]?.url || "/images/arc4.jpg";
                          setNewProjectForm({
                            ...newProjectForm,
                            gallery: [...cur, randomPreset],
                          });
                          showToast("Added architectural drawing preset to gallery!");
                        }}
                        className="px-2 py-1 bg-[#1a1f2c] hover:bg-[#252c3e] text-neutral-300 text-[11px] rounded border border-[#2d3446] cursor-pointer"
                      >
                        + Add Studio Blueprint Preset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`w-full sm:w-auto px-4 py-2.5 text-xs rounded-xl cursor-pointer text-center transition-colors ${
                    isDark ? "text-neutral-400 hover:text-white bg-[#181c28]" : "text-neutral-700 hover:text-black bg-[#f0f3f8] border border-[#d8dfea]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 text-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {newProjectForm.status === "published"
                      ? "Create & Publish Live"
                      : "Save to Working Pipeline"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CLEAR ACTIVITY AUDIT CONFIRMATION MODAL ── */}
      {showActivityConfirmClear && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border transition-colors ${
            isDark ? "bg-[#131620] border-[#252936] text-white" : "bg-white border-[#dce2ec] text-neutral-900 shadow-2xl"
          }`}>
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Clear Recent Activity Feed?
                </h3>
                <p className="text-xs text-neutral-400">
                  This will remove all recorded audit logs from local storage.
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed bg-[#0b0e15] p-3 rounded-xl border border-[#1e2330]">
              All project creation, status toggle, and deletion logs will be wiped. You can restore the default architectural activity audit trail at any time using the <strong>&ldquo;Restore Defaults&rdquo;</strong> button.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowActivityConfirmClear(false)}
                className="px-4 py-2 bg-[#1a1e28] hover:bg-[#252a38] text-neutral-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearActivities}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-lg shadow-rose-600/20"
              >
                Clear Activity Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QUICK CHANGE PASSCODE MODAL ─────────────── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 relative border transition-colors ${
            isDark ? "bg-[#12151f] border-[#272b38] text-white" : "bg-white border-[#dce2ec] text-neutral-900 shadow-2xl"
          }`}>
            <div className="flex items-center justify-between border-b border-[#1e2330] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#c8a96e]/15 border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Change Studio Passcode
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Master admin passcode for console &amp; website editor.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordChangeError("");
                  setPasswordChangeSuccess("");
                }}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1a1e28] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordChangeSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{passwordChangeSuccess}</span>
              </div>
            )}

            {passwordChangeError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{passwordChangeError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Current Passcode *
                </label>
                <input
                  type={showPasswordText ? "text" : "password"}
                  value={currentPasswordInput}
                  onChange={(e) => {
                    setCurrentPasswordInput(e.target.value);
                    setPasswordChangeError("");
                  }}
                  placeholder="Enter current passcode"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  New Passcode *
                </label>
                <input
                  type={showPasswordText ? "text" : "password"}
                  value={newPasswordInput}
                  onChange={(e) => {
                    setNewPasswordInput(e.target.value);
                    setPasswordChangeError("");
                  }}
                  placeholder="Enter new passcode (4+ characters)"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Confirm New Passcode *
                </label>
                <input
                  type={showPasswordText ? "text" : "password"}
                  value={confirmPasswordInput}
                  onChange={(e) => {
                    setConfirmPasswordInput(e.target.value);
                    setPasswordChangeError("");
                  }}
                  placeholder="Confirm new passcode"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="text-[11px] text-neutral-400 hover:text-[#c8a96e] flex items-center gap-1 cursor-pointer"
                >
                  {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasswordText ? "Hide Characters" : "Show Characters"}</span>
                </button>
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordChangeError("");
                    setPasswordChangeSuccess("");
                  }}
                  className={`w-full sm:w-auto px-4 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer text-center ${
                  isDark ? "bg-[#181c28] hover:bg-[#202534] text-neutral-300" : "bg-[#f0f3f8] hover:bg-[#e4e8f0] text-neutral-700 border border-[#d8dfea]"
                }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md text-center"
                >
                  Update Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD ADMIN USER MODAL (WITH DISTINCT PASSWORD) ── */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto p-3 sm:p-4 flex justify-center items-start sm:py-8">
          <div
            className={`w-full max-w-lg rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative my-auto sm:my-0 border transition-colors ${
              isDark ? "bg-[#12151f] border-[#272b38] text-white" : "bg-white border-[#dce2ec] text-neutral-900 shadow-2xl"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1e2330] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#c8a96e]/15 border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-serif text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                    Add New Admin User
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Create an administrator with their own distinct individual password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1a1e28] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Form */}
            <form onSubmit={handleCreateAdminUser} className="space-y-4">
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ar. Rohit Shinde"
                    value={userForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoUsername = name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
                      setUserForm((prev) => ({
                        ...prev,
                        name,
                        username: prev.username || autoUsername,
                      }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white placeholder-neutral-500"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                    <span>Username / Login Handle *</span>
                    <span className="text-[10px] text-neutral-500 font-mono">No spaces</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">@</span>
                    <input
                      type="text"
                      required
                      placeholder="rohit"
                      value={userForm.username}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          username: e.target.value.toLowerCase().replace(/\s+/g, ""),
                        })
                      }
                      className={`w-full pl-7 pr-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                        isDark
                          ? "bg-[#0b0e15] border-[#272b38] text-white placeholder-neutral-500"
                          : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* ── DISTINCT INDIVIDUAL PASSWORD INPUT ── */}
              <div
                className={`p-3.5 rounded-xl border space-y-2 transition-colors ${
                  isDark ? "bg-[#0b0e15] border-[#c8a96e]/40" : "bg-[#fdfbf7] border-[#c8a96e]/60 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#c8a96e] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Distinct Individual Password *</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const suggested = generateSuggestedPassword();
                      setUserForm({ ...userForm, password: suggested });
                      showToast(`Generated distinct passcode: "${suggested}"`);
                    }}
                    className="text-[11px] text-[#c8a96e] hover:underline flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <span>🎲 Generate Random</span>
                  </button>
                </div>

                <p className="text-[11px] text-neutral-400">
                  This admin will use this separate password to unlock the studio console.
                </p>

                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter distinct password (e.g. mohalkar4921)"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                      isDark
                        ? "bg-[#141824] border-[#2d3448] text-white placeholder-neutral-500"
                        : "bg-white border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                    }`}
                  />
                </div>
              </div>

              {/* Role & Access Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Studio Role *
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                  >
                    <option value="Associate Architect">Associate Architect</option>
                    <option value="Principal Architect">Principal Architect</option>
                    <option value="Studio Manager">Studio Manager</option>
                    <option value="Project Lead">Project Lead</option>
                    <option value="Draftsman / Visualizer">Draftsman / Visualizer</option>
                    <option value="Editor">Content Editor</option>
                    <option value="Viewer">Read-Only Viewer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Access Permission Level *
                  </label>
                  <select
                    value={userForm.accessLevel}
                    onChange={(e) => setUserForm({ ...userForm, accessLevel: e.target.value as any })}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                  >
                    <option value="Project Manager">Project Manager (Pipeline &amp; Publish)</option>
                    <option value="Super Admin">Super Admin (Full Console Access)</option>
                    <option value="Enquiry & Telemetry Manager">Enquiries &amp; Telemetry Manager</option>
                    <option value="Read Only">Read Only (Inspection)</option>
                  </select>
                </div>
              </div>

              {/* Email & Phone (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="user@mohalkar.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white placeholder-neutral-500"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Mobile Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white placeholder-neutral-500"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900 placeholder-neutral-400"
                    }`}
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                  isDark ? "bg-[#090b10] border-[#1e2330]" : "bg-[#f4f6fa] border-[#e2e6ee]"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                  New Admin Credentials Summary:
                </span>
                <div className="flex items-center justify-between font-mono text-[11px] text-neutral-300">
                  <span>Username: <strong>@{userForm.username || "username"}</strong></span>
                  <span>Passcode: <strong className="text-[#c8a96e]">{userForm.password || "••••"}</strong></span>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className={`w-full sm:w-auto px-4 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer text-center ${
                    isDark ? "bg-[#181c28] hover:bg-[#202534] text-neutral-300" : "bg-[#f0f3f8] hover:bg-[#e4e8f0] text-neutral-700 border border-[#d8dfea]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 text-center"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT ADMIN USER & PASSWORD MODAL ────────── */}
      {editingAdminUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto p-3 sm:p-4 flex justify-center items-start sm:py-8">
          <div
            className={`w-full max-w-lg rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative my-auto sm:my-0 border transition-colors ${
              isDark ? "bg-[#12151f] border-[#272b38] text-white" : "bg-white border-[#dce2ec] text-neutral-900 shadow-2xl"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1e2330] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#c8a96e]/15 border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e]">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-serif text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                    Edit Admin &amp; Password
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Update profile info, role permissions, or distinct individual password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingAdminUser(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1a1e28] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Username / Handle *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">@</span>
                    <input
                      type="text"
                      required
                      value={userForm.username}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          username: e.target.value.toLowerCase().replace(/\s+/g, ""),
                        })
                      }
                      className={`w-full pl-7 pr-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                        isDark
                          ? "bg-[#0b0e15] border-[#272b38] text-white"
                          : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* ── UPDATE DISTINCT PASSWORD ── */}
              <div
                className={`p-3.5 rounded-xl border space-y-2 transition-colors ${
                  isDark ? "bg-[#0b0e15] border-[#c8a96e]/40" : "bg-[#fdfbf7] border-[#c8a96e]/60 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#c8a96e] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Change Individual Password *</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const suggested = generateSuggestedPassword();
                      setUserForm({ ...userForm, password: suggested });
                      showToast(`Generated new passcode: "${suggested}"`);
                    }}
                    className="text-[11px] text-[#c8a96e] hover:underline flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <span>🎲 Generate New</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none font-mono border transition-colors ${
                      isDark
                        ? "bg-[#141824] border-[#2d3448] text-white"
                        : "bg-white border-[#d8dde6] text-neutral-900"
                    }`}
                  />
                </div>
              </div>

              {/* Role & Access Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Studio Role *
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                  >
                    <option value="Associate Architect">Associate Architect</option>
                    <option value="Principal Architect">Principal Architect</option>
                    <option value="Studio Manager">Studio Manager</option>
                    <option value="Project Lead">Project Lead</option>
                    <option value="Draftsman / Visualizer">Draftsman / Visualizer</option>
                    <option value="Editor">Content Editor</option>
                    <option value="Viewer">Read-Only Viewer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Access Level *
                  </label>
                  <select
                    value={userForm.accessLevel}
                    onChange={(e) => setUserForm({ ...userForm, accessLevel: e.target.value as any })}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs focus:border-[#c8a96e] focus:outline-none border transition-colors ${
                      isDark
                        ? "bg-[#0b0e15] border-[#272b38] text-white"
                        : "bg-[#f8f9fc] border-[#d8dde6] text-neutral-900"
                    }`}
                  >
                    <option value="Project Manager">Project Manager</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Enquiry & Telemetry Manager">Enquiry &amp; Telemetry Manager</option>
                    <option value="Read Only">Read Only</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Account Status
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={userForm.status === "active"}
                      onChange={() => setUserForm({ ...userForm, status: "active" })}
                    />
                    <span>Active (Can log in)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="suspended"
                      checked={userForm.status === "suspended"}
                      onChange={() => setUserForm({ ...userForm, status: "suspended" })}
                    />
                    <span>Suspended (Disabled)</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const toDelete = editingAdminUser;
                    setEditingAdminUser(null);
                    setUserToDeleteModal(toDelete);
                  }}
                  disabled={
                    adminUsers.length <= 1 ||
                    (editingAdminUser.accessLevel === "Super Admin" &&
                      adminUsers.filter((u) => u.accessLevel === "Super Admin" && u.status === "active").length <= 1)
                  }
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                    adminUsers.length <= 1 ||
                    (editingAdminUser.accessLevel === "Super Admin" &&
                      adminUsers.filter((u) => u.accessLevel === "Super Admin" && u.status === "active").length <= 1)
                      ? "opacity-40 cursor-not-allowed bg-transparent border-neutral-800 text-neutral-600"
                      : "bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-500/30 cursor-pointer"
                  }`}
                  title="Permanently remove this administrator account"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Admin Account</span>
                </button>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAdminUser(null)}
                    className={`px-4 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer text-center ${
                      isDark ? "bg-[#181c28] hover:bg-[#202534] text-neutral-300" : "bg-[#f0f3f8] hover:bg-[#e4e8f0] text-neutral-700 border border-[#d8dfea]"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#c8a96e] hover:bg-[#dfc085] text-[#0c0e12] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 text-center"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save User &amp; Password</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE ADMIN USER CONFIRMATION MODAL ───── */}
      {userToDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 border transition-colors ${
              isDark ? "bg-[#12151f] border-rose-500/40 text-white" : "bg-white border-rose-500/50 text-neutral-900 shadow-2xl"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className={`font-serif text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>
                Remove Admin &ldquo;{userToDeleteModal.name}&rdquo;?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                This will delete the administrator account <strong>@{userToDeleteModal.username}</strong> and revoke their password login credentials.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-2.5 pt-2 w-full">
              <button
                type="button"
                onClick={() => setUserToDeleteModal(null)}
                className={`w-full sm:w-auto px-4 py-2.5 text-xs rounded-xl cursor-pointer text-center transition-colors ${
                  isDark ? "text-neutral-300 hover:text-white bg-[#181c28]" : "text-neutral-700 hover:text-black bg-[#f0f3f8] border border-[#d8dfea]"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(userToDeleteModal)}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-lg text-center"
              >
                Yes, Delete Admin User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
