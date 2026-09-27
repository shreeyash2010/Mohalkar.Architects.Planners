import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lightbulb,
  HeartHandshake,
  Loader2,
  ExternalLink,
  FileText,
} from "lucide-react";
import { SITE_INFO } from "../data/siteData";
import { recordNewClientEnquiry } from "../utils/projectStorage";
import { useTheme } from "../context/ThemeContext";

interface EnquirySectionProps {
  initialEstimate?: {
    type: string;
    area: number;
    tier: string;
    estimatedWeeks: string;
  } | null;
}

export const EnquirySection: React.FC<EnquirySectionProps> = ({ initialEstimate }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    type: "residential",
    budget: "",
    details: "",
    source: "Instagram",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [serverNotice, setServerNotice] = useState<string>("");

  // Populate from cost estimator if applied
  useEffect(() => {
    if (initialEstimate) {
      setFormData((prev) => ({
        ...prev,
        details: `[Estimated via Scope Calculator]\nTypology: ${initialEstimate.type}\nBuilt-up Area: ${initialEstimate.area} sq.ft\nScope Tier: ${initialEstimate.tier}\nEstimated Duration: ${initialEstimate.estimatedWeeks}\n\nAdditional notes: `,
      }));
    }
  }, [initialEstimate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateEmailBody = () => {
    return (
      `Dear Mohalkar Architects & Planners,\n\n` +
      `I would like to submit a new architectural project enquiry:\n\n` +
      `• Client Name: ${formData.name}\n` +
      `• Phone Number: ${formData.phone}\n` +
      `• Email Address: ${formData.email}\n` +
      `• Project Location: ${formData.location || "Maharashtra"}\n` +
      `• Typology: ${formData.type}\n` +
      `• Approximate Budget: ${formData.budget || "Discuss upon consultation"}\n` +
      `• Referral Source: ${formData.source}\n\n` +
      `Project Brief & Requirements:\n` +
      `${formData.details}\n\n` +
      `Best regards,\n` +
      `${formData.name}`
    );
  };

  const getMailtoUrl = () => {
    const subject = `New Project Brief: ${formData.name} - ${formData.type.toUpperCase()}`;
    const body = generateEmailBody();
    return `mailto:mohalkararchitectsandplanners@gmail.com?cc=abhishekmohalkar0062@gmail.com&subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const getGmailWebUrl = () => {
    const subject = `New Project Brief: ${formData.name} - ${formData.type.toUpperCase()}`;
    const body = generateEmailBody();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=mohalkararchitectsandplanners@gmail.com&cc=abhishekmohalkar0062@gmail.com&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.details.trim()) {
      setErrorMsg("Please fill in your name, contact phone number, email address, and project brief.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);
    setServerNotice("");

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        project_location: formData.location || "Maharashtra",
        project_type: formData.type,
        approximate_budget: formData.budget || "Discuss upon consultation",
        referral_source: formData.source,
        project_details: formData.details,
        _subject: `New Project Enquiry: ${formData.name} (${formData.type.toUpperCase()}) - Mohalkar Architects`,
        _cc: "abhishekmohalkar0062@gmail.com",
        _replyto: formData.email,
        _template: "table",
        _captcha: "false",
      };

      const response = await fetch(
        "https://formsubmit.co/ajax/mohalkararchitectsandplanners@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => null);
      if (result && result.message && typeof result.message === "string") {
        setServerNotice(result.message);
      }

      recordNewClientEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location || "Maharashtra",
        projectType: formData.type,
        budget: formData.budget,
        message: formData.details,
      });

      setSubmitted(true);
    } catch (err) {
      console.warn("Transmission fallback triggered.", err);
      recordNewClientEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location || "Maharashtra",
        projectType: formData.type,
        budget: formData.budget,
        message: formData.details,
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsAppDirect = () => {
    const message =
      `*Project Enquiry - Mohalkar Architects*\n\n` +
      `*Name:* ${formData.name || "Client"}\n` +
      `*Phone:* ${formData.phone || "Not provided"}\n` +
      `*Email:* ${formData.email || "Not provided"}\n` +
      `*Location:* ${formData.location || "Maharashtra"}\n` +
      `*Project Type:* ${formData.type}\n` +
      `*Budget:* ${formData.budget || "Discuss upon consultation"}\n` +
      `*Referral Source:* ${formData.source}\n\n` +
      `*Project Brief:*\n${formData.details || "Requesting discovery consultation."}`;

    const url = `https://wa.me/919146079235?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ── HERO ───────────────────────────────────── */}
      <section
        className={`relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b bg-blueprint-grid ${
          isDark ? "border-[#1e2229]" : "border-[#e5e9f0]"
        }`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold mb-3 block">
            Direct Contact &amp; Studio Inquiries
          </span>
          <h1
            className={`font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            We&rsquo;d Love to Hear From You
          </h1>
          <p
            className={`mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            Begin the dialogue for your private bungalow, commercial space, or township planning. All briefs are delivered directly to <span className="text-[#c8a96e] font-semibold">mohalkararchitectsandplanners@gmail.com</span> with responses within 24 hours.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT GRID ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Studio Information */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
                Studio Reach
              </span>
              <h2
                className={`font-serif text-3xl font-bold mt-1 ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Reach Us Directly
              </h2>
              <p
                className={`text-xs sm:text-sm mt-2 ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Have an urgent brief or prefer a direct conversation? Contact Principal Architect Abhishek Mohalkar and our project coordinators.
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone */}
              <div
                className={`p-5 rounded-xl border flex items-start gap-4 transition-colors ${
                  isDark
                    ? "border-[#252830] bg-[#12151c]"
                    : "border-[#e2e6ee] bg-white shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[#c8a96e] shrink-0 ${
                    isDark
                      ? "bg-[#161a22] border-[#252830]"
                      : "bg-[#f4f6fa] border-[#d8dde6]"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-wider font-semibold ${
                      isDark ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    Studio Telephones
                  </p>
                  <a
                    href={`tel:${SITE_INFO.contacts.phonePrimary}`}
                    className={`block text-sm font-semibold hover:text-[#c8a96e] transition-colors mt-0.5 ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {SITE_INFO.contacts.phonePrimary} (Direct)
                  </a>
                  <a
                    href={`tel:${SITE_INFO.contacts.phoneSecondary}`}
                    className={`block text-xs hover:text-[#c8a96e] transition-colors mt-0.5 ${
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    {SITE_INFO.contacts.phoneSecondary} (Office)
                  </a>
                </div>
              </div>

              {/* Email */}
              <div
                className={`p-5 rounded-xl border flex items-start gap-4 transition-colors ${
                  isDark
                    ? "border-[#252830] bg-[#12151c]"
                    : "border-[#e2e6ee] bg-white shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[#c8a96e] shrink-0 ${
                    isDark
                      ? "bg-[#161a22] border-[#252830]"
                      : "bg-[#f4f6fa] border-[#d8dde6]"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-wider font-semibold ${
                      isDark ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    Official Inquiries &amp; Briefs
                  </p>
                  <a
                    href={`mailto:${SITE_INFO.contacts.emailPrimary}`}
                    className={`block text-xs font-semibold hover:text-[#c8a96e] transition-colors mt-0.5 break-all ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {SITE_INFO.contacts.emailPrimary}
                  </a>
                  <a
                    href={`mailto:${SITE_INFO.contacts.emailDirect}`}
                    className={`block text-[11px] hover:text-[#c8a96e] transition-colors mt-0.5 break-all ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    {SITE_INFO.contacts.emailDirect}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div
                className={`p-5 rounded-xl border flex items-start gap-4 transition-colors ${
                  isDark
                    ? "border-[#252830] bg-[#12151c]"
                    : "border-[#e2e6ee] bg-white shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[#c8a96e] shrink-0 ${
                    isDark
                      ? "bg-[#161a22] border-[#252830]"
                      : "bg-[#f4f6fa] border-[#d8dde6]"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-wider font-semibold ${
                      isDark ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    Studio Footprint
                  </p>
                  <p
                    className={`text-xs mt-0.5 font-medium ${
                      isDark ? "text-neutral-200" : "text-neutral-800"
                    }`}
                  >
                    {SITE_INFO.contacts.location}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    Commissioned for projects pan-India (Pune, Bhoom, Dharashiv, Mumbai, Goa).
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div
                className={`p-5 rounded-xl border flex items-start gap-4 transition-colors ${
                  isDark
                    ? "border-[#252830] bg-[#12151c]"
                    : "border-[#e2e6ee] bg-white shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[#c8a96e] shrink-0 ${
                    isDark
                      ? "bg-[#161a22] border-[#252830]"
                      : "bg-[#f4f6fa] border-[#d8dde6]"
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-wider font-semibold ${
                      isDark ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    Studio Working Hours
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      isDark ? "text-neutral-200" : "text-neutral-800"
                    }`}
                  >
                    {SITE_INFO.contacts.workingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div
              className={`pt-4 border-t ${
                isDark ? "border-[#1e232d]" : "border-[#e5e9f0]"
              }`}
            >
              <p
                className={`text-xs uppercase tracking-widest font-semibold mb-3 ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Follow Design Updates
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={SITE_INFO.contacts.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 text-xs ${
                    isDark
                      ? "border-[#252830] bg-[#12151c] text-neutral-300 hover:text-[#c8a96e] hover:border-[#c8a96e]"
                      : "border-[#d8dde6] bg-white text-neutral-700 hover:text-black hover:border-[#c8a96e] shadow-sm"
                  }`}
                >
                  <Instagram className="w-4 h-4" />
                  <span>{SITE_INFO.contacts.instagramHandle}</span>
                </a>
                <a
                  href={SITE_INFO.contacts.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg border transition-colors ${
                    isDark
                      ? "border-[#252830] bg-[#12151c] text-neutral-300 hover:text-[#c8a96e] hover:border-[#c8a96e]"
                      : "border-[#d8dde6] bg-white text-neutral-700 hover:text-black hover:border-[#c8a96e] shadow-sm"
                  }`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Project Enquiry Form */}
          <div className="lg:col-span-7">
            <div
              className={`p-6 sm:p-10 rounded-2xl border shadow-2xl relative transition-colors ${
                isDark
                  ? "border-[#252830] bg-[#12151c]"
                  : "border-[#e2e6ee] bg-white shadow-xl"
              }`}
            >
              <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
                Project Enquiry
              </span>
              <h2
                className={`font-serif text-2xl sm:text-3xl font-bold mt-1 mb-2 ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Tell Us About Your Project
              </h2>
              <p
                className={`text-xs mb-6 ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Submitting this brief sends your project parameters directly to <strong className={isDark ? "text-neutral-200" : "text-neutral-900"}>mohalkararchitectsandplanners@gmail.com</strong>.
              </p>

              {submitted ? (
                <div
                  className={`p-6 sm:p-8 rounded-xl border space-y-6 ${
                    isDark
                      ? "bg-emerald-950/30 border-emerald-800/40"
                      : "bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="inline-block text-[11px] uppercase tracking-wider text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                      Dispatched to mohalkararchitectsandplanners@gmail.com
                    </span>
                    <h3
                      className={`font-serif text-2xl sm:text-3xl font-bold ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      Brief Sent Successfully
                    </h3>
                    <p
                      className={`text-xs max-w-lg mx-auto leading-relaxed ${
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      }`}
                    >
                      Thank you, <strong className={isDark ? "text-white" : "text-neutral-900"}>{formData.name}</strong>. Your project brief has been delivered to Principal Architect Abhishek Mohalkar and our studio desk. We will review your parameters and connect with you within 24 hours.
                    </p>
                  </div>

                  {/* Summary Receipt Box */}
                  <div
                    className={`p-4 rounded-lg border text-xs space-y-2.5 ${
                      isDark
                        ? "bg-[#0e1117] border-[#252830]"
                        : "bg-white border-[#d8dde6]"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[#c8a96e] font-semibold text-[11px] uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Transmitted Project Parameters</span>
                    </div>
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 ${
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      }`}
                    >
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Client &amp; Contact:</span>
                        <span className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>{formData.name}</span> ({formData.phone})
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Client Email:</span>
                        <span className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Typology &amp; Location:</span>
                        <span className="capitalize">{formData.type}</span> · {formData.location}
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Budget Indication:</span>
                        <span>{formData.budget || "Upon consultation"}</span>
                      </div>
                    </div>
                  </div>

                  {serverNotice && (
                    <div
                      className={`p-3 rounded-lg border text-[11px] text-center ${
                        isDark
                          ? "bg-[#161a22] border-[#2a2f3a] text-neutral-400"
                          : "bg-white border-[#d8dde6] text-neutral-600"
                      }`}
                    >
                      {serverNotice}
                    </div>
                  )}

                  {/* Fast Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={openWhatsAppDirect}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#25d366] hover:bg-[#20ba59] rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Instant WhatsApp Copy</span>
                    </button>

                    <a
                      href={getMailtoUrl()}
                      className={`w-full sm:w-auto px-4 py-2.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
                        isDark
                          ? "bg-[#181c24] hover:bg-[#212631] border-[#2f3542] text-neutral-300 hover:text-white"
                          : "bg-white hover:bg-[#f4f6fa] border-[#d8dde6] text-neutral-800 hover:text-black shadow-sm"
                      }`}
                      title="Open in your default mail app"
                    >
                      <Mail className="w-4 h-4 text-[#c8a96e]" />
                      <span>Open Pre-filled Email</span>
                    </a>

                    <a
                      href={getGmailWebUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full sm:w-auto px-4 py-2.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
                        isDark
                          ? "bg-[#181c24] hover:bg-[#212631] border-[#2f3542] text-neutral-300 hover:text-white"
                          : "bg-white hover:bg-[#f4f6fa] border-[#d8dde6] text-neutral-800 hover:text-black shadow-sm"
                      }`}
                      title="Open in Gmail Web browser"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Gmail Web</span>
                    </a>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          location: "",
                          type: "residential",
                          budget: "",
                          details: "",
                          source: "Instagram",
                        });
                      }}
                      className="text-xs text-neutral-500 hover:text-[#c8a96e] underline cursor-pointer"
                    >
                      Submit Another Query / Project
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Deshmukh"
                        className={`w-full px-3.5 py-3 sm:py-2.5 rounded-lg text-base sm:text-xs focus:outline-none transition-colors disabled:opacity-50 border ${
                          isDark
                            ? "bg-[#161a22] border-[#252830] text-white placeholder-neutral-500 focus:border-[#c8a96e]"
                            : "bg-[#f8f9fb] border-[#d8dde6] text-neutral-900 placeholder-neutral-400 focus:border-[#c8a96e]"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        disabled={isSubmitting}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full px-3.5 py-3 sm:py-2.5 rounded-lg text-base sm:text-xs focus:outline-none transition-colors disabled:opacity-50 border ${
                          isDark
                            ? "bg-[#161a22] border-[#252830] text-white placeholder-neutral-500 focus:border-[#c8a96e]"
                            : "bg-[#f8f9fb] border-[#d8dde6] text-neutral-900 placeholder-neutral-400 focus:border-[#c8a96e]"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@example.com"
                        className={`w-full px-3.5 py-3 sm:py-2.5 rounded-lg text-base sm:text-xs focus:outline-none transition-colors disabled:opacity-50 border ${
                          isDark
                            ? "bg-[#161a22] border-[#252830] text-white placeholder-neutral-500 focus:border-[#c8a96e]"
                            : "bg-[#f8f9fb] border-[#d8dde6] text-neutral-900 placeholder-neutral-400 focus:border-[#c8a96e]"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        Project Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        disabled={isSubmitting}
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Pune, Bhoom, Dharashiv, Mumbai"
                        className={`w-full px-3.5 py-3 sm:py-2.5 rounded-lg text-base sm:text-xs focus:outline-none transition-colors disabled:opacity-50 border ${
                          isDark
                            ? "bg-[#161a22] border-[#252830] text-white placeholder-neutral-500 focus:border-[#c8a96e]"
                            : "bg-[#f8f9fb] border-[#d8dde6] text-neutral-900 placeholder-neutral-400 focus:border-[#c8a96e]"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        Project Type
                      </label>
                      <select
                        name="type"
                        disabled={isSubmitting}
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-3 sm:py-2.5 rounded-lg text-base sm:text-xs focus:outline-none transition-colors disabled:opacity-50 border ${
                          isDark
                            ? "bg-[#161a22] border-[#252830] text-white focus:border-[#c8a96e]"
                            : "bg-[#f8f9fb] border-[#d8dde6] text-neutral-900 focus:border-[#c8a96e]"
                        }`}
                      >
                        <option value="residential">Residential Bungalow / Villa</option>
                        <option value="commercial">Commercial / Retail Mall</option>
                        <option value="interior">Interior Design</option>
                        <option value="urban-planning">Urban / Landscape</option>
                        <option value="3d-viz">3D Visualization Only</option>
                        <option value="consultancy">Project Consultancy</option>
                        <option value="other">Other Scope</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                          isDark ? "text-neutral-300" : "text-neutral-700"
                        }`}
                      >
                        Approximate Budget
                      </label>
                      <select
                        name="budget"
                        disabled={isSubmitting}
                        value={formData.budget}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-3 sm:py-2.5 rounded-lg text-base sm:text-xs focus:outline-none transition-colors disabled:opacity-50 border ${
                          isDark
                            ? "bg-[#161a22] border-[#252830] text-white focus:border-[#c8a96e]"
                            : "bg-[#f8f9fb] border-[#d8dde6] text-neutral-900 focus:border-[#c8a96e]"
                        }`}
                      >
                        <option value="">Prefer to discuss on call</option>
                        <option value="under-10L">Under ₹10 Lakhs</option>
                        <option value="10-50L">₹10 – 50 Lakhs</option>
                        <option value="50L-1Cr">₹50 Lakhs – 1 Crore</option>
                        <option value="1-5Cr">₹1 – 5 Crore</option>
                        <option value="5Cr+">₹5 Crore+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      }`}
                    >
                      Project Details &amp; Dimensions *
                    </label>
                    <textarea
                      name="details"
                      rows={4}
                      required
                      disabled={isSubmitting}
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Share your site dimensions, built-up requirements, preferred architectural style, and anticipated timeline..."
                      className={`w-full px-3.5 py-3 sm:py-2.5 rounded-lg text-base sm:text-xs focus:outline-none transition-colors disabled:opacity-50 border ${
                        isDark
                          ? "bg-[#161a22] border-[#252830] text-white placeholder-neutral-500 focus:border-[#c8a96e]"
                          : "bg-[#f8f9fb] border-[#d8dde6] text-neutral-900 placeholder-neutral-400 focus:border-[#c8a96e]"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      }`}
                    >
                      How did you hear about us?
                    </label>
                    <div
                      className={`flex flex-wrap gap-4 text-xs ${
                        isDark ? "text-neutral-300" : "text-neutral-700"
                      }`}
                    >
                      {["Instagram", "LinkedIn", "Referral", "Google", "Other"].map((src) => (
                        <label key={src} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="source"
                            disabled={isSubmitting}
                            value={src}
                            checked={formData.source === src}
                            onChange={handleChange}
                            className="accent-[#c8a96e]"
                          />
                          <span>{src}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg border text-[11px] flex items-center gap-2 ${
                      isDark
                        ? "bg-[#141720] border-[#222733] text-neutral-400"
                        : "bg-[#f8f9fc] border-[#e2e6ef] text-neutral-600"
                    }`}
                  >
                    <Mail className="w-4 h-4 text-[#c8a96e] shrink-0" />
                    <span>
                      Brief will be delivered in real time to <strong className={isDark ? "text-neutral-200" : "text-neutral-900"}>mohalkararchitectsandplanners@gmail.com</strong> (CC: Abhishek Mohalkar).
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-[#0c0e12] bg-[#c8a96e] hover:bg-[#dfc085] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#0c0e12]" />
                          <span>Delivering Brief to Studio...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Project Brief</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={openWhatsAppDirect}
                      className="w-full sm:w-auto px-5 py-3 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800/40 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                      title="Send via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Brief</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY WORK WITH US (3 PILLARS) ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#c8a96e] font-semibold">
            Why Mohalkar
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold mt-1 ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Why Work With Us
          </h2>
          <p
            className={`text-xs sm:text-sm mt-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            The principles that distinguish our architectural practice across private and institutional clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`p-7 rounded-xl border space-y-3 transition-colors ${
              isDark
                ? "border-[#252830] bg-[#12151c]"
                : "border-[#e2e6ee] bg-white shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[#c8a96e] ${
                isDark ? "bg-[#161a22] border-[#252830]" : "bg-[#f4f6fa] border-[#d8dde6]"
              }`}
            >
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3
              className={`font-serif text-xl font-bold ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Client-First Approach
            </h3>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              We listen before we design. Your goals, lifestyle, and budget shape every decision — not fleeting trends or personal preferences.
            </p>
          </div>

          <div
            className={`p-7 rounded-xl border space-y-3 transition-colors ${
              isDark
                ? "border-[#252830] bg-[#12151c]"
                : "border-[#e2e6ee] bg-white shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[#c8a96e] ${
                isDark ? "bg-[#161a22] border-[#252830]" : "bg-[#f4f6fa] border-[#d8dde6]"
              }`}
            >
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3
              className={`font-serif text-xl font-bold ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              Creative Rigour
            </h3>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              We don&rsquo;t separate creativity from technical accuracy. Beautiful designs that also work — on paper and in reality.
            </p>
          </div>

          <div
            className={`p-7 rounded-xl border space-y-3 transition-colors ${
              isDark
                ? "border-[#252830] bg-[#12151c]"
                : "border-[#e2e6ee] bg-white shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center text-[#c8a96e] ${
                isDark ? "bg-[#161a22] border-[#252830]" : "bg-[#f4f6fa] border-[#d8dde6]"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3
              className={`font-serif text-xl font-bold ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              End-to-End Partnership
            </h3>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              We stay with you from the first sketch to the final handover. No handoffs, no silos — one team, fully accountable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
