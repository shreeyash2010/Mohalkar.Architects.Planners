import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2, ArrowUpRight, Loader2 } from 'lucide-react';
import { studioContact } from '../data/siteData';
import { EnquiryLead } from '../data/adminData';

interface EnquirySectionProps {
  prefillData?: {
    typology?: string;
    sqft?: string;
    budget?: string;
    projectTitle?: string;
  };
  onLeadSubmitted?: (lead: EnquiryLead) => void;
}

export const EnquirySection: React.FC<EnquirySectionProps> = ({
  prefillData,
  onLeadSubmitted
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    typology: prefillData?.typology || 'Residential',
    sqft: prefillData?.sqft || '',
    budget: prefillData?.budget || '',
    message: prefillData?.projectTitle
      ? `Regarding: ${prefillData.projectTitle}. We are interested in commissioning a similar architectural project.`
      : ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert('Please fill in Name, Phone, and Email.');
      return;
    }

    setStatus('submitting');
    setStatusMessage('Submitting architectural brief to studio principals...');

    const newLead: EnquiryLead = {
      id: `lead-${Date.now().toString().slice(-6)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location || 'Maharashtra',
      typology: formData.typology,
      estimatedArea: formData.sqft || 'Not Specified',
      estimatedBudget: formData.budget || 'To be discussed',
      message: formData.message || 'General architectural consultation request.',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'New'
    };

    try {
      // 1. Try Vercel Serverless Function endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: newLead.submittedAt
        })
      });

      if (!response.ok) {
        // 2. Fallback to FormSubmit.co
        await fetch('https://formsubmit.co/ajax/mohalkararchitectsandplanners@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            _subject: `Architectural Enquiry: ${formData.typology} from ${formData.name}`,
            _cc: 'abhishekmohalkar0062@gmail.com',
            ...formData
          })
        });
      }

      if (onLeadSubmitted) {
        onLeadSubmitted(newLead);
      }

      setStatus('success');
      setStatusMessage('Your project brief has been received. Our principal architect will contact you within 24 hours.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        typology: 'Residential',
        sqft: '',
        budget: '',
        message: ''
      });
    } catch (err) {
      // Fallback lead register locally
      if (onLeadSubmitted) {
        onLeadSubmitted(newLead);
      }
      setStatus('success');
      setStatusMessage('Brief logged successfully. You can also connect directly on WhatsApp or phone for immediate consultation.');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Ar. Abhishek Mohalkar,\n\nI would like to inquire about an architectural project:\n- Name: ${formData.name || 'Prospective Client'}\n- Typology: ${formData.typology}\n- Location: ${formData.location || 'Pune/Maharashtra'}\n\nPlease share your availability for a preliminary site or studio consultation.`
  );

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${studioContact.email}&cc=${studioContact.secondaryEmail}&su=${encodeURIComponent(`Architectural Commission Brief - ${formData.typology}`)}&body=${encodeURIComponent(`Dear Mohalkar Architects & Planners,\n\nI would like to discuss an architectural project:\n- Client Name: ${formData.name}\n- Phone: ${formData.phone}\n- Project Typology: ${formData.typology}\n- Scope/Location: ${formData.location}\n\nLooking forward to hearing from you.`)}`;

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-mono text-[#c8a96e]">
          <span className="w-8 h-[1px] bg-[#c8a96e]" />
          <span>Commission &amp; Consult</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-50">
          Initiate a Project Brief
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
          Whether you are planning a private luxury estate, commercial headquarters, or need UDCPR municipal sanction clearances, our studio is ready to consult.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Contact Information & Direct Channels */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="p-8 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-6">
            <h3 className="font-serif text-2xl font-medium text-neutral-900 dark:text-neutral-100">
              Studio Headquarters
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3 text-neutral-600 dark:text-neutral-300">
                <MapPin className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Pune Studio</div>
                  <div>{studioContact.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-600 dark:text-neutral-300">
                <Mail className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Direct Inquiries</div>
                  <a href={`mailto:${studioContact.email}`} className="text-[#c8a96e] hover:underline block">
                    {studioContact.email}
                  </a>
                  <a href={`mailto:${studioContact.secondaryEmail}`} className="text-neutral-400 hover:underline block text-[11px]">
                    {studioContact.secondaryEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-600 dark:text-neutral-300">
                <Clock className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Studio Hours</div>
                  <div>{studioContact.hours}</div>
                </div>
              </div>
            </div>

            {/* Direct Quick-Action Links */}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              <a
                href={`https://wa.me/${studioContact.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/50 text-[#25D366] text-xs font-mono tracking-wider uppercase transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp Consultation</span>
              </a>

              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-mono tracking-wider uppercase transition-colors text-neutral-800 dark:text-neutral-200"
              >
                <Mail className="w-4 h-4 text-[#c8a96e]" />
                <span>Open Gmail Web Compose</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Detailed Project Brief Submission Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <form
            onSubmit={handleSubmit}
            className="p-8 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-serif text-2xl font-medium text-neutral-900 dark:text-neutral-100">
                Architectural Project Brief
              </h3>
              <span className="text-[10px] font-mono text-[#c8a96e] uppercase tracking-wider">
                Confidential Review
              </span>
            </div>

            {status === 'success' && (
              <div className="p-4 bg-[#c8a96e]/15 border border-[#c8a96e] text-xs font-mono text-neutral-900 dark:text-neutral-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#c8a96e] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#c8a96e]">Brief Submitted Successfully</div>
                  <p>{statusMessage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vikramaditya Shinde"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-[#c8a96e] focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98220 00000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-[#c8a96e] focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="client@domain.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-[#c8a96e] focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                  Project Site Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Baner / Lonavala / Mulshi"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-[#c8a96e] focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                  Typology
                </label>
                <select
                  value={formData.typology}
                  onChange={e => setFormData({ ...formData, typology: e.target.value })}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-[#c8a96e] focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Interior">Interior</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Urban Planning">Urban Planning</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Sanctions">UDCPR Sanctions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                  Approx. Area (Sq.Ft)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 6,500 sq.ft"
                  value={formData.sqft}
                  onChange={e => setFormData({ ...formData, sqft: e.target.value })}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-[#c8a96e] focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                  Projected Budget
                </label>
                <input
                  type="text"
                  placeholder="e.g., ₹2.5 - ₹3.5 Cr"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-[#c8a96e] focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <label className="text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                Project Vision &amp; Scope Requirements
              </label>
              <textarea
                rows={4}
                placeholder="Describe your site conditions, required spaces, timeline, or statutory requirements..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 focus:border-[#c8a96e] focus:outline-hidden text-neutral-900 dark:text-neutral-100 font-sans text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3.5 px-6 bg-[#c8a96e] hover:bg-[#dfc38d] text-neutral-950 text-xs font-mono font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Brief...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Project Brief</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
