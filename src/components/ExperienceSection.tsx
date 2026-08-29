import React from 'react';
import { experienceData } from '../data/portfolioData';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-24 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2.5">
            <span className="w-4 h-px bg-indigo-500" />
            <span>04 · Professional Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Work &amp; <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic font-normal">Internships</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
            Practical industry training and hands-on internship roles specializing in Machine Learning workflows and Python software development.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="relative border-l border-indigo-500/30 ml-4 sm:ml-6 space-y-10 pl-5 sm:pl-7">
          {experienceData.map((exp, idx) => (
            <div
              key={exp.id}
              id={`experience-item-${exp.id}`}
              className="relative group"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center group-hover:scale-125 transition-transform">
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
              </div>

              {/* Main Card */}
              <div className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-5 sm:p-7 transition-all hover:shadow-xl hover:shadow-black/40">
                
                {/* Role & Company Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs sm:text-sm font-medium text-teal-400">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exp.company}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs font-normal text-slate-400">{exp.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-mono rounded-full">
                      {exp.type}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-4">
                  {exp.description}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 mb-5">
                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-300">
                      <span className="text-indigo-400 font-mono font-bold mt-0.5 select-none">▸</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Key Outcome Highlight */}
                {exp.keyOutcome && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-teal-500/20 text-xs text-slate-300 mb-5 flex items-start gap-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-teal-300 font-mono text-[10px] block uppercase tracking-wider mb-0.5">
                        Key Deliverable / Outcome
                      </strong>
                      <span className="text-xs">{exp.keyOutcome}</span>
                    </div>
                  </div>
                )}

                {/* Tech Chips */}
                <div className="pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400 mr-1.5">Technologies:</span>
                  {exp.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded-md text-[11px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
