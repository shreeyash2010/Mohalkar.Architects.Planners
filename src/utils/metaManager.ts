export const updatePageMeta = (sectionName: string) => {
  const baseTitle = 'Mohalkar Architects & Planners';
  let title = baseTitle;
  let description = 'Premier architectural studio & urban planning consultancy specializing in residential, commercial, interior, landscape, and urban infrastructure design across India.';

  switch (sectionName) {
    case 'home':
      title = `${baseTitle} | Timeless Architecture & Urban Planning`;
      break;
    case 'about':
      title = `About the Studio | ${baseTitle}`;
      description = '18+ years of architectural excellence, sustainable urban planning, and structural precision led by Ar. Abhishek Mohalkar.';
      break;
    case 'projects':
      title = `Portfolio & Architectural Plates | ${baseTitle}`;
      description = 'Explore our portfolio of bespoke residential estates, commercial IT headquarters, luxury penthouses, and industrial hubs.';
      break;
    case 'expertise':
      title = `Typologies & Masterplanning | ${baseTitle}`;
      description = 'Comprehensive expertise spanning Residential, Commercial, Interior Architecture, Landscape, Industrial & UDCPR Sanctions.';
      break;
    case 'services':
      title = `Architectural Services & Sanctions | ${baseTitle}`;
      description = 'End-to-end architectural design, municipal UDCPR approvals, structural coordination, and site supervision.';
      break;
    case 'enquiry':
      title = `Commission a Project | ${baseTitle}`;
      description = 'Initiate a preliminary project brief, feasibility study, or consultation with our principal architects.';
      break;
    case 'admin':
      title = `Studio Portal | ${baseTitle}`;
      break;
  }

  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description);
  }
};
