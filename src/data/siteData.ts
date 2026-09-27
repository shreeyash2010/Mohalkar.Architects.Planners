export interface StudioMetric {
  value: string;
  label: string;
  sublabel: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  image: string;
  specialization: string;
}

export const studioMetrics: StudioMetric[] = [
  { value: '18+', label: 'Years of Practice', sublabel: 'Legacy of Architectural Excellence' },
  { value: '250+', label: 'Delivered Projects', sublabel: 'Across Maharashtra & Pan-India' },
  { value: '3.8M', label: 'Sq.Ft Designed', sublabel: 'Residential, Commercial & Industrial' },
  { value: '100%', label: 'Sanction Clearance', sublabel: 'PMC, PCMC, PMRDA & UDCPR 2020' }
];

export const studioServices: ServiceItem[] = [
  {
    id: 'architectural-design',
    title: 'Architectural Design & Space Planning',
    tagline: 'Contextual, Monolithic & Functional Structures',
    description: 'Comprehensive architectural concepts, conceptual massing, climatic daylighting analysis, structural coordination, and working drawing sets.',
    deliverables: ['Concept Schematics', 'BIM 3D Architectural Models', 'Detailed Working Drawings (GFC)', 'Structural & MEP Coordination'],
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'urban-planning',
    title: 'Urban Planning & Township Masterplans',
    tagline: 'Large-scale Contoured Masterplanning & Zoning',
    description: 'Regional land-use planning, plotted layout schemes, eco-tourism resorts, civic infrastructure integration, and contour-driven road network engineering.',
    deliverables: ['Regional Land-use Maps', 'Contour & Hydrology Analysis', 'Plotted Layout Subdivisions', 'Infrastructure Network Plans'],
    icon: 'Compass',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'interior-architecture',
    title: 'Bespoke Interior Architecture',
    tagline: 'Refined Materiality, Tactile Textures & Warm Light',
    description: 'Ultra-luxury residential and executive commercial interiors. Bespoke millwork, lighting design, acoustic treatment, and material sourcing.',
    deliverables: ['Reflected Ceiling Plans (RCP)', 'Joinery & Custom Furniture Details', 'Material Mood Boards & Sourcing', 'Lighting & Automation Specs'],
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'landscape-architecture',
    title: 'Landscape & Ecological Design',
    tagline: 'Biophilic Integration & Sustainable Microclimates',
    description: 'Regenerative site planning, native xeriscaping, hardscape water features, civic plazas, and private estate outdoor living pavilions.',
    deliverables: ['Planting Palettes & Flora Schedules', 'Hardscape Grading & Paving Details', 'Irrigation & Drainage Schemes', 'Landscape Lighting Plans'],
    icon: 'Trees',
    image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'statutory-sanctions',
    title: 'Municipal Approvals & UDCPR Sanctions',
    tagline: 'Seamless Liaisoning & Regulatory Mastery',
    description: 'Expert statutory approval consultancy across PMC, PCMC, PMRDA, MIDC, and CIDCO under Unified Development Control and Promotion Regulations (UDCPR 2020).',
    deliverables: ['AutoDCR Scrutiny Drawings', 'FSI / TDR & Premium Calculations', 'Environmental & Fire NOC Dossiers', 'Occupancy Certificate (OC) Filing'],
    icon: 'FileCheck2',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'project-management',
    title: 'Site Execution & Quality Supervision',
    tagline: 'Rigorous On-Site Quality Assurance',
    description: 'Periodic site inspection, contractor bill verification, material sampling tests, structural compliance auditing, and milestone delivery monitoring.',
    deliverables: ['Site Progress Audit Reports', 'Snagging Lists & Rectification Logs', 'Vendor Quality Checklists', 'Milestone Certificate Verification'],
    icon: 'CheckCircle2',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
  }
];

export const studioLeadership: TeamMember[] = [
  {
    name: 'Ar. Abhishek Mohalkar',
    role: 'Principal Architect & Urban Planner',
    credentials: 'B.Arch, M.Plan (Urban Planning), COA Registered',
    bio: 'With over 18 years of pioneering architectural and urban planning practice, Ar. Abhishek Mohalkar spearheads the studio’s design philosophy, combining bold structural geometries with profound environmental sensitivity and flawless regulatory execution.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    specialization: 'Masterplanning, Monolithic Architecture & UDCPR 2020 Frameworks'
  },
  {
    name: 'Er. S. R. Mohalkar',
    role: 'Chief Structural Consultant & Technical Director',
    credentials: 'B.E. Civil, M.Tech (Structures), MIE, Chartered Engineer',
    bio: 'Leading structural engineering, seismic resilience, and pre-engineered industrial frameworks, ensuring architectural visions translate into enduring, cost-efficient, and structurally pristine reality.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    specialization: 'Long-span Cantilevers, Post-tensioned Slabs & Industrial Hubs'
  }
];

export const studioContact = {
  firmName: 'Mohalkar Architects & Planners',
  tagline: 'Architecture · Urban Planning · Interior Design · Sanctions',
  email: 'mohalkararchitectsandplanners@gmail.com',
  secondaryEmail: 'abhishekmohalkar0062@gmail.com',
  phone: '+91 98220 00000',
  whatsapp: '919822000000',
  address: 'Studio Suite 402, Signature One Hub, Baner - Balewadi High Street, Pune, Maharashtra 411045',
  hours: 'Mon - Sat: 09:30 AM - 07:30 PM (IST)',
  googleMapsUrl: 'https://maps.google.com/?q=Mohalkar+Architects+Pune'
};
