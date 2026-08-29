import React from 'react';
import { educationData, positionsOfResponsibility, achievementsData } from '../data/portfolioData';
import { GraduationCap, Award, Calendar, MapPin, Sparkles, Shield, Trophy } from 'lucide-react';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-24 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2.5">
            <span className="w-4 h-px bg-indigo-500" />
            <span>05 · Academics &amp; Leadership</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Academic <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic font-normal">Background</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
            Formal engineering degree studies and technical diploma education with consistent academic record, campus responsibilities, and leadership roles.
          </p>
        </div>

        {/* Education Stack */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          {educationData.map((edu) => (
            <div
              key={edu.id}
              id={`education-card-${edu.id}`}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-7 transition-all hover:shadow-xl hover:shadow-black/50 relative overflow-hidden group"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  edu.accent === 'blue' 
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' 
                    : 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
                }`}>
                  {edu.accent === 'blue' ? <GraduationCap className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {edu.degree}
                    </h3>
                    {edu.grade && (
                      <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold rounded-full">
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm font-medium mb-2.5 ${
                    edu.accent === 'blue' ? 'text-indigo-400' : 'text-teal-400'
                  }`}>
                    {edu.institution}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {edu.period}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {edu.location}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300">
                      {edu.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* About description */}
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-5">
                {edu.about}
              </p>

              {/* Highlights & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-5 border-t border-slate-800/80">
                {edu.highlights.map((h, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <strong className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">
                      {h.title}
                    </strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {h.detail}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Positions of Responsibility & Achievements Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Positions of Responsibility */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  Positions of Responsibility
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Campus leadership &amp; community service
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {positionsOfResponsibility.map((pos) => (
                <div key={pos.id} className="border-l-2 border-indigo-500/40 pl-3.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      {pos.role}
                    </h4>
                    <span className="text-[11px] font-mono text-indigo-400">
                      {pos.period}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-teal-400 mb-1.5">
                    {pos.organization}
                  </p>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {pos.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold select-none">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  Key Achievements &amp; Extracurriculars
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Recognitions, open-source &amp; cultural impact
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {achievementsData.map((ach) => (
                <div 
                  key={ach.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    {ach.highlight && (
                      <strong className="text-amber-300 font-mono text-[10px] block uppercase tracking-wider mb-0.5">
                        {ach.highlight}
                      </strong>
                    )}
                    <span>{ach.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
