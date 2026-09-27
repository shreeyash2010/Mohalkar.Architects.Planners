import { ProjectItem } from "./projectsData";

export interface WorkingProject extends ProjectItem {
  status: "working" | "completed" | "published";
  progress: number;
  stage: "Concept" | "Working Drawings" | "Sanction Approval" | "Under Construction" | "Completed" | "Published";
  client?: string;
  startDate?: string;
  targetCompletion?: string;
  notes?: string;
  areaSqFt?: string;
  estimatedBudget?: string;
}

export interface ViewerInsight {
  totalPageViews: number;
  uniqueVisitors: number;
  activeNow: number;
  avgDurationMinutes: number;
  bounceRatePercent: number;
  blueprintInspections: number;
  topCities: { city: string; count: number; percent: number }[];
  categoryInterest: { category: string; count: number; percent: number }[];
  deviceBreakdown: { device: string; percent: number }[];
  dailyTraffic: { date: string; views: number; visitors: number }[];
  topViewedProjects: { id: string; title: string; views: number; category: string }[];
}

export interface ClientEnquiry {
  id: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  projectType: string;
  budget: string;
  message: string;
  status: "new" | "in_review" | "quoted" | "closed";
}

// Initial working projects pipeline for Mohalkar Architects
export const INITIAL_WORKING_PROJECTS: WorkingProject[] = [
  {
    id: "work-1",
    title: "Dharashiv Agro-Tourism & Landscape Master Plan",
    alt: "Agro Tourism Landscape",
    category: "landscape",
    tag: "Landscape",
    image: "/images/landscape9.jpg",
    featured: true,
    location: "Dharashiv Region, Maharashtra",
    scale: "14.5 Acres",
    scope: "Master Site Subdivision, Eco-Cottages & Botanical Trail",
    status: "completed",
    progress: 100,
    stage: "Completed",
    client: "Shri Deshmukh Farms",
    startDate: "Nov 2025",
    targetCompletion: "Mar 2026",
    notes: "Site grading and architectural working drawings fully finished. Ready for live portfolio publication.",
    areaSqFt: "14.5 Acres",
    estimatedBudget: "₹1.2 Cr",
  },
  {
    id: "work-2",
    title: "The Glasshouse Residence & Terrace Garden",
    alt: "Glasshouse Villa",
    category: "residential",
    tag: "Residential",
    image: "/images/project2.jpeg",
    featured: true,
    location: "Bhoom, Maharashtra",
    scale: "6,200 sq.ft",
    scope: "Contemporary 4BHK Villa with Vaastu & Central Courtyard",
    status: "completed",
    progress: 100,
    stage: "Completed",
    client: "Dr. Patil & Family",
    startDate: "Aug 2025",
    targetCompletion: "Feb 2026",
    notes: "Structural verification complete, 3D visualization rendered. Ready to publish.",
    areaSqFt: "6,200 sq.ft",
    estimatedBudget: "₹95 Lakhs",
  },
  {
    id: "work-3",
    title: "Solapur Highway Commercial Hub - Phase II",
    alt: "Commercial Complex Phase 2",
    category: "commercial",
    tag: "Commercial",
    image: "/images/project3.jpg",
    featured: false,
    location: "Solapur Highway, Maharashtra",
    scale: "45,000 sq.ft",
    scope: "Triple-Height Showroom, Anchor Retail & Basement Parking",
    status: "working",
    progress: 85,
    stage: "Under Construction",
    client: "Kalyan Infrastructure Group",
    startDate: "Sep 2025",
    targetCompletion: "May 2026",
    notes: "Basement slab casted, working on facade glass curtain wall details.",
    areaSqFt: "45,000 sq.ft",
    estimatedBudget: "₹3.8 Cr",
  },
  {
    id: "work-4",
    title: "Bhoom Central Boulevard Townhouse Complex",
    alt: "Townhouse Complex",
    category: "residential",
    tag: "Residential",
    image: "/images/resi2.png",
    featured: false,
    location: "Bhoom Nagar, Maharashtra",
    scale: "12,000 sq.ft",
    scope: "Row Houses Architecture, Internal Services & Road Network",
    status: "working",
    progress: 65,
    stage: "Working Drawings",
    client: "Mohalkar Associates & Land Owners",
    startDate: "Jan 2026",
    targetCompletion: "July 2026",
    notes: "Structural calculations in progress with Pune consulting team.",
    areaSqFt: "12,000 sq.ft",
    estimatedBudget: "₹1.6 Cr",
  },
  {
    id: "work-5",
    title: "Riverside Public Botanical Park & Lakefront",
    alt: "Riverside Botanical Park",
    category: "landscape",
    tag: "Landscape",
    image: "/images/landscape10.jpg",
    featured: false,
    location: "Pune District Outskirts",
    scale: "8.2 Acres",
    scope: "Contour Bunding, Native Tree Canopy & Water Promenade",
    status: "working",
    progress: 50,
    stage: "Sanction Approval",
    client: "Municipal Regional Planning Authority",
    startDate: "Dec 2025",
    targetCompletion: "Aug 2026",
    notes: "Environmental impact and municipal town planning clearance underway.",
    areaSqFt: "8.2 Acres",
    estimatedBudget: "₹80 Lakhs",
  },
];

// Realistic Studio Viewer Insights & Telemetry
export const MOCK_VIEWER_INSIGHTS: ViewerInsight = {
  totalPageViews: 24890,
  uniqueVisitors: 6420,
  activeNow: 7,
  avgDurationMinutes: 4.8,
  bounceRatePercent: 28.4,
  blueprintInspections: 1840,
  topCities: [
    { city: "Pune", count: 2824, percent: 44 },
    { city: "Bhoom & Dharashiv", count: 1669, percent: 26 },
    { city: "Mumbai", count: 1027, percent: 16 },
    { city: "Solapur", count: 513, percent: 8 },
    { city: "Bengaluru & Others", count: 387, percent: 6 },
  ],
  categoryInterest: [
    { category: "Residential (Villas & Bungalows)", count: 9956, percent: 40 },
    { category: "Commercial (Malls & Hubs)", count: 7467, percent: 30 },
    { category: "Landscape (Subdivisions & Parks)", count: 4978, percent: 20 },
    { category: "Working Drawings & Municipal Sheets", count: 2489, percent: 10 },
  ],
  deviceBreakdown: [
    { device: "Mobile (iOS & Android)", percent: 66 },
    { device: "Desktop / Workstation", percent: 30 },
    { device: "Tablet / iPad", percent: 4 },
  ],
  dailyTraffic: [
    { date: "Mon", views: 320, visitors: 94 },
    { date: "Tue", views: 410, visitors: 118 },
    { date: "Wed", views: 380, visitors: 106 },
    { date: "Thu", views: 490, visitors: 142 },
    { date: "Fri", views: 560, visitors: 165 },
    { date: "Sat", views: 680, visitors: 198 },
    { date: "Sun (Today)", views: 720, visitors: 215 },
  ],
  topViewedProjects: [
    { id: "proj-6", title: "5000 sq.ft Luxury Bungalow", views: 1420, category: "Residential" },
    { id: "proj-77", title: "Apex Commercial Plaza & Corporate Hub", views: 1180, category: "Commercial" },
    { id: "proj-13", title: "Land Subdivision Layout 1 (12 Acres)", views: 980, category: "Landscape" },
    { id: "proj-44", title: "Shopping Mall Literature Study & Plans", views: 840, category: "Commercial" },
    { id: "proj-76", title: "The Solarium Estate (5,400 sq.ft)", views: 760, category: "Residential" },
  ],
};

// Initial Enquiries for the admin lead pipeline
export const INITIAL_CLIENT_ENQUIRIES: ClientEnquiry[] = [
  {
    id: "enq-101",
    date: "Today, 10:45 AM",
    name: "Vikramaditya Shinde",
    phone: "+91 98224 81920",
    email: "vikram.shinde@infra.in",
    location: "Pune, Maharashtra",
    projectType: "Commercial Complex",
    budget: "₹2 Cr - ₹5 Cr",
    message: "Looking for complete architectural elevation and basement sanction plans for a 4-storey commercial plaza on Baner Road.",
    status: "new",
  },
  {
    id: "enq-102",
    date: "Yesterday",
    name: "Sunil K. Deshmukh",
    phone: "+91 94220 55112",
    email: "sunildeshmukh@gmail.com",
    location: "Bhoom, Maharashtra",
    projectType: "Residential Villa / Bungalow",
    budget: "₹75 Lakhs - ₹1.5 Cr",
    message: "Require 4BHK bungalow drawings with Vaastu compliance on 4,000 sq.ft plot near civil hospital.",
    status: "in_review",
  },
  {
    id: "enq-103",
    date: "2 days ago",
    name: "Anand R. Jadhav",
    phone: "+91 91452 77800",
    email: "anand.jadhav@agro.org",
    location: "Dharashiv Region",
    projectType: "Landscape & NA Plotting",
    budget: "₹50 Lakhs - ₹1 Cr",
    message: "Need 9-acre farmland subdivision layout into 32 residential plots with internal roads and clubhouse area.",
    status: "quoted",
  },
];

// Activity Feed Types & Initial Logs
export type ActivityActionType =
  | "create"
  | "delete"
  | "status_change"
  | "publish"
  | "unpublish"
  | "edit"
  | "enquiry"
  | "analytics";

export interface AdminActivity {
  id: string;
  timestamp: number;
  type: ActivityActionType;
  title: string;
  description: string;
  targetName?: string;
  targetCategory?: string;
  actor?: string;
}

// Initial recent activity feed events for site management audit
export const INITIAL_ADMIN_ACTIVITIES: AdminActivity[] = [
  {
    id: "act-1",
    timestamp: Date.now() - 1000 * 60 * 14, // 14 mins ago
    type: "status_change",
    title: "Status Toggled to Completed",
    description: "Marked 'Dharashiv Agro-Tourism & Landscape Master Plan' as Completed (Drawings verified, 100% progress).",
    targetName: "Dharashiv Agro-Tourism & Landscape Master Plan",
    targetCategory: "Landscape",
    actor: "Principal Architect",
  },
  {
    id: "act-2",
    timestamp: Date.now() - 1000 * 60 * 48, // 48 mins ago
    type: "publish",
    title: "Published to Live Portfolio",
    description: "Published 'The Glasshouse Residence & Terrace Garden' (6,200 sq.ft) to the public gallery.",
    targetName: "The Glasshouse Residence & Terrace Garden",
    targetCategory: "Residential",
    actor: "Principal Architect",
  },
  {
    id: "act-3",
    timestamp: Date.now() - 1000 * 60 * 130, // ~2 hours ago
    type: "create",
    title: "New Project Created",
    description: "Added 'Riverside Public Botanical Park & Lakefront' (8.2 Acres) to the studio pipeline.",
    targetName: "Riverside Public Botanical Park & Lakefront",
    targetCategory: "Landscape",
    actor: "Principal Architect",
  },
  {
    id: "act-4",
    timestamp: Date.now() - 1000 * 60 * 360, // 6 hours ago
    type: "status_change",
    title: "Status Toggled to Working",
    description: "Moved 'Solapur Highway Commercial Hub - Phase II' to Under Construction stage with 85% completion.",
    targetName: "Solapur Highway Commercial Hub - Phase II",
    targetCategory: "Commercial",
    actor: "Principal Architect",
  },
  {
    id: "act-5",
    timestamp: Date.now() - 1000 * 60 * 60 * 22, // 22 hours ago
    type: "edit",
    title: "Project Specifications Updated",
    description: "Updated scale, built-up space, and structural notes for 'Bhoom Central Boulevard Townhouse Complex'.",
    targetName: "Bhoom Central Boulevard Townhouse Complex",
    targetCategory: "Residential",
    actor: "Principal Architect",
  },
];
