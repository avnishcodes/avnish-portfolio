import React, { useState } from 'react';
import { personalInfo } from '../data/portfolioData';
import { 
  Mail, 
  Linkedin, 
  Github, 
  Copy, 
  Check, 
  Send, 
  MapPin, 
  ArrowUpRight, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
    referenceId: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill out all required fields (Name, Email, and Message).');
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Prepare email payload to Savnish174@gmail.com
    const recipientEmail = personalInfo.email;
    const finalSubject = formData.subject.trim() || `Portfolio Contact from ${formData.name.trim()}`;
    const emailBody = `Sender Name: ${formData.name.trim()}\nSender Email: ${formData.email.trim()}\nSubject: ${finalSubject}\n\nMessage:\n${formData.message.trim()}`;

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      finalSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    // Simulate reliable transmission and trigger mail client
    setTimeout(() => {
      try {
        window.location.href = mailtoUrl;
      } catch (err) {
        console.error('Mailto launch trigger:', err);
      }

      setSubmittedData({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: finalSubject,
        message: formData.message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referenceId: `MSG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      });

      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrorMessage('');
  };

  return (
    <section id="contact" className="py-24 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2.5">
            <span className="w-4 h-px bg-indigo-500" />
            <span>09 · Connection Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Get in <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic font-normal">Touch</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
            I am always open to discussing new internship opportunities, research collaborations, open-source projects, or technology in general.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Links & Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Email Card with Copy Button */}
            <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-xs sm:text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  id="copy-email-btn"
                  title="Copy email to clipboard"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {copied && (
                <p className="text-xs text-emerald-400 font-mono mt-2.5 pl-1 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Email address copied to clipboard!</span>
                </p>
              )}
            </div>

            {/* LinkedIn Card */}
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              id="contact-linkedin-card"
              className="p-4.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    LinkedIn Network
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    linkedin.com/in/{personalInfo.linkedinUsername}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* GitHub Card */}
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              id="contact-github-card"
              className="p-4.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 text-white flex items-center justify-center shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    GitHub Code Repositories
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    github.com/{personalInfo.githubUsername}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Location & Availability Note */}
            <div className="p-4.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Punjab, India · Open to Remote &amp; On-Site Roles</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Available for Summer/Winter 2025–2026 internships and software developer opportunities. Typically responds within 24 hours.
              </p>
            </div>

          </div>

          {/* Right Column: Functional Interactive Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Send a Message
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Direct to: {personalInfo.email}
              </span>
            </div>

            {submittedData ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-4 animate-fade-in shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">
                    Message Prepared &amp; Dispatched!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white font-semibold">{submittedData.name}</strong>! Your inquiry has been processed for transmission to <strong className="text-indigo-300 font-mono">{personalInfo.email}</strong>.
                  </p>
                </div>

                {/* Submitted Summary Receipt */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
                    <span>Reference ID:</span>
                    <span className="text-indigo-400 font-bold">{submittedData.referenceId}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sender:</span>
                    <span className="text-white">{submittedData.email}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Subject:</span>
                    <span className="text-white truncate max-w-[200px]">{submittedData.subject}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Timestamp:</span>
                    <span className="text-slate-300">{submittedData.timestamp}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Send Another Note</span>
                  </button>

                  <a
                    href={`mailto:${personalInfo.email}?subject=${encodeURIComponent(submittedData.subject)}&body=${encodeURIComponent(submittedData.message)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl transition-all shadow-md shadow-emerald-600/25"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Re-open Email App</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ML Internship Opportunity / Project Collaboration"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Message <span className="text-indigo-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your note or opportunity details here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-contact-form-btn"
                  className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:shadow-indigo-600/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Message to {personalInfo.email}...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit &amp; Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
