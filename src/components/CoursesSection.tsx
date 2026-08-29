import React from 'react';
import { certificationsData } from '../data/portfolioData';
import { Award, BookCheck, ExternalLink, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CoursesSection: React.FC = () => {
  return (
    <section id="courses" className="py-24 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2.5">
            <span className="w-4 h-px bg-indigo-500" />
            <span>06 · Credentials &amp; Training</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Courses &amp; <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic font-normal">Certifications</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
            Verified technical training certifications and university coursework spanning Machine Learning, Python automation, SQL databases, and leadership.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificationsData.map((cert) => (
            <div
              key={cert.id}
              id={`cert-card-${cert.id}`}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-5 transition-all hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-[11px] font-mono text-teal-400">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded-md border border-slate-800 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {cert.date}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3.5">
                  {cert.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {cert.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-[11px] font-mono text-slate-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                {cert.credentialId ? (
                  <span className="text-slate-500">ID: {cert.credentialId}</span>
                ) : (
                  <span className="text-slate-500">Institutional Curriculum</span>
                )}
                <span className="text-teal-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Completion
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
