import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { certificationsData } from '../data/portfolioData';
import { 
  Award, 
  Calendar, 
  Cloud, 
  Database, 
  Brain, 
  Code2, 
  BookOpen, 
  Cpu 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CertificationItem } from '../types';

export const CoursesSection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  // Lock body scroll and handle ESC key when modal is open
  useEffect(() => {
    if (!selectedCert) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCert]);

  // Icon selector helper
  const getIcon = (iconName: string, className: string = "w-4 h-4") => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className={className} />;
      case 'Database':
        return <Database className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  // Filter logic
  const filteredCerts = certificationsData.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'certifications') return item.category === 'certification';
    if (selectedCategory === 'data-cloud') return item.skills.some(s => ['Microsoft Azure', 'PySpark', 'MySQL', 'SQL', 'Database Design'].includes(s));
    if (selectedCategory === 'python-ml') return item.skills.some(s => ['Python', 'Scikit-Learn', 'OOP', 'Automation'].includes(s));
    if (selectedCategory === 'self-guided') return item.category === 'specialization';
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Credentials', count: certificationsData.length },
    { id: 'certifications', label: 'Industrial Certifications', count: certificationsData.filter(c => c.category === 'certification').length },
    { id: 'data-cloud', label: 'Cloud & Data Engineering', count: 2 },
    { id: 'python-ml', label: 'Python & AI / ML', count: 3 },
    { id: 'self-guided', label: 'Self-Guided Mastery', count: 1 },
  ];

  return (
    <section 
      id="courses" 
      className={`py-24 relative z-10 border-t transition-colors duration-300 ${
        isLight ? 'border-slate-200 bg-slate-50/40' : 'border-slate-800/80 bg-slate-950/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2.5">
            <span className="w-4 h-px bg-indigo-500" />
            <span>06 · Credentials &amp; Continuous Learning</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Courses &amp; <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent italic font-normal">Certifications</span>
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 max-w-2xl ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Curated technical training, verified industry project certifications, and hands-on coursework spanning Cloud Data Engineering, MySQL Business Intelligence, Machine Learning, and Self-Guided Engineering.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : isLight
                      ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : isLight 
                      ? 'bg-slate-100 text-slate-600' 
                      : 'bg-slate-800 text-slate-300'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCerts.map((cert) => {
            const isUdemy = cert.platform === 'Udemy';
            const isVerifiedCert = cert.category === 'certification';

            return (
              <div
                key={cert.id}
                id={`cert-card-${cert.id}`}
                onClick={() => setSelectedCert(cert)}
                className={`rounded-2xl p-5.5 border transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-md shadow-slate-200/50 hover:border-indigo-400 hover:shadow-xl'
                    : 'bg-slate-900/85 border-slate-800 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-black/50'
                }`}
              >
                {/* Subtle top gradient accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Card Header: Icon + Platform Badge + Date */}
                  <div className="flex items-start justify-between gap-2.5 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isVerifiedCert
                          ? isLight ? 'bg-teal-50 border-teal-200 text-teal-600' : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                          : isUdemy
                            ? isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                            : isLight ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      }`}>
                        {getIcon(cert.icon, "w-5 h-5")}
                      </div>
                      
                      <div>
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md font-semibold border ${
                          isUdemy
                            ? isLight 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                            : isLight
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-teal-950/60 text-teal-300 border-teal-800/60'
                        }`}>
                          {cert.platform || 'Industrial'}
                        </span>

                        <p className={`text-[11px] font-mono mt-1 ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono flex items-center gap-1 px-2 py-0.5 rounded-md border shrink-0 ${
                      isLight 
                        ? 'bg-slate-100 border-slate-200 text-slate-600' 
                        : 'bg-slate-950/80 border-slate-800 text-slate-400'
                    }`}>
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {cert.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-sm sm:text-base font-bold mb-2 group-hover:text-indigo-500 transition-colors leading-snug ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {cert.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed mb-4 line-clamp-3 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {cert.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                          isLight
                            ? 'bg-slate-100/90 border-slate-200 text-slate-700 group-hover:border-indigo-200'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 group-hover:border-slate-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal / Dialog for Detailed Certification Info */}
        {selectedCert && typeof document !== 'undefined' && createPortal(
          <div 
            id="cert-detail-modal"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedCert(null)}
          >
            <div 
              className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative transition-all max-h-[90vh] overflow-y-auto ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${
                    isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  }`}>
                    {getIcon(selectedCert.icon, "w-6 h-6")}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-indigo-500 font-bold uppercase tracking-wider">
                      {selectedCert.platform || 'Credential'} · {selectedCert.date}
                    </span>
                    <h3 className="text-lg font-bold leading-tight mt-0.5">
                      {selectedCert.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <p className={`font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Issuing Organization
                  </p>
                  <p className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                    {selectedCert.issuer}
                  </p>
                </div>

                <div>
                  <p className={`font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Overview &amp; Learning Objectives
                  </p>
                  <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {selectedCert.description}
                  </p>
                </div>

                <div>
                  <p className={`font-semibold mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Core Topics &amp; Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                          isLight
                            ? 'bg-slate-100 border-slate-200 text-slate-800'
                            : 'bg-slate-950 border-slate-800 text-slate-200'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-medium transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      </div>
    </section>
  );
};

