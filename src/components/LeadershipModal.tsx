import React from 'react';
import { X, Award, CheckCircle2 } from 'lucide-react';
import { TeamMember } from '../data/siteData';

interface LeadershipModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export const LeadershipModal: React.FC<LeadershipModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#fbfaf8] dark:bg-[#0e0e10] border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50">
          <span className="text-xs font-mono tracking-widest text-[#c8a96e] uppercase">
            Principal Leadership
          </span>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 object-cover rounded-full border-2 border-[#c8a96e]/60 shrink-0"
            />
            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-900 dark:text-neutral-100">
                {member.name}
              </h2>
              <div className="text-xs font-mono text-[#c8a96e]">{member.role}</div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                {member.credentials}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Specialization &amp; Expertise Focus
            </div>
            <div className="p-3 bg-[#c8a96e]/10 border border-[#c8a96e]/30 text-xs font-mono text-[#c8a96e]">
              {member.specialization}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Biography &amp; Professional Philosophy
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
              {member.bio}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#c8a96e] text-neutral-950 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
