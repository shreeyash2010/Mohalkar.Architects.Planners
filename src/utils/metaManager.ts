import { ProjectItem } from "../data/projectsData";
import { LeadershipProfile, SITE_INFO } from "../data/siteData";

export interface TabMetaData {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonicalPath: string;
  pageType?: string;
}

export const BASE_STUDIO_NAME = "Mohalkar Architects & Planners";

export const TAB_META_CONFIGS: Record<string, TabMetaData> = {
  home: {
    title: "Mohalkar Architects & Planners | Luxury Architecture & Urban Planning",
    description:
      "Premier architectural studio and urban planning consultancy in Pune & Maharashtra specializing in bespoke residential, commercial, interior, and landscape design.",
    keywords:
      "Mohalkar Architects, architecture firm Pune, luxury villa architects, urban planners Maharashtra, architectural consultancy India",
    canonicalPath: "/#home",
    ogImage: "/images/hero1.jpg",
    pageType: "website",
  },
  projects: {
    title: "Projects | Mohalkar Architects & Planners",
    description:
      "Explore our portfolio of completed and ongoing architectural projects, luxury bungalows, commercial complexes, and urban landscapes across India.",
    keywords:
      "architecture projects, luxury villa designs, Pune architects portfolio, commercial architecture, architectural drawings, landscape design portfolio",
    canonicalPath: "/#projects",
    ogImage: "/images/project1.png",
    pageType: "collection",
  },
  about: {
    title: "About Us | Mohalkar Architects & Planners",
    description:
      "Learn about Mohalkar Architects & Planners, our design philosophy, Council of Architecture credentials, and leadership under Founder Abhishek Mohalkar.",
    keywords:
      "About Mohalkar Architects, Abhishek Mohalkar architect, Council of Architecture India, architectural ethos, sustainable architecture Pune",
    canonicalPath: "/#about",
    ogImage: "/images/ceo.png",
    pageType: "about",
  },
  expertise: {
    title: "Expertise & Typologies | Mohalkar Architects & Planners",
    description:
      "Discover our core architectural typologies: luxury residential villas, commercial plazas, master landscape planning, interior design, and municipal sanctions.",
    keywords:
      "architectural typologies, residential bungalow design, commercial planning, landscape master plan, architectural sanctioned drawings",
    canonicalPath: "/#expertise",
    ogImage: "/images/services.jpg",
    pageType: "article",
  },
  services: {
    title: "Services | Mohalkar Architects & Planners",
    description:
      "End-to-end architectural solutions: concept master plans, high-precision working blueprints, 3D visualization, site supervision, and turnkey execution.",
    keywords:
      "architectural services Pune, 3D architectural rendering, working drawings, municipal sanction approvals, turnkey construction architecture",
    canonicalPath: "/#services",
    ogImage: "/images/architecture.jpg",
    pageType: "service",
  },
  enquiry: {
    title: "Contact & Consultation | Mohalkar Architects & Planners",
    description:
      "Connect with Mohalkar Architects & Planners. Schedule a private architectural consultation or request a custom project cost estimate in Pune and Dharashiv.",
    keywords:
      "hire architect Pune, architectural consultation, architecture cost estimate, Mohalkar office contact, architect Dharashiv Bhoom",
    canonicalPath: "/#enquiry",
    ogImage: "/images/logo2.png",
    pageType: "contact",
  },
  contact: {
    title: "Contact & Consultation | Mohalkar Architects & Planners",
    description:
      "Connect with Mohalkar Architects & Planners. Schedule a private architectural consultation or request a custom project cost estimate in Pune and Dharashiv.",
    keywords:
      "hire architect Pune, architectural consultation, architecture cost estimate, Mohalkar office contact, architect Dharashiv Bhoom",
    canonicalPath: "/#contact",
    ogImage: "/images/logo2.png",
    pageType: "contact",
  },
  admin: {
    title: "Studio Admin Portal | Mohalkar Architects & Planners",
    description:
      "Secure executive management console for Mohalkar Architects & Planners: portfolio pipeline, client CRM leads, telemetry analytics, and site health.",
    keywords: "Mohalkar studio admin, executive architecture console, project management",
    canonicalPath: "/#admin",
    ogImage: "/images/logo2.png",
    pageType: "admin",
  },
};

export const ADMIN_SUBTAB_TITLES: Record<string, string> = {
  projects: "Project Pipeline & Publishing | Studio Admin | Mohalkar Architects & Planners",
  insights: "Studio Telemetry & Performance | Studio Admin | Mohalkar Architects & Planners",
  enquiries: "Client CRM & Leads | Studio Admin | Mohalkar Architects & Planners",
  activity: "Recent Activity Log & Audit Trail | Studio Admin | Mohalkar Architects & Planners",
  properties: "Website Properties & System Health | Studio Admin | Mohalkar Architects & Planners",
};

export interface ActiveMetaContext {
  activeTab: string;
  selectedProject?: ProjectItem | null;
  selectedLeader?: LeadershipProfile | null;
  adminSubTab?: string;
}

/**
 * Computes active page metadata depending on the active tab or modal context
 */
export function getActiveMeta(context: ActiveMetaContext): TabMetaData & { canonicalUrl: string } {
  const { activeTab, selectedProject, selectedLeader, adminSubTab } = context;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://mohalkararchitects.in";

  // Case 1: Specific Project Modal lightbox is active
  if (selectedProject) {
    const cleanLocation = selectedProject.location ? ` in ${selectedProject.location}` : "";
    const cleanScale = selectedProject.scale ? ` (${selectedProject.scale})` : "";
    const desc =
      selectedProject.scope ||
      selectedProject.alt ||
      `Luxury ${selectedProject.category} architectural project${cleanLocation}${cleanScale} designed by Mohalkar Architects & Planners.`;

    const trimmedDesc = desc.length > 158 ? desc.slice(0, 155) + "..." : desc;

    return {
      title: `${selectedProject.title} | Mohalkar Architects & Planners`,
      description: trimmedDesc,
      keywords: `${selectedProject.title}, ${selectedProject.category} architecture, ${selectedProject.location || "Pune"}, Mohalkar projects`,
      canonicalPath: `/#projects?id=${encodeURIComponent(selectedProject.id)}`,
      canonicalUrl: `${baseUrl}/#projects?id=${encodeURIComponent(selectedProject.id)}`,
      ogImage: selectedProject.image || "/images/project1.png",
      pageType: "article",
    };
  }

  // Case 2: Leadership profile modal is active
  if (selectedLeader) {
    const desc = `${selectedLeader.name}, ${selectedLeader.role} at Mohalkar Architects & Planners. ${selectedLeader.bio}`;
    const trimmedDesc = desc.length > 158 ? desc.slice(0, 155) + "..." : desc;

    return {
      title: `${selectedLeader.name} — Leadership | Mohalkar Architects & Planners`,
      description: trimmedDesc,
      keywords: `${selectedLeader.name}, architect leadership, Mohalkar Architects, ${selectedLeader.role}`,
      canonicalPath: `/#about?leader=${encodeURIComponent(selectedLeader.id)}`,
      canonicalUrl: `${baseUrl}/#about?leader=${encodeURIComponent(selectedLeader.id)}`,
      ogImage: selectedLeader.photo || "/images/ceo.png",
      pageType: "profile",
    };
  }

  // Case 3: Admin Console with specific sub-tabs
  if (activeTab === "admin" && adminSubTab && ADMIN_SUBTAB_TITLES[adminSubTab]) {
    return {
      title: ADMIN_SUBTAB_TITLES[adminSubTab],
      description:
        "Executive studio console for Mohalkar Architects & Planners: portfolio pipeline, client CRM leads, telemetry analytics, and audit logs.",
      keywords: "Mohalkar admin, studio operations, project management",
      canonicalPath: `/#admin?tab=${adminSubTab}`,
      canonicalUrl: `${baseUrl}/#admin?tab=${adminSubTab}`,
      ogImage: "/images/logo2.png",
      pageType: "admin",
    };
  }

  // Case 4: Standard Tab navigation
  const config = TAB_META_CONFIGS[activeTab] || TAB_META_CONFIGS.home;
  return {
    ...config,
    canonicalUrl: `${baseUrl}${config.canonicalPath}`,
  };
}

/**
 * Creates or updates a `<meta>` tag in the `<head>`
 */
function setMetaTag(selector: string, attributeName: "name" | "property", attributeValue: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/**
 * Creates or updates the `<link rel="canonical">` element
 */
function setCanonicalLink(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/**
 * Injects or updates Schema.org JSON-LD structured data for enhanced rich snippets
 */
function updateJsonLdSchema(meta: TabMetaData & { canonicalUrl: string }, context: ActiveMetaContext) {
  const schemaId = "mohalkar-seo-schema";
  let scriptElement = document.getElementById(schemaId) as HTMLScriptElement | null;

  if (!scriptElement) {
    scriptElement = document.createElement("script");
    scriptElement.id = schemaId;
    scriptElement.type = "application/ld+json";
    document.head.appendChild(scriptElement);
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://mohalkararchitects.in";

  const firmSchema = {
    "@type": "ArchitecturalFirm",
    "@id": `${baseUrl}/#firm`,
    name: "Mohalkar Architects & Planners",
    alternateName: "Mohalkar Studio",
    url: baseUrl,
    logo: `${baseUrl}/images/logo2.png`,
    image: `${baseUrl}/images/hero1.jpg`,
    description: SITE_INFO.overview,
    telephone: SITE_INFO.contacts.phonePrimary,
    email: SITE_INFO.contacts.emailPrimary,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "18.5204",
      longitude: "73.8567",
    },
    founder: {
      "@type": "Person",
      name: "Abhishek Mohalkar",
      jobTitle: "Founder & Principal Architect",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "19:30",
      },
    ],
    sameAs: [
      SITE_INFO.contacts.instagram,
      SITE_INFO.contacts.whatsappUrl,
    ],
    priceRange: "₹₹₹₹",
  };

  const webPageSchema: Record<string, any> = {
    "@type": "WebPage",
    "@id": `${meta.canonicalUrl}#webpage`,
    url: meta.canonicalUrl,
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": `${baseUrl}/#firm` },
    inLanguage: "en",
  };

  if (context.selectedProject) {
    webPageSchema.mainEntity = {
      "@type": "CreativeWork",
      name: context.selectedProject.title,
      headline: context.selectedProject.title,
      description: context.selectedProject.scope || context.selectedProject.alt || context.selectedProject.title,
      image: context.selectedProject.image ? `${baseUrl}${context.selectedProject.image}` : undefined,
      creator: { "@id": `${baseUrl}/#firm` },
    };
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [firmSchema, webPageSchema],
  };

  scriptElement.text = JSON.stringify(structuredData, null, 2);
}

/**
 * Dynamically updates document title and all SEO / OpenGraph / Twitter meta tags
 */
export function applyMetaTags(context: ActiveMetaContext): TabMetaData & { canonicalUrl: string } {
  if (typeof document === "undefined") {
    return getActiveMeta(context);
  }

  const meta = getActiveMeta(context);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://mohalkararchitects.in";
  const absoluteImage = meta.ogImage?.startsWith("http")
    ? meta.ogImage
    : `${baseUrl}${meta.ogImage || "/images/hero1.jpg"}`;

  // 1. Primary Document Title (Search Result Headline)
  document.title = meta.title;

  // 2. Primary Meta Description
  setMetaTag('meta[name="description"]', "name", "description", meta.description);

  // 3. Keywords
  setMetaTag('meta[name="keywords"]', "name", "keywords", meta.keywords);

  // 4. OpenGraph Tags (Facebook, LinkedIn, Slack, WhatsApp)
  setMetaTag('meta[property="og:title"]', "property", "og:title", meta.title);
  setMetaTag('meta[property="og:description"]', "property", "og:description", meta.description);
  setMetaTag('meta[property="og:url"]', "property", "og:url", meta.canonicalUrl);
  setMetaTag('meta[property="og:type"]', "property", "og:type", meta.pageType || "website");
  setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", BASE_STUDIO_NAME);
  setMetaTag('meta[property="og:image"]', "property", "og:image", absoluteImage);

  // 5. Twitter / X Cards
  setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
  setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", meta.description);
  setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", absoluteImage);

  // 6. Canonical URL
  setCanonicalLink(meta.canonicalUrl);

  // 7. Schema.org JSON-LD Structured Data
  updateJsonLdSchema(meta, context);

  // 8. Dispatch custom event so the UI/Admin dashboard can display real-time SEO health
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("mohalkar:meta-updated", {
        detail: {
          ...meta,
          activeTab: context.activeTab,
          selectedProjectTitle: context.selectedProject?.title,
          updatedAt: new Date().toISOString(),
        },
      })
    );
  }

  return meta;
}
