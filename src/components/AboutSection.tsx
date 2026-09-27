import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ShieldCheck, CheckCircle2, Award, UserCheck, ArrowUpRight } from 'lucide-react';
import { studioLeadership, studioMetrics } from '../data/siteData';

interface AboutSectionProps {
  onOpenLeadershipModal: (member: typeof studioLeadership[0]) => void;
  onNavigate: (section: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenLeadershipModal,
  onNavigate
}) => {
  const principles = [
    {
      title: 'Bioclimatic Contextualism',
      description: 'Architecture tailored to local wind dynamics, solar azimuth paths, and thermal massing to minimize mechanical cooling by up to 40%.'
    },
    {
      title: 'Monolithic Material Honesty',
      description: 'Celebrating raw basalt masonry, exposed architectural concrete, natural teak, and patinated brass that age with dignity.'
    },
    {
      title: 'UDCPR 2020 Statutory Precision',
      description: 'Deep regulatory mastery across PMC, PCMC, PMRDA, ensuring maximum permissible carpet FSI and 100% compliance with zero clearance delays.'
    },
    {
      title: 'BIM & Structural Synergy',
      description: 'Integrated 3D BIM coordination between architecture, structural cantilevers, and MEP infrastructure to eliminate site execution errors.'
    }
  ];

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-mono text-[#c8a96e]">
          <span className="w-8 h-[1px] bg-[#c8a96e]" />
          <span>Studio Ethos &amp; Heritage</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
          Crafting spaces that resonate with geological permanence and human ritual.
        </h2>
      </motion.div>

      {/* Main Grid: Story + Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-6 text-neutral-600 dark:text-neutral-300 font-light leading-relaxed text-base sm:text-lg"
        >
          <p>
            Established in Pune, <strong className="font-semibold text-neutral-900 dark:text-neutral-100">Mohalkar Architects &amp; Planners</strong> has spent nearly two decades defining a distinctive regional architectural language that fuses contemporary structural boldness with indigenous climatic wisdom.
          </p>
          <p>
            Our multidisciplinary practice bridges bespoke luxury residences, high-density IT headquarters, contoured agro-tourism resorts, and industrial manufacturing campuses across Maharashtra and pan-India.
          </p>
          <p>
            Every commission begins with rigorous site contour analysis, solar trajectory modeling, and strategic statutory planning to optimize space, daylight, and long-term asset value.
          </p>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={() => onNavigate('enquiry')}
              className="px-6 py-3 text-xs tracking-widest uppercase font-semibold bg-[#c8a96e] hover:bg-[#dfc38d] text-neutral-950 transition-colors cursor-pointer rounded-xs"
            >
              Consult Our Principals
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 relative"
        >
          <div className="border border-neutral-300 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900/60 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
              alt="Architectural Drafting Studio"
              className="w-full aspect-4/3 object-cover"
            />
            <div className="pt-3 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex justify-between">
              <span>DESIGN STUDIO · PUNE</span>
              <span>18+ YEARS PRACTICE</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Core Principles Cards with Framer Motion Scroll Reveal */}
      <div className="mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono uppercase tracking-widest text-[#c8a96e] mb-8"
        >
          Design Foundations
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((prin, index) => (
            <motion.div
              key={prin.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3"
            >
              <span className="font-mono text-xs text-[#c8a96e] font-semibold">
                0{index + 1}
              </span>
              <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {prin.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                {prin.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leadership Profiles */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#c8a96e] block mb-2">
              Principal Leadership
            </span>
            <h2 className="font-serif text-3xl font-light text-neutral-900 dark:text-neutral-100">
              Headed by Pioneers in Architecture &amp; Engineering
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {studioLeadership.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              onClick={() => onOpenLeadershipModal(member)}
              className="group cursor-pointer border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:border-[#c8a96e]/50"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-28 h-28 object-cover rounded-full border-2 border-[#c8a96e]/40 shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left flex-1">
                <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-[#c8a96e] transition-colors">
                  {member.name}
                </h3>
                <div className="text-xs font-mono text-[#c8a96e]">{member.role}</div>
                <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  {member.credentials}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>
                <div className="pt-2 text-xs font-mono text-[#c8a96e] flex items-center justify-center sm:justify-start gap-1">
                  <span>Read Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
