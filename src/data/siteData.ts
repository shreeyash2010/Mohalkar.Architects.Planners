export interface LeadershipProfile {
  id: string;
  name: string;
  role: string;
  designation: string;
  photo: string;
  bio: string;
  fullBio: string;
  credentials: string[];
  social: {
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  iconName: string;
  image?: string;
}

export interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  scopePoints: string[];
  image?: string;
}

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

export interface ValueItem {
  title: string;
  description: string;
  accent: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const SITE_INFO = {
  name: "MOHALKAR",
  tagline: "ARCHITECTS & PLANNERS",
  established: "Est. Excellence in Design",
  heroHeading: "Every Space Has a Story — We Design Yours",
  heroSub: "Modern Architecture · Interior Design · Urban Planning",
  overview:
    "Mohalkar Architects & Planners is a leading design consultancy specialising in residential, commercial, and urban planning. With a passion for purposeful beauty, we deliver innovative, sustainable, and tailored solutions to private clients, developers, and local bodies across India.",
  secondaryOverview:
    "From concept to completion, every project reflects our commitment to craftsmanship, context, and lasting value.",
  stats: [
    { value: "2+", label: "Years of Firm Excellence" },
    { value: "88+", label: "Architectural & Engineering Sets" },
    { value: "6+", label: "Design Disciplines" },
    { value: "100%", label: "Client Satisfaction" },
  ],
  contacts: {
    phonePrimary: "+91 9146079235",
    phoneSecondary: "+91 8698300048",
    emailPrimary: "mohalkararchitectsandplanners@gmail.com",
    emailDirect: "abhishekmohalkar0062@gmail.com",
    location: "Pune, Bhoom & Dharashiv, Maharashtra, India",
    workingHours: "Monday – Saturday: 9:30 AM – 7:30 PM (IST)",
    instagram: "https://www.instagram.com/abhi_mohalkar/",
    instagramHandle: "@abhi_mohalkar",
    linkedin: "https://linkedin.com/in/",
    whatsappUrl: "https://wa.me/919146079235?text=Hello%20Mohalkar%20Architects-Planners,%20I%20would%20like%20to%20discuss%20a%20project!",
  },
  partners: [
    { name: "Studio Partner 1", logo: "/images/associates1.png" },
    { name: "Studio Partner 2", logo: "/images/associates2.png" },
    { name: "Studio Partner 3", logo: "/images/associates3.jfif" },
    { name: "Studio Partner 4", logo: "/images/associates4.png" },
  ],
};

export const siteInfo = SITE_INFO;
export default SITE_INFO;

export const SITE_INFO = {
  name: "MOHALKAR",
  tagline: "ARCHITECTS & PLANNERS",
  established: "Est. Excellence in Design",
  heroHeading: "Every Space Has a Story — We Design Yours",
  heroSub: "Modern Architecture · Interior Design · Urban Planning",
  overview:
    "Mohalkar Architects & Planners is a leading design consultancy specialising in residential, commercial, and urban planning. With a passion for purposeful beauty, we deliver innovative, sustainable, and tailored solutions to private clients, developers, and local bodies across India.",
  secondaryOverview:
    "From concept to completion, every project reflects our commitment to craftsmanship, context, and lasting value.",
  stats: [
    { value: "2+", label: "Years of Firm Excellence" },
    { value: "88+", label: "Architectural & Engineering Sets" },
    { value: "6+", label: "Design Disciplines" },
    { value: "100%", label: "Client Satisfaction" },
  ],
  contacts: {
    phonePrimary: "+91 9146079235",
    phoneSecondary: "+91 8698300048",
    emailPrimary: "mohalkararchitectsandplanners@gmail.com",
    emailDirect: "abhishekmohalkar0062@gmail.com",
    location: "Pune, Bhoom & Dharashiv, Maharashtra, India",
    workingHours: "Monday – Saturday: 9:30 AM – 7:30 PM (IST)",
    instagram: "https://www.instagram.com/abhi_mohalkar/",
    instagramHandle: "@abhi_mohalkar",
    linkedin: "https://linkedin.com/in/",
    whatsappUrl: "https://wa.me/919146079235?text=Hello%20Mohalkar%20Architects-Planners,%20I%20would%20like%20to%20discuss%20a%20project!",
  },
  partners: [
    { name: "Studio Partner 1", logo: "/images/associates1.png" },
    { name: "Studio Partner 2", logo: "/images/associates2.png" },
    { name: "Studio Partner 3", logo: "/images/associates3.jfif" },
    { name: "Studio Partner 4", logo: "/images/associates4.png" },
  ],
};

export const LEADERSHIP_PROFILES: LeadershipProfile[] = [
  {
    id: "ceo",
    name: "Abhishek Mohalkar",
    role: "CEO · Founder & Principal Architect",
    designation: "CEO",
    photo: "/images/ceo.png",
    bio: "Leads design vision, client strategy, and end-to-end project delivery with a focus on timeless aesthetics and buildable detailing.",
    fullBio:
      "As CEO & Principal Architect, leads the overall vision of Mohalkar Architects & Planners—bringing together design, engineering, and client aspirations into clear, buildable solutions. Oversees concept design, key client interactions, and major project decisions across residential, commercial, and urban-scale work. With hands-on involvement from initial pencil sketches to site execution, Abhishek ensures architectural integrity and structural elegance throughout every phase.",
    credentials: [
      "B.Arch — Architectural Thesis & Studio Honors",
      "Principal Designer & Lead Urban Consultant",
      "Specialist in High-End Residential & Commercial Sanctions",
    ],
    social: {
      instagram: "https://www.instagram.com/abhi_mohalkar/",
      linkedin: "https://linkedin.com/in/",
      email: "mohalkararchitectsandplanners@gmail.com",
    },
  },
  {
    id: "cmd",
    name: "Sujit Mohalkar",
    role: "CMD · Brand & Growth Director",
    designation: "CMD",
    photo: "/images/cmo.png",
    bio: "Owns brand identity, partnerships, and client experience — ensuring our work reaches the right audiences with clarity and impact.",
    fullBio:
      "As CMD, leads brand strategy, communications, and growth initiatives for the studio—ensuring that every project, visual, and interaction reflects the firm’s design philosophy. Works on strategic partnerships, digital presence, institutional liaisoning, and elevated client experience, helping connect the right audiences with the studio's specialized services across India.",
    credentials: [
      "Head of Brand Strategy & Urban Development Outreach",
      "Client Engagement & Institutional Partnerships",
      "Operational Scaling & Digital Practice Expansion",
    ],
    social: {
      instagram: "https://www.instagram.com/abhi_mohalkar/",
      linkedin: "https://linkedin.com/in/",
      email: "mohalkararchitectsandplanners@gmail.com",
    },
  },
];

export const CORE_VALUES: ValueItem[] = [
  {
    title: "Vision",
    description:
      "We see beyond the brief. Every project is an opportunity to redefine how people experience their surroundings through intentional light, volume, and rhythm.",
    accent: "#c8a96e",
  },
  {
    title: "Craft",
    description:
      "Detail is not an afterthought — it is the essence. We obsess over proportions, materiality, joinery, and the absolute precision of every working line.",
    accent: "#dfc085",
  },
  {
    title: "Sustainability",
    description:
      "We design with longevity in mind — buildings that age gracefully, respect local climate, integrate passive cooling, and minimize ecological impact.",
    accent: "#a8843e",
  },
  {
    title: "People",
    description:
      "Architecture is fundamentally for human living. We listen deeply, collaborate transparently, and sculpt environments tailored to wellness, comfort, and purpose.",
    accent: "#e5c583",
  },
];

export const MILESTONES: MilestoneItem[] = [
  {
    year: "2019",
    title: "Architectural Vision Begins",
    description:
      "Defined a clear direction in architecture and started formal education, building a rigorous structural and design foundation.",
  },
  {
    year: "2020 – 2022",
    title: "Freelancing & Practical Learning",
    description:
      "Balanced academic research with independent freelance design commissions, gaining early practical site experience and direct client exposure.",
  },
  {
    year: "2023",
    title: "Internship & Site Coordination",
    description:
      "Completed intensive professional practice, mastering real-world construction detailing, site supervision, structural coordination, and sanction workflows.",
  },
  {
    year: "2024",
    title: "Graduation & Studio Foundation",
    description:
      "Graduated with thesis distinction, established Mohalkar Architects & Planners, and commenced professional practice across residential and urban sectors.",
  },
  {
    year: "2025 – 2026",
    title: "Growing Forward Across India",
    description:
      "Continuing to scale across Maharashtra and major Indian metros — delivering bespoke bungalows, urban infrastructure, commercial complexes, and municipal plans.",
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "concept-schematic",
    title: "Concept & Schematic Design",
    shortDesc:
      "The foundation of every great building is a clear concept. We translate your brief into spatial ideas that are inspiring and buildable.",
    fullDesc:
      "The foundation of every great building is a clear concept. We translate your brief — site parameters, sun orientation, budget, and lifestyle aspirations — into spatial ideas that are both inspiring and buildable. This phase establishes massing, spatial programming, and preliminary layouts.",
    deliverables: [
      "Topographical & Site Microclimate Analysis",
      "Space Programming & Functional Zoning",
      "Schematic Master Layout Plans",
      "Massing Studies & Volumetric Proportions",
    ],
    iconName: "Compass",
    image: "/images/arc2.jpg",
  },
  {
    id: "architectural-design",
    title: "Architectural Design",
    shortDesc:
      "Comprehensive architectural solutions for luxury bungalows, apartments, and commercial complexes calibrated for context.",
    fullDesc:
      "Full-scope architectural design services taking ideas from preliminary sketches to fully coordinated construction documentation. We merge functional efficiency, structural logic, and aesthetic distinction into timeless built environments.",
    deliverables: [
      "Comprehensive Architectural Floor Plans",
      "Elevations & Longitudinal Section Cuts",
      "Facade Detail & Material Specifications",
      "Statutory Sanction & Municipal Approval Sets",
    ],
    iconName: "Building2",
    image: "/images/project1.jpeg",
  },
  {
    id: "interior-design",
    title: "Interior Designing",
    shortDesc:
      "Curated interior architecture transforming spaces with bespoke joinery, refined lighting, and luxury material palettes.",
    fullDesc:
      "Curated interiors that transform empty shells into immersive living experiences. From bespoke living rooms and custom gourmet kitchens to luxury bedrooms and executive offices, every finish, fixture, and texture is selected with rigorous intent.",
    deliverables: [
      "Bespoke Furniture & Millwork Layouts",
      "Reflected Ceiling & Architectural Lighting Plans",
      "Material, Fabric & Texture Palette Schedules",
      "Custom Carpentry & Joinery Detailing",
    ],
    iconName: "Sofa",
    image: "/images/interior1.jpeg",
  },
  {
    id: "3d-visualization",
    title: "3D Visualization",
    shortDesc:
      "Photorealistic digital renders, natural light simulations, and walkthroughs that bring unbuilt dreams to life.",
    fullDesc:
      "High-end CGI visualization that allows you to walk through your future home or commercial development before ground is broken. We simulate realistic sunlight conditions, artificial illumination, and true-to-life materiality.",
    deliverables: [
      "Ultra-High-Resolution Exterior Renderings",
      "Atmospheric Interior CGI Perspectives",
      "Daylight & Night Lighting Simulative Studies",
      "Virtual Project Walkthroughs & Flyovers",
    ],
    iconName: "Eye",
    image: "/images/3d4.jpg",
  },
  {
    id: "liasoning-sanctioning",
    title: "Liasoning & Sanctioning",
    shortDesc:
      "Navigating municipal bylaws, town planning regulations, building permissions, and statutory approvals.",
    fullDesc:
      "Navigating the complexities of town planning authorities, municipal corporations, and regional development bodies across Maharashtra and pan-India. We ensure statutory compliance, maximizing legal FSI/FAR while preventing costly delays.",
    deliverables: [
      "Municipal Corporation Sanction Submissions",
      "Floor Space Index (FSI/FAR) Calculations",
      "Zoning & Fire/Safety Regulatory Approvals",
      "Site Demarcation & Legal Liaisoning Sets",
    ],
    iconName: "FileCheck2",
    image: "/images/working drawings/WD-IICompiledportfolio_page-0001.jpg",
  },
  {
    id: "landscape-design",
    title: "Landscape Design",
    shortDesc:
      "Urban parks, private gardens, and outdoor environments that bring nature, community, and architecture together.",
    fullDesc:
      "We believe the space between buildings is as vital as the buildings themselves. Our landscape architecture integrates native flora, stone hardscaping, water bodies, and ambient outdoor illumination into seamless extensions of living spaces.",
    deliverables: [
      "Landscape Master Plans & Site Grading",
      "Hardscape, Paving & Retaining Wall Details",
      "Native Flora, Tree & Plantation Schedules",
      "Outdoor Lighting & Irrigation Concept Schemes",
    ],
    iconName: "Trees",
    image: "/images/landscape1.jpg",
  },
  {
    id: "project-management",
    title: "Project Management",
    shortDesc:
      "Rigorous on-site quality control, contractor supervision, Bill of Quantities (BOQ), and timeline governance.",
    fullDesc:
      "Serving as the client's vigilant advocate on site. We coordinate between structural engineers, MEP consultants, and civil contractors to ensure that execution adheres 100% to design specifications, budget bounds, and construction schedules.",
    deliverables: [
      "Detailed Bill of Quantities (BOQ) & Cost Audits",
      "Milestone-Driven Construction Scheduling",
      "Periodic Site Inspection & Quality Control",
      "Contractor & Vendor Coordination Protocols",
    ],
    iconName: "ShieldCheck",
    image: "/images/infra1.jpg",
  },
];

export const EXPERTISE_DOMAINS: ExpertiseItem[] = [
  {
    id: "residential",
    title: "Residential Architecture",
    description:
      "End-to-end solutions for modern homes, luxury villas, and residential complexes — from concept to construction. We design homes that reflect the people who live in them.",
    iconName: "Home",
    image: "/images/project2.jpeg",
    scopePoints: [
      "Private Luxury Bungalows (1,750 – 5,000+ sq.ft)",
      "Multi-Unit Residential Developments",
      "Vastu-Compliant Spatial Planning",
      "Sustainable Climate-Responsive Design",
    ],
  },
  {
    id: "commercial",
    title: "Commercial Design",
    description:
      "Innovative office complexes, retail spaces, showrooms, and mixed-use developments that balance functional traffic flow with bold architectural identity.",
    iconName: "Briefcase",
    image: "/images/project3.jpg",
    scopePoints: [
      "Multi-Level Shopping Centers & Malls",
      "Corporate Head Offices & Co-working Hubs",
      "Retail Showrooms & Brand Pavilions",
      "Mixed-Use Commercial Complexes",
    ],
  },
  {
    id: "interior",
    title: "Interior Design",
    description:
      "Curated interiors that transform spaces — from luxury apartments to corporate suites and hospitality venues. Every material, light, and finish is chosen with intent.",
    iconName: "Layers",
    image: "/images/interior4.jpeg",
    scopePoints: [
      "Contemporary Living & Dining Suites",
      "Luxury Master Bedrooms & Wardrobes",
      "Ergonomic Modular Kitchens",
      "Architectural Lighting & Ceiling Geometry",
    ],
  },
  {
    id: "urban",
    title: "Urban Planning",
    description:
      "Sustainable master planning and urban design for city developments, townships, and public precincts. We engage with local context to create resilient communities.",
    iconName: "Map",
    image: "/images/urban1.jpg",
    scopePoints: [
      "Temple Precinct & Heritage Redevelopment",
      "Integrated Township Master Layouts",
      "Public Realm & Civic Space Planning",
      "Zoning & Land-Use Optimization",
    ],
  },
  {
    id: "landscape",
    title: "Landscape Design",
    description:
      "Urban parks, green corridors, and outdoor environments that bring nature and community together. We design the landscape as an essential extension of the built form.",
    iconName: "Trees",
    image: "/images/landscape10.jpg",
    scopePoints: [
      "Land Subdivision & Layout Landscaping",
      "Private Courtyards & Terrace Gardens",
      "Waterfront & Lake Promenade Concepts",
      "Pedestrian Plazas & Green Buffers",
    ],
  },
  {
    id: "consultancy",
    title: "Project Consultancy",
    description:
      "Expert advisory on feasibility, statutory regulatory approvals, structural coordination, and project management — ensuring timely delivery without budget surprises.",
    iconName: "ClipboardCheck",
    image: "/images/infra2.jpg",
    scopePoints: [
      "Development Feasibility & FSI Studies",
      "Technical Peer Review & Drawing Audits",
      "Tender Documentation & BOQ Preparation",
      "Site Supervision & Quality Assurance",
    ],
  },
];

export const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Discovery & Analysis",
    text: "We begin by listening. Understanding your lifestyle goals, site topography, microclimate, budget constraints, and timeline before a single line is drawn.",
  },
  {
    num: "02",
    title: "Concept & Ideation",
    text: "Translating the brief into bold ideas — conceptual sketches, spatial diagrams, and 3D massing studies that capture the soul and spirit of the project.",
  },
  {
    num: "03",
    title: "Design Development",
    text: "Refining every detail — architectural plans, structural alignment, elevation details, material palettes, and photorealistic 3D visualization.",
  },
  {
    num: "04",
    title: "Technical Documentation",
    text: "Producing comprehensive working drawings, MEP sets, joinery specifications, and BOQs — providing contractors with flawless buildable blueprints.",
  },
  {
    num: "05",
    title: "Execution & Oversight",
    text: "Periodic site inspections, contractor coordination, and meticulous quality audits — ensuring execution remains uncompromised from paper to reality.",
  },
];

export const FAQ_LIST: FAQItem[] = [
  {
    category: "Engagement",
    question: "How do I start a project with Mohalkar Architects?",
    answer:
      "Simply fill out our project enquiry form or reach us via phone or WhatsApp. We will schedule an initial discovery consultation to understand your project scope, location, site dimensions, and aspirations. Following this, we share a tailored proposal outlining the exact design scope, deliverables, milestone schedules, and transparent fee structure.",
  },
  {
    category: "Financials",
    question: "What is your fee structure and payment schedule?",
    answer:
      "Our fees are calibrated based on project typology, built-up area (sq.ft), and the depth of services required. For custom residences and interior assignments, we generally operate on a transparent fixed-fee or per-sq.ft basis. For large-scale commercial or urban master plans, we work on percentage-of-construction or phased stage billing. We provide an itemized fee breakdown upfront with no hidden surcharges.",
  },
  {
    category: "Scope",
    question: "Do you handle both architectural design and construction?",
    answer:
      "Mohalkar Architects & Planners is an independent design and planning consultancy. To maintain the highest fiduciary standard and ensure zero conflict of interest, we do not act as commercial builders or general contractors. Instead, we represent you as your principal architect: preparing rigorous tender documents, evaluating contractor bids, and conducting on-site quality control audits to ensure contractors construct precisely according to our blueprints.",
  },
  {
    category: "Timelines",
    question: "How long does a typical architectural project take?",
    answer:
      "Design phases (from concept through municipal sanctions and working drawings) typically take between 4 to 10 weeks depending on project complexity. Construction timelines depend on the scale: a 2,500 to 5,000 sq.ft private bungalow generally takes 12 to 18 months, whereas large commercial projects may span 18 to 24+ months. We provide a milestone-gated timeline at project inception.",
  },
  {
    category: "Geography",
    question: "Do you take projects outside Maharashtra?",
    answer:
      "Yes, absolutely. While our primary studios operate across Pune, Bhoom, and Dharashiv, our team undertakes projects pan-India. We have delivered architectural drawings and design consultations for clients in Mumbai, Delhi, Goa, Bangalore, and Hyderabad. We utilize virtual design workshops, cloud-based BIM coordination, and scheduled on-site inspections for seamless execution regardless of distance.",
  },
];

export const siteInfo = SITE_INFO;
export default SITE_INFO;
