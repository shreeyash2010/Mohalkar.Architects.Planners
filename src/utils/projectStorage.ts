import { PROJECTS_DATA, ProjectItem } from "../data/projectsData";
import {
  WorkingProject,
  INITIAL_WORKING_PROJECTS,
  ClientEnquiry,
  INITIAL_CLIENT_ENQUIRIES,
  ViewerInsight,
  MOCK_VIEWER_INSIGHTS,
  AdminActivity,
  INITIAL_ADMIN_ACTIVITIES,
} from "../data/adminData";

const STORAGE_PUBLISHED_KEY = "mohalkar_published_projects_v5";
const STORAGE_WORKING_KEY = "mohalkar_working_projects_v5";
const STORAGE_UNPUBLISHED_KEY = "mohalkar_unpublished_blacklist_v5";
const STORAGE_ENQUIRIES_KEY = "mohalkar_admin_enquiries_v2";
const STORAGE_ANALYTICS_KEY = "mohalkar_studio_analytics_v2";
const STORAGE_ACTIVITIES_KEY = "mohalkar_admin_activities_v2";

// In-memory fallback map for high-capacity runtime data if localStorage hits browser quota
const memoryStore = new Map<string, string>();

/**
 * Safe local storage setItem wrapper that prevents quota crashes and automatically
 * handles quota compaction when working with photo galleries.
 */
export const safeSetItem = (key: string, value: string): boolean => {
  // Always update memory store
  memoryStore.set(key, value);

  if (typeof window === "undefined" || !window.localStorage) {
    return true;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`LocalStorage quota exceeded while saving "${key}". Attempting smart compaction...`, error);

    try {
      // 1. Compact non-essential keys first (trim older activity logs and stats)
      const activities = localStorage.getItem(STORAGE_ACTIVITIES_KEY);
      if (activities) {
        try {
          const parsed = JSON.parse(activities);
          localStorage.setItem(STORAGE_ACTIVITIES_KEY, JSON.stringify(parsed.slice(0, 15)));
        } catch {
          localStorage.removeItem(STORAGE_ACTIVITIES_KEY);
        }
      }

      // Try setting again
      localStorage.setItem(key, value);
      return true;
    } catch {
      // 2. If still full, try saving a slightly sanitized version or relying on in-memory store
      console.warn(`Persistent storage fallback active for "${key}". Data safely retained in memory.`);
      return false;
    }
  }
};

/**
 * Safe local storage getItem with in-memory fallback.
 */
export const safeGetItem = (key: string): string | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    } catch (e) {
      console.warn(`Failed reading key "${key}" from localStorage:`, e);
    }
  }
  return memoryStore.get(key) || null;
};

// Helper: Normalize string for comparison
const normalize = (str?: string) => (str || "").toLowerCase().trim();

// Get the blacklist of unpublished IDs and titles
export const getUnpublishedBlacklist = (): Set<string> => {
  try {
    const stored = safeGetItem(STORAGE_UNPUBLISHED_KEY);
    if (stored) {
      const arr: string[] = JSON.parse(stored);
      return new Set(arr.map(normalize));
    }
  } catch (e) {
    console.warn("Error reading unpublished blacklist:", e);
  }
  return new Set<string>();
};

// Add ID and/or title to unpublished blacklist
export const addUnpublishedId = (id: string, title?: string): void => {
  try {
    const list = getUnpublishedBlacklist();
    if (id) list.add(normalize(id));
    if (title) list.add(normalize(title));
    safeSetItem(STORAGE_UNPUBLISHED_KEY, JSON.stringify(Array.from(list)));
  } catch (e) {
    console.error("Error saving to unpublished blacklist:", e);
  }
};

// Remove from unpublished blacklist (when re-publishing)
export const removeUnpublishedId = (id: string, title?: string): void => {
  try {
    const list = getUnpublishedBlacklist();
    if (id) list.delete(normalize(id));
    if (title) list.delete(normalize(title));
    safeSetItem(STORAGE_UNPUBLISHED_KEY, JSON.stringify(Array.from(list)));
  } catch (e) {
    console.error("Error removing from unpublished blacklist:", e);
  }
};

// Get working projects
export const getWorkingProjects = (): WorkingProject[] => {
  try {
    const stored = safeGetItem(STORAGE_WORKING_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Error reading working projects from storage:", e);
  }
  return INITIAL_WORKING_PROJECTS;
};

// Save working projects
export const saveWorkingProjects = (projects: WorkingProject[]): void => {
  try {
    safeSetItem(STORAGE_WORKING_KEY, JSON.stringify(projects));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mohalkar:projects-updated"));
    }
  } catch (e) {
    console.error("Error saving working projects:", e);
  }
};

// Save published projects
export const savePublishedProjects = (projects: ProjectItem[]): void => {
  try {
    safeSetItem(STORAGE_PUBLISHED_KEY, JSON.stringify(projects));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mohalkar:projects-updated"));
    }
  } catch (e) {
    console.error("Error saving published projects:", e);
  }
};

// Get all active published projects that must appear on the live website
export const getPublishedProjects = (): ProjectItem[] => {
  const blacklist = getUnpublishedBlacklist();

  try {
    const stored = safeGetItem(STORAGE_PUBLISHED_KEY);
    if (stored !== null) {
      const parsed: ProjectItem[] = JSON.parse(stored);
      // Filter out anything in the unpublished blacklist
      return parsed.filter(
        (p) => !blacklist.has(normalize(p.id)) && !blacklist.has(normalize(p.title))
      );
    }
  } catch (e) {
    console.warn("Error reading published projects from storage:", e);
  }

  // Initial initialization: base archive minus any unpublished
  const initialPublished = PROJECTS_DATA.filter(
    (p) => !blacklist.has(normalize(p.id)) && !blacklist.has(normalize(p.title))
  );

  // Also include any working project explicitly marked "published"
  const working = getWorkingProjects();
  const publishedFromWorking: ProjectItem[] = working
    .filter(
      (w) =>
        w.status === "published" &&
        !blacklist.has(normalize(w.id)) &&
        !blacklist.has(normalize(w.title))
    )
    .map((w) => ({
      id: w.id,
      title: w.title,
      alt: w.alt || w.title,
      category: w.category,
      tag: w.tag || w.category.toUpperCase(),
      image: w.image || "/images/project6.jpeg",
      gallery: w.gallery,
      featured: w.featured ?? true,
      location: w.location || "Maharashtra, India",
      scale: w.scale || w.areaSqFt || "Architectural Spec",
      scope: w.scope || "Complete Architectural Design & Turnkey Planning",
      status: "published",
      progress: 100,
      publishedAt: w.publishedAt || "Recently Published",
      client: w.client,
    }));

  const combined = [...publishedFromWorking, ...initialPublished];
  // Deduplicate by ID and Title
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const finalResult: ProjectItem[] = [];

  for (const item of combined) {
    const idKey = normalize(item.id);
    const titleKey = normalize(item.title);
    if (!seenIds.has(idKey) && !seenTitles.has(titleKey)) {
      seenIds.add(idKey);
      seenTitles.add(titleKey);
      finalResult.push(item);
    }
  }

  savePublishedProjects(finalResult);
  return finalResult;
};

// Update an existing working project
export const updateWorkingProject = (updated: WorkingProject): boolean => {
  const list = getWorkingProjects();
  const index = list.findIndex(
    (p) => p.id === updated.id || normalize(p.title) === normalize(updated.title)
  );

  if (index !== -1) {
    list[index] = updated;
  } else {
    list.unshift(updated);
  }
  saveWorkingProjects(list);

  // Sync details to published projects list
  const published = getPublishedProjects();
  const pubIndex = published.findIndex(
    (p) => p.id === updated.id || normalize(p.title) === normalize(updated.title)
  );

  if (pubIndex !== -1) {
    if (updated.status === "published") {
      published[pubIndex] = {
        ...published[pubIndex],
        id: updated.id,
        title: updated.title,
        alt: updated.alt || updated.title,
        category: updated.category,
        tag: updated.tag || updated.category.toUpperCase(),
        scale: updated.scale || updated.areaSqFt || "Architectural Spec",
        location: updated.location || "Maharashtra, India",
        scope: updated.scope || "Complete Architectural Design & Turnkey Planning",
        image: updated.image,
        gallery: updated.gallery || [],
        featured: updated.featured ?? true,
        client: updated.client,
      };
    } else {
      // If status changed to non-published, remove from published list
      published.splice(pubIndex, 1);
    }
    savePublishedProjects(published);
  } else if (updated.status === "published") {
    // If marked published and not in published list, add to top
    published.unshift({
      id: updated.id,
      title: updated.title,
      alt: updated.alt || updated.title,
      category: updated.category,
      tag: updated.tag || updated.category.toUpperCase(),
      scale: updated.scale || updated.areaSqFt || "Architectural Spec",
      location: updated.location || "Maharashtra, India",
      scope: updated.scope || "Complete Architectural Design & Turnkey Planning",
      image: updated.image,
      gallery: updated.gallery || [],
      featured: updated.featured ?? true,
      client: updated.client,
    });
    savePublishedProjects(published);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mohalkar:projects-updated"));
  }

  return true;
};

// Delete a project from working pipeline (and permanently remove from live site)
export const deleteWorkingProject = (projectId: string): boolean => {
  const list = getWorkingProjects();
  const target = list.find((p) => p.id === projectId);
  const targetTitle = target?.title;

  const filtered = list.filter((p) => p.id !== projectId);
  saveWorkingProjects(filtered);

  // Add to unpublished blacklist so it never resurfaces
  addUnpublishedId(projectId, targetTitle);

  // Also remove from published projects
  const published = getPublishedProjects();
  const filteredPub = published.filter(
    (p) => p.id !== projectId && (!targetTitle || normalize(p.title) !== normalize(targetTitle))
  );
  savePublishedProjects(filteredPub);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mohalkar:projects-updated"));
  }

  return true;
};

// Publish a working project directly to the live website!
export const publishProjectToLiveSite = (workingId: string): {
  success: boolean;
  publishedProject?: ProjectItem;
} => {
  const workingList = getWorkingProjects();
  const targetIndex = workingList.findIndex((p) => p.id === workingId);

  if (targetIndex === -1) {
    return { success: false };
  }

  const projectToPublish = workingList[targetIndex];

  // Update working project status
  projectToPublish.status = "published";
  projectToPublish.stage = "Published";
  projectToPublish.progress = 100;
  projectToPublish.publishedAt = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  workingList[targetIndex] = projectToPublish;
  saveWorkingProjects(workingList);

  // Remove from unpublished blacklist if it was there previously
  removeUnpublishedId(workingId, projectToPublish.title);

  // Convert to public ProjectItem preserving the EXACT SAME ID
  const newPublicProject: ProjectItem = {
    id: projectToPublish.id,
    title: projectToPublish.title,
    alt: projectToPublish.alt || projectToPublish.title,
    category: projectToPublish.category,
    tag: projectToPublish.tag || projectToPublish.category.toUpperCase(),
    image: projectToPublish.image || "/images/project6.jpeg",
    gallery: projectToPublish.gallery,
    featured: projectToPublish.featured ?? true,
    location: projectToPublish.location || "Maharashtra, India",
    scale: projectToPublish.scale || projectToPublish.areaSqFt || "Architectural Spec",
    scope: projectToPublish.scope || "Complete Architectural Design & Turnkey Planning",
    status: "published",
    progress: 100,
    publishedAt: projectToPublish.publishedAt,
    client: projectToPublish.client,
  };

  const currentPublished = getPublishedProjects();
  // Filter out any older entry by matching ID or matching Title
  const cleanList = currentPublished.filter(
    (p) => p.id !== newPublicProject.id && normalize(p.title) !== normalize(newPublicProject.title)
  );
  // Prepend to show prominently at the top of the gallery!
  const updatedPublished = [newPublicProject, ...cleanList];
  savePublishedProjects(updatedPublished);

  // Dispatch custom event for real-time reactivity across components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mohalkar:projects-updated"));
  }

  return { success: true, publishedProject: newPublicProject };
};

// Unpublish a project (removes completely from live site and returns to working completed drafts)
export const unpublishProjectFromLiveSite = (projectId: string, projectTitle?: string): boolean => {
  const workingList = getWorkingProjects();
  const targetWorking = workingList.find(
    (p) => p.id === projectId || (projectTitle && normalize(p.title) === normalize(projectTitle))
  );

  const titleToUnpublish = projectTitle || targetWorking?.title;

  // 1. Add ID and title to unpublished blacklist so it can never be pulled from static base
  addUnpublishedId(projectId, titleToUnpublish);

  // 2. Remove from published projects in localStorage
  const currentPublished = getPublishedProjects();
  const updatedPublished = currentPublished.filter((p) => {
    if (p.id === projectId) return false;
    if (titleToUnpublish && normalize(p.title) === normalize(titleToUnpublish)) return false;
    // Also remove any legacy autogenerated IDs for this project
    if (p.id.startsWith("proj-pub-") && titleToUnpublish && normalize(p.title) === normalize(titleToUnpublish)) return false;
    return true;
  });
  savePublishedProjects(updatedPublished);

  // 3. Update the working project status back to "completed" (ready to re-publish later)
  if (targetWorking) {
    targetWorking.status = "completed";
    targetWorking.stage = "Completed";
    saveWorkingProjects(workingList);
  }

  // 4. Dispatch custom event for real-time reactivity across components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mohalkar:projects-updated"));
  }

  return true;
};

// Get Client Enquiries
export const getClientEnquiries = (): ClientEnquiry[] => {
  try {
    const stored = safeGetItem(STORAGE_ENQUIRIES_KEY);
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Error reading enquiries from storage:", e);
  }
  return INITIAL_CLIENT_ENQUIRIES;
};

// Save Client Enquiries
export const saveClientEnquiries = (enquiries: ClientEnquiry[]): void => {
  try {
    safeSetItem(STORAGE_ENQUIRIES_KEY, JSON.stringify(enquiries));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mohalkar:enquiries-updated"));
    }
  } catch (e) {
    console.error("Error saving enquiries:", e);
  }
};

// Delete a single client enquiry by ID
export const deleteClientEnquiry = (id: string): boolean => {
  const current = getClientEnquiries();
  const updated = current.filter((e) => e.id !== id);
  saveClientEnquiries(updated);
  return true;
};

// Clear all demo enquiries (leave empty pipeline)
export const clearAllEnquiries = (): boolean => {
  saveClientEnquiries([]);
  return true;
};

// Restore demo enquiries (for testing)
export const restoreDemoEnquiries = (): boolean => {
  saveClientEnquiries(INITIAL_CLIENT_ENQUIRIES);
  return true;
};

// Record a new real client enquiry from the website form
export const recordNewClientEnquiry = (enquiry: {
  name: string;
  phone: string;
  email: string;
  location?: string;
  projectType: string;
  budget?: string;
  message: string;
}): void => {
  const current = getClientEnquiries();
  const now = new Date();
  const dateStr = `Today, ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  const newLead: ClientEnquiry = {
    id: `lead-${Date.now()}`,
    date: dateStr,
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email,
    location: enquiry.location || "Maharashtra",
    projectType: enquiry.projectType,
    budget: enquiry.budget || "Discuss upon consultation",
    message: enquiry.message,
    status: "new",
  };
  saveClientEnquiries([newLead, ...current]);
};

// ==========================================
// ANALYTICS & TELEMETRY PERSISTENCE & ENGINE
// ==========================================

export const getStudioAnalytics = (): ViewerInsight => {
  try {
    const stored = safeGetItem(STORAGE_ANALYTICS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Error reading analytics from storage:", e);
  }
  return MOCK_VIEWER_INSIGHTS;
};

export const saveStudioAnalytics = (analytics: ViewerInsight): void => {
  try {
    safeSetItem(STORAGE_ANALYTICS_KEY, JSON.stringify(analytics));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mohalkar:analytics-updated"));
    }
  } catch (e) {
    console.error("Error saving analytics:", e);
  }
};

// Record real page visit telemetry
export const recordPageView = (): void => {
  try {
    const current = getStudioAnalytics();
    current.totalPageViews += 1;
    // Update daily traffic for today
    if (current.dailyTraffic.length > 0) {
      current.dailyTraffic[current.dailyTraffic.length - 1].views += 1;
    }
    saveStudioAnalytics(current);
  } catch (e) {
    // silent fallback
  }
};

// Record real blueprint inspection click
export const recordBlueprintInspection = (projectId?: string): void => {
  try {
    const current = getStudioAnalytics();
    current.blueprintInspections += 1;
    if (projectId) {
      const target = current.topViewedProjects.find((p) => p.id === projectId);
      if (target) {
        target.views += 1;
      }
    }
    saveStudioAnalytics(current);
  } catch (e) {
    // silent fallback
  }
};

// ==========================================
// RECENT ACTIVITY FEED & SITE MANAGEMENT AUDIT
// ==========================================

export const getAdminActivities = (): AdminActivity[] => {
  try {
    const stored = safeGetItem(STORAGE_ACTIVITIES_KEY);
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Error reading activities from storage:", e);
  }
  return INITIAL_ADMIN_ACTIVITIES;
};

export const saveAdminActivities = (activities: AdminActivity[]): void => {
  try {
    safeSetItem(STORAGE_ACTIVITIES_KEY, JSON.stringify(activities.slice(0, 50)));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mohalkar:activities-updated"));
    }
  } catch (e) {
    console.error("Error saving activities:", e);
  }
};

export const logAdminActivity = (
  entry: Omit<AdminActivity, "id" | "timestamp"> & { timestamp?: number }
): AdminActivity => {
  const current = getAdminActivities();
  const newActivity: AdminActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: entry.timestamp || Date.now(),
    type: entry.type,
    title: entry.title,
    description: entry.description,
    targetName: entry.targetName,
    targetCategory: entry.targetCategory,
    actor: entry.actor || "Principal Architect",
  };

  const updated = [newActivity, ...current].slice(0, 100);
  saveAdminActivities(updated);
  return newActivity;
};

export const clearAdminActivities = (): boolean => {
  saveAdminActivities([]);
  return true;
};

export const restoreDefaultActivities = (): boolean => {
  saveAdminActivities(INITIAL_ADMIN_ACTIVITIES);
  return true;
};

// ==========================================
// ADMIN SECURITY & PASSCODE MANAGEMENT
// ==========================================
const STORAGE_ADMIN_PASSWORD_KEY = "mohalkar_admin_passcode_v2";
const DEFAULT_INITIAL_PASSCODE = "mohalkar2026";

export const getAdminPassword = (): string => {
  try {
    const stored = safeGetItem(STORAGE_ADMIN_PASSWORD_KEY);
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }
  } catch (e) {
    console.warn("Error reading admin password:", e);
  }
  return DEFAULT_INITIAL_PASSCODE;
};

export const verifyAdminPassword = (input: string): boolean => {
  const current = getAdminPassword();
  const trimmed = (input || "").trim();
  return trimmed === current;
};

export const saveAdminPassword = (newPassword: string): boolean => {
  try {
    if (!newPassword || newPassword.trim().length < 4) {
      return false;
    }
    safeSetItem(STORAGE_ADMIN_PASSWORD_KEY, newPassword.trim());
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mohalkar:password-updated"));
    }
    return true;
  } catch (e) {
    console.error("Error saving admin password:", e);
    return false;
  }
};
