import { useEffect } from "react";
import { applyMetaTags, ActiveMetaContext } from "../utils/metaManager";
import { ProjectItem } from "../data/projectsData";
import { LeadershipProfile } from "../data/siteData";

interface MetaTagManagerProps {
  activeTab: string;
  selectedProject?: ProjectItem | null;
  selectedLeader?: LeadershipProfile | null;
  adminSubTab?: string;
}

/**
 * Headless Meta Tag Manager component
 * Dynamically updates document.title, meta descriptions, OpenGraph tags,
 * Twitter cards, canonical links, and Schema.org JSON-LD whenever activeTab
 * or modal context transitions.
 */
export function MetaTagManager({
  activeTab,
  selectedProject,
  selectedLeader,
  adminSubTab,
}: MetaTagManagerProps) {
  useEffect(() => {
    applyMetaTags({
      activeTab,
      selectedProject,
      selectedLeader,
      adminSubTab,
    });
  }, [activeTab, selectedProject, selectedLeader, adminSubTab]);

  return null;
}

/**
 * Custom React hook for dynamic meta management
 */
export function useMetaManager(context: ActiveMetaContext) {
  useEffect(() => {
    applyMetaTags(context);
  }, [context.activeTab, context.selectedProject, context.selectedLeader, context.adminSubTab]);
}
