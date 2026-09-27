/**
 * Mohalkar Architects & Planners - Consolidated Project Portfolio
 * Grouped and enhanced with architectural specs, multi-view galleries, category mappings, and high-res local asset bindings.
 */

export interface ProjectItem {
  id: string;
  title: string;
  alt: string;
  category: 'architecture' | 'interior' | 'urban' | 'infrastructure' | 'residential' | 'commercial' | 'industrial' | 'landscape' | 'viz' | 'working';
  tag: string;
  image: string;
  featured?: boolean;
  location?: string;
  scale?: string;
  scope?: string;
  status?: 'working' | 'completed' | 'published';
  progress?: number;
  stage?: 'Concept' | 'Working Drawings' | 'Sanction Approval' | 'Under Construction' | 'Completed' | 'Published';
  publishedAt?: string;
  client?: string;
  gallery?: string[];
}

export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'interior', label: 'Interior Design' },
  { id: 'urban', label: 'Urban Design' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'viz', label: '3D Visualization' },
  { id: 'working', label: 'Working Drawings' },
] as const;

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "proj-havle-residence",
    title: "Havle Residence & Villa Architecture",
    alt: "Havle Residence Architectural Portfolio",
    category: "architecture",
    tag: "Architecture",
    image: "/images/arc1.jpg",
    gallery: [
      "/images/arc2.jpg",
      "/images/arc3.jpg",
      "/images/arc4.jpg",
      "/images/arc5.jpg",
    ],
    featured: true,
    location: "Bhoom, Maharashtra",
    scale: "4,800 sq.ft",
    scope: "Complete Architectural Elevation, Structural Fenestration, Solar Shading Louvers & Cantilever Vistas"
  },
  {
    id: "proj-tuljabhavani-complex",
    title: "Tuljabhavani Temple Complex Area Development",
    alt: "Tuljabhavani Temple Complex Urban Design",
    category: "urban",
    tag: "Urban Design",
    image: "/images/urban1.jpg",
    gallery: [
      "/images/urban2.jpg",
    ],
    featured: true,
    location: "Tuljapur / Dharashiv Region",
    scale: "Civic Precinct",
    scope: "Pilgrim Circulation, Heritage Conservation, Plaza Hardscape & Municipal Area Master Plan"
  },
  {
    id: "proj-5000-bungalow",
    title: "5000 sq.ft Luxury Bungalow",
    alt: "Luxury Bungalow Design",
    category: "residential",
    tag: "Residential",
    image: "/images/project6.jpeg",
    gallery: [
      "/images/project1.jpeg",
      "/images/project2.jpeg",
    ],
    featured: true,
    location: "Bhoom, Maharashtra",
    scale: "5,000 sq.ft",
    scope: "Comprehensive Architectural Design, Climate-Responsive Courtyards & Interior Planning"
  },
  {
    id: "proj-2500-bungalow",
    title: "2,500 sq.ft Contemporary Bungalow Series",
    alt: "Contemporary 2500 sq.ft Residence",
    category: "residential",
    tag: "Residential",
    image: "/images/resi1.png",
    gallery: [
      "/images/resi2.png",
    ],
    featured: false,
    location: "Pune, Maharashtra",
    scale: "2,500 sq.ft",
    scope: "Villa Master Layout, Modern Front Elevation & Structural Working Blueprints"
  },
  {
    id: "proj-1750-bungalow",
    title: "1,750 sq.ft Compact Luxury Bungalow",
    alt: "Compact Luxury Residence",
    category: "residential",
    tag: "Residential",
    image: "/images/resi4.jpg",
    featured: false,
    location: "Dharashiv, Maharashtra",
    scale: "1,750 sq.ft",
    scope: "Compact Villa Elevation, Natural Daylighting & Vaastu Planning"
  },
  {
    id: "proj-industrial-complex",
    title: "Industrial Shed & Manufacturing Complex",
    alt: "Industrial Shed Design",
    category: "industrial",
    tag: "Industrial",
    image: "/images/industrial1.jpg",
    gallery: [
      "/images/industrial2.jpg",
      "/images/industrial3.jpg",
    ],
    featured: true,
    location: "MIDC Industrial Zone, Maharashtra",
    scale: "28,000 sq.ft",
    scope: "Steel Truss Structural Engineering, Heavy Vehicle Logistics & Ventilation Chimneys"
  },
  {
    id: "proj-land-subdivision",
    title: "Land Subdivision & Master Township Layout",
    alt: "Land Subdivision Layout",
    category: "landscape",
    tag: "Landscape",
    image: "/images/landscape1.jpg",
    gallery: [
      "/images/landscape2.jpg",
      "/images/landscape7.jpg",
      "/images/landscape8.jpg",
    ],
    featured: true,
    location: "Bhoom / Dharashiv Region",
    scale: "12 Acres Master Plan",
    scope: "NA Plotting Layout, Internal Arterial Roads, Open Green Corridors & Stormwater Networks"
  },
  {
    id: "proj-botanical-landscape",
    title: "Botanical Terraced Landscape & Waterfront Master Plan",
    alt: "Botanical Landscape Architecture",
    category: "landscape",
    tag: "Landscape",
    image: "/images/landscape9.jpg",
    gallery: [
      "/images/landscape3.jpg",
      "/images/landscape4.jpg",
      "/images/landscape5.jpg",
      "/images/landscape6.jpg",
      "/images/landscape10.jpg",
      "/images/landscape12.jpg",
    ],
    featured: true,
    location: "Pune & Bhoom Outskirts",
    scale: "18,000 sq.ft",
    scope: "Stepped Contour Retaining, Native Drought-Tolerant Planting, Aquatic Bio-Filter Pond & Zen Pavilions"
  },
  {
    id: "proj-2000-luxury-3d",
    title: "2,000 sq.ft Luxury Bungalow (3D Visualization)",
    alt: "2000 sq.ft Luxury Bungalow 3D Renderings",
    category: "viz",
    tag: "3D Visualization",
    image: "/images/3d1.png",
    gallery: [
      "/images/3d2.png",
      "/images/3d3.png",
    ],
    featured: true,
    location: "Maharashtra",
    scale: "2,000 sq.ft",
    scope: "Photorealistic Day/Dusk Lumion Renders, Material Texturing & Landscape Integration"
  },
  {
    id: "proj-hati-talav",
    title: "Proposed Hati Talav Lakefront Promenade",
    alt: "Hati Talav Lakefront 3D Design",
    category: "viz",
    tag: "3D Visualization",
    image: "/images/3d4.jpg",
    gallery: [
      "/images/3d5.jpg",
    ],
    featured: false,
    location: "Dharashiv District",
    scale: "Public Waterfront",
    scope: "Lake Edge Beautification, Pedestrian Boardwalk, Plaza Stepping & Illumination Renders"
  },
  {
    id: "proj-living-salon-interior",
    title: "Contemporary Living Salon & Lounge Interior Suite",
    alt: "Living Room Interior Portfolio",
    category: "interior",
    tag: "Interior Design",
    image: "/images/interior7.png",
    gallery: [
      "/images/interior8.png",
      "/images/interior9.png",
      "/images/interior11.png",
      "/images/interior12.png",
      "/images/interior17.png",
      "/images/interior19.png",
      "/images/interior1.jpeg",
      "/images/interior6.jpeg",
    ],
    featured: true,
    location: "Pune, Maharashtra",
    scale: "1,600 sq.ft",
    scope: "Formal Living Salon, Recessed Cove Lighting, Acoustic Louvers, Italian Marble & Custom Furniture"
  },
  {
    id: "proj-dining-kitchen-interior",
    title: "Dining Salon & Modular Quartz Kitchen Suite",
    alt: "Dining and Kitchen Interior",
    category: "interior",
    tag: "Interior Design",
    image: "/images/interior10.png",
    gallery: [
      "/images/interior18.png",
      "/images/interior13.png",
      "/images/interior3.jpeg",
    ],
    featured: false,
    location: "Pune, Maharashtra",
    scale: "850 sq.ft",
    scope: "Integrated Dining Island, Handleless Matte Black Cabinetry, Quartz Waterfall Edge & Breakfast Bar"
  },
  {
    id: "proj-master-bedroom-suite",
    title: "Master Bedroom Suites & Acoustic Timber Joinery",
    alt: "Master Bedroom Suites",
    category: "interior",
    tag: "Interior Design",
    image: "/images/interior14.png",
    gallery: [
      "/images/interior15.png",
      "/images/interior16.png",
      "/images/interior2.jpeg",
      "/images/interior4.jpeg",
      "/images/interior5.jpeg",
    ],
    featured: true,
    location: "Bhoom, Maharashtra",
    scale: "950 sq.ft",
    scope: "Fluted Timber Bed Backdrops, Concealed Walk-in Wardrobe, False Ceiling & Ensuite Spa Detail"
  },
  {
    id: "proj-akluj-bypass-infra",
    title: "30m Wide Akluj Bypass Arterial Highway & Infrastructure",
    alt: "Akluj Bypass Road Planning",
    category: "infrastructure",
    tag: "Infrastructure",
    image: "/images/infra1.jpg",
    gallery: [
      "/images/infra2.jpg",
      "/images/infra5.jpg",
    ],
    featured: false,
    location: "Akluj Region, Maharashtra",
    scale: "30m Right-of-Way",
    scope: "Highway Alignment, Cross-Sections, Stormwater Drainage Culverts & Junction Intersection Geometry"
  },
  {
    id: "proj-internal-roads-infra",
    title: "Internal Road Network & Pedestrian Corridors",
    alt: "Internal Road Network Infrastructure",
    category: "infrastructure",
    tag: "Infrastructure",
    image: "/images/infra4.jpg",
    gallery: [
      "/images/infra6.jpg",
    ],
    featured: false,
    location: "Mukai Chowk to Shinde Vasti",
    scale: "9m Road Corridor",
    scope: "Pedestrian Walkway Integration, Road Crossfall, Utility Ducts & Asphalt Pavement Design"
  },
  {
    id: "proj-shopping-mall-master",
    title: "Grand Apex Shopping Mall & Cineplex Master Portfolio",
    alt: "Commercial Shopping Mall Complete Architectural Blueprints",
    category: "commercial",
    tag: "Commercial",
    image: "/images/Commercial/COMPILEDFINALSHEETS_page-0004.jpg",
    gallery: [
      "/images/Commercial/COMPILEDFINALSHEETS_page-0001.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0002.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0003.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0005.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0006.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0007.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0008.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0009.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0010.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0011.jpg",
      "/images/Commercial/COMPILEDFINALSHEETS_page-0012.jpg",
    ],
    featured: true,
    location: "Hinjawadi, Pune",
    scale: "26,642.68 sq.m Site",
    scope: "Full Commercial Set: Micro-climate, Master Site Circulation, 2-Level Basement Parking (320 Cars), Retail Arcades, Central Atrium, 4-Screen Multiplex & Facade Elevations"
  },
  {
    id: "proj-working-drawings-master",
    title: "Turnkey Working Drawings & GFC Construction Blueprint Set",
    alt: "Architectural & Structural Working Drawings",
    category: "working",
    tag: "Working Drawings",
    image: "/images/working drawings/WD-IICompiledportfolio_page-0001.jpg",
    gallery: [
      "/images/working drawings/WD-IICompiledportfolio_page-0002.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0003.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0004.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0005.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0006.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0007.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0008.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0009.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0010.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0011.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0012.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0013.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0014.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0015.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0016.jpg",
      "/images/working drawings/WD-IICompiledportfolio_page-0017.jpg",
    ],
    featured: true,
    location: "Pimpri-Chinchwad, Pune",
    scale: "676 sq.m Multi-Storey Plot",
    scope: "Complete GFC Blueprint Set: Setting-out Triangulation, Centre Line Column Grid C1-C16, Footings, Plinth Beams, Floor Plans, Longitudinal/Transverse Sections & Joinery UPVC Details"
  },
  {
    id: "proj-signature-villa-horizon",
    title: "Signature Villa Horizon",
    alt: "Contemporary Cantilever Villa",
    category: "architecture",
    tag: "Architecture",
    image: "/images/project1.jpeg",
    gallery: [
      "/images/project5.jpeg",
      "/images/project4.jpeg",
    ],
    featured: true,
    location: "Pune, Maharashtra",
    scale: "6,200 sq.ft",
    scope: "Modernist Residence with Board-Formed Concrete, Reflective Water Courtyard & Cantilevered Balconies"
  },
  {
    id: "proj-solarium-estate",
    title: "The Solarium Estate & Biophilic Residence",
    alt: "Biophilic Luxury Residence",
    category: "residential",
    tag: "Residential",
    image: "/images/project2.jpeg",
    gallery: [
      "/images/project6.jpeg",
    ],
    featured: true,
    location: "Bhoom, Maharashtra",
    scale: "5,400 sq.ft",
    scope: "Climate-Responsive Multi-Generational Home with Passive Solar Chimney & Shaded Terraces"
  },
  {
    id: "proj-apex-plaza-hub",
    title: "Apex Commercial Plaza & Corporate Hub",
    alt: "Commercial Plaza Hub",
    category: "commercial",
    tag: "Commercial",
    image: "/images/project3.jpg",
    featured: true,
    location: "Bhoom, Maharashtra",
    scale: "32,000 sq.ft",
    scope: "Commercial Facade, Central Sky-Lit Atrium, Corporate Office Suites & Ground Retail"
  },
  {
    id: "proj-courtyard-pavilion",
    title: "Courtyard Serenity Pavilion",
    alt: "Courtyard Pavilion Architecture",
    category: "architecture",
    tag: "Architecture",
    image: "/images/project5.jpeg",
    gallery: [
      "/images/project4.jpeg",
    ],
    featured: true,
    location: "Dharashiv, Maharashtra",
    scale: "4,200 sq.ft",
    scope: "Inward-Focused Contemporary Home around a Meditative Central Water Court & Basalt Stone Walls"
  }
];

// Compatibility aliases for seamless export resolution
export const projectsData = PROJECTS_DATA;
export const projects = PROJECTS_DATA;
export const PROJECTS = PROJECTS_DATA;
export const INITIAL_PROJECTS = PROJECTS_DATA;
export const studioProjects = PROJECTS_DATA;
export default PROJECTS_DATA;

// Export aliases so any import works
export const PROJECTS_DATA = (typeof projects !== 'undefined' ? projects : (typeof projectsData !== 'undefined' ? projectsData : []));
export const projectsData = PROJECTS_DATA;
export const projects = PROJECTS_DATA;
export const PROJECTS = PROJECTS_DATA;
export default PROJECTS_DATA;
