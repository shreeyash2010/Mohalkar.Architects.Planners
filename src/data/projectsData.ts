export interface Project {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Interior' | 'Landscape' | 'Urban Planning' | 'Industrial' | 'Sanctions';
  year: string;
  location: string;
  area: string;
  client?: string;
  scope: string[];
  status: 'Completed' | 'Under Construction' | 'Masterplan Phase' | 'Sanction Approved';
  description: string;
  concept: string;
  heroImage: string;
  gallery: string[];
  blueprints?: string[];
  featured?: boolean;
  budgetTier?: 'Ultra Luxury' | 'Premium Executive' | 'Standard Spec';
}

export const initialProjects: Project[] = [
  {
    id: 'aurora-residence',
    title: 'Aurora Pavilion & Private Estate',
    category: 'Residential',
    year: '2025',
    location: 'Lonavala / Pune Corridor, MH',
    area: '14,500 sq.ft',
    client: 'Private Tech Executive',
    scope: ['Architecture', 'Landscape Integration', 'Interior Architecture', 'Structural Optimization'],
    status: 'Completed',
    description: 'A monolithic hilltop villa combining exposed textured basalt masonry with cantilevered glass volumes framing misty Western Ghat horizons.',
    concept: 'Harmonizing passive bioclimatic cooling with expansive 4-meter cantilevers that shade thermal mass while dissolving the indoor-outdoor barrier.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80'
    ],
    blueprints: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    budgetTier: 'Ultra Luxury'
  },
  {
    id: 'nexus-commercial-tower',
    title: 'Nexus Biophilic IT Headquarters',
    category: 'Commercial',
    year: '2024',
    location: 'Baner Commercial Zone, Pune',
    area: '82,000 sq.ft',
    client: 'Nexus Global Ventures',
    scope: ['Commercial Architecture', 'LEED Platinum Compliance', 'Façade Engineering', 'Municipal Sanctions'],
    status: 'Completed',
    description: 'An energy-efficient 12-storey commercial office tower with dynamic perforated brass sunshades and multi-level sky terraces.',
    concept: 'Parametrically optimized double-skin envelope reducing solar heat gain by 38% while bringing filtered natural daylight to core collaboration hubs.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80'
    ],
    featured: true,
    budgetTier: 'Ultra Luxury'
  },
  {
    id: 'celestial-interior-penthouse',
    title: 'The Sky Sanctuary Penthouse',
    category: 'Interior',
    year: '2025',
    location: 'Koregaon Park Annexe, Pune',
    area: '6,200 sq.ft',
    client: 'Celebrity Industrialist',
    scope: ['Luxury Interior Architecture', 'Bespoke Joinery', 'Architectural Lighting', 'Acoustic Engineering'],
    status: 'Completed',
    description: 'An ethereal duplex penthouse characterized by travertine micro-cement finishes, walnut fluted panelling, and integrated bronze architectural profiles.',
    concept: 'Wabi-sabi architectural minimalism elevated with rich Indian tactile materiality, curated stone monoliths, and circadian lighting systems.',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80'
    ],
    featured: true,
    budgetTier: 'Ultra Luxury'
  },
  {
    id: 'solstice-botanical-plaza',
    title: 'Solstice Waterfront Botanical Promenade',
    category: 'Landscape',
    year: '2024',
    location: 'Mula-Mutha Riverfront, Pune',
    area: '185,000 sq.ft',
    client: 'Civic Urban Renewal Trust',
    scope: ['Landscape Masterplanning', 'Ecological Restoration', 'Hardscape Design', 'Public Plaza Architecture'],
    status: 'Completed',
    description: 'A regenerative public waterfront park integrating bio-swales, endemic flora zones, amphitheaters, and continuous pedestrian boardwalks.',
    concept: 'Restoring riparian ecology while providing high-amenity public recreational space with zero stormwater runoff discharge.',
    heroImage: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80'
    ],
    featured: false,
    budgetTier: 'Premium Executive'
  },
  {
    id: 'sahyadri-eco-resort',
    title: 'Sahyadri Biosphere Eco Retreat',
    category: 'Urban Planning',
    year: '2025',
    location: 'Mahabaleshwar Foothills, MH',
    area: '42 Acres',
    client: 'Heritage Agro-Tourism Group',
    scope: ['Regional Masterplanning', 'Zoning & Sanctions', 'Eco-Chalet Architecture', 'Infrastructure Layout'],
    status: 'Masterplan Phase',
    description: 'A 42-acre low-impact hospitality masterplan preserving 78% natural tree canopy with rammed earth cottages and renewable micro-grids.',
    concept: 'Zero-carbon masterplanning following contour topology, natural hydrology pathways, and indigenous mud-lime construction.',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80'
    ],
    featured: true,
    budgetTier: 'Ultra Luxury'
  },
  {
    id: 'precision-logistics-park',
    title: 'Chakan Advanced Industrial & Logistics Hub',
    category: 'Industrial',
    year: '2024',
    location: 'Chakan MIDC Phase IV, Pune',
    area: '240,000 sq.ft',
    client: 'Auto Ancillary Consortium',
    scope: ['Industrial Architecture', 'PEB Structural Engineering', 'Fire & Safety Sanctions', 'Heavy Vehicle Circulation'],
    status: 'Completed',
    description: 'High-bay manufacturing and warehouse facility with clear span pre-engineered steel frames, thermal insulated claddings, and automated dispatch docks.',
    concept: 'Optimized logistic turning radiuses, natural ventilation stacks, and heavy structural load-bearing slab systems.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80'
    ],
    featured: false,
    budgetTier: 'Premium Executive'
  },
  {
    id: 'urban-sanctions-dcr-master',
    title: 'Municipal Sanction & Unified DCR Approvals Hub',
    category: 'Sanctions',
    year: '2025',
    location: 'PMC / PCMC / PMRDA Jurisdictions',
    area: 'Over 500,000+ sq.ft Sanctioned',
    client: 'Multi-Developer Portfolios',
    scope: ['UDCPR 2020 Compliance', 'FSI / TDR Optimization', 'Structural Feasibility', 'Fire NOC & Environmental Clearances'],
    status: 'Sanction Approved',
    description: 'Comprehensive statutory municipal approvals, liaisoning, AutoDCR scrutiny drawings, and building sanction compliance.',
    concept: 'Maximizing permissible carpet area through intelligent premium FSI, TDR utilization, and stringent statutory safety compliance.',
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80'
    ],
    featured: false,
    budgetTier: 'Standard Spec'
  }
];
