import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, Trees, Landmark, Factory, FileText, ArrowRight } from 'lucide-react';

interface ExpertiseSectionProps {
  onNavigate: (section: string) => void;
  onFilterCategory?: (category: string) => void;
}

export const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({
  onNavigate,
  onFilterCategory
}) => {
  const typologies = [
    {
      id: 'Residential',
      title: 'Residential Architecture & Hilltop Estates',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      description: 'Ultra-luxury private bungalows, weekend farmhouses, monolithic hill villas, and high-rise duplex penthouses with seamless outdoor connections.'
    },
    {
      id: 'Commercial',
      title: 'Commercial IT Hubs & Corporate Towers',
      icon: Building2,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      description: 'LEED-certified multi-tenant IT headquarters, corporate suites, boutique retail commercial complexes, and parametric façade engineering.'
    },
    {
      id: 'Urban Planning',
      title: 'Urban Planning & Plotted Townships',
      icon: Landmark,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      description: 'Regional contour layout masterplans, gated residential township subdivisions, eco-resorts, and municipal infrastructure grids.'
    },
    {
      id: 'Interior',
      title: 'Bespoke Luxury Interior Architecture',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
      description: 'Curated architectural interiors, micro-cement finishes, bespoke walnut millwork, acoustic coordination, and circadian lighting systems.'
    },
    {
      id: 'Landscape',
      title: 'Landscape Architecture & Waterfronts',
      icon: Trees,
      image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1000&q=80',
      description: 'Regenerative ecology parks, riparian riverfront promenades, private botanical gardens, zero-runoff rainwater harvesting bioswales.'
    },
    {
      id: 'Industrial',
      title: 'Industrial Campuses & Logistics Facilities',
      icon: Factory,
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
      description: 'Pre-engineered industrial sheds, manufacturing plants, high-bay warehouses with heavy machinery foundations and MIDC approvals.'
    }
  ];

  const handleCategoryClick = (category: string) => {
    if (onFilterCategory) onFilterCategory(category);
    onNavigate('projects');
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-mono text-[#c8a96e]">
          <span className="w-8 h-[1px] bg-[#c8a96e]" />
          <span>Core Typologies</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-50">
          Disciplines Spanning Every Scale of Built Environment
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
          From meticulous residential detail to regional scale township masterplans, our studio delivers unified design, engineering, and statutory clearances.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {typologies.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => handleCategoryClick(item.id)}
              className="group cursor-pointer border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden flex flex-col justify-between hover:border-[#c8a96e]/60 transition-all shadow-xs"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 p-2 bg-[#0e0e10]/80 text-[#c8a96e] backdrop-blur-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="absolute bottom-3 left-3 text-xs font-mono text-[#c8a96e] tracking-widest uppercase">
                  {item.id}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-[#c8a96e] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-[#c8a96e]">
                  <span>Explore Typology Works</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
