import React from 'react';
import { educationData, positionsOfResponsibility, achievementsData } from '../data/portfolioData';
import { GraduationCap, Calendar, MapPin, Sparkles, Shield, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const EducationSection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section id="education" className={`py-24 relative z-10 border-t ${
      isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2.5">
            <span className="w-4 h-px bg-indigo-500" />
            <span>05 · Academics &amp; Leadership</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Academic <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent italic font-normal">Background</span>
          </h2>
          <p className={`text-xs sm:text-sm mt-1.5 max-w-xl ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Formal engineering degree studies and technical diploma education with consistent academic record, campus responsibilities, and leadership roles.
          </p>
        </div>

        {/* Education Stack */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          {educationData.map((edu) => (
            <div
              key={edu.id}
              id={`education-card-${edu.id}`}
              className={`rounded-2xl p-5 sm:p-7 transition-all duration-300 relative overflow-hidden group border ${
                isLight
                  ? 'bg-slate-50/70 border-slate-200 shadow-md hover:border-indigo-400 hover:shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/50'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  isLight
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm'
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className={`text-base sm:text-lg font-bold transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-indigo-600' : 'text-white group-hover:text-indigo-300'
                    }`}>
                      {edu.degree}
                    </h3>
                    {edu.grade && (
                      <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border ${
                        isLight
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}>
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm font-semibold mb-2.5 ${
                    isLight ? 'text-indigo-600' : 'text-indigo-400'
                  }`}>
                    {edu.institution}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono border ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-600'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400'
                    }`}>
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {edu.period}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono border ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-600'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400'
                    }`}>
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {edu.location}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-mono border ${
                      isLight
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 font-medium'
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                    }`}>
                      {edu.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* About description */}
              <p className={`text-xs sm:text-[13px] leading-relaxed mb-5 ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {edu.about}
              </p>

              {/* Highlights & Notes */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-5 border-t ${
                isLight ? 'border-slate-200' : 'border-slate-800/80'
              }`}>
                {edu.highlights.map((h, hIdx) => (
                  <div
                    key={hIdx}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                      isLight
                        ? 'bg-white border-slate-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <strong className={`text-[11px] font-mono uppercase tracking-wider block mb-1 font-semibold ${
                      isLight ? 'text-indigo-600' : 'text-indigo-400'
                    }`}>
                      {h.title}
                    </strong>
                    <p className={`text-xs leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-slate-400'
                    }`}>
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
          <div className={`rounded-2xl p-5 sm:p-7 border ${
            isLight
              ? 'bg-slate-50/70 border-slate-200 shadow-md'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                isLight
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              }`}>
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm sm:text-base font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Positions of Responsibility
                </h3>
                <p className={`text-[11px] font-mono ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Campus leadership &amp; community service
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {positionsOfResponsibility.map((pos) => (
                <div key={pos.id} className="border-l-2 border-indigo-500/40 pl-3.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
                    <h4 className={`text-xs sm:text-sm font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {pos.role}
                    </h4>
                    <span className="text-[11px] font-mono text-indigo-500 dark:text-indigo-400 font-semibold">
                      {pos.period}
                    </span>
                  </div>
                  <p className={`text-xs font-semibold mb-1.5 ${
                    isLight ? 'text-teal-600' : 'text-teal-400'
                  }`}>
                    {pos.organization}
                  </p>
                  <ul className={`space-y-1 text-xs ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {pos.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 dark:text-indigo-400 font-bold select-none">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className={`rounded-2xl p-5 sm:p-7 border ${
            isLight
              ? 'bg-slate-50/70 border-slate-200 shadow-md'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                isLight
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm sm:text-base font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Key Achievements &amp; Extracurriculars
                </h3>
                <p className={`text-[11px] font-mono ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Recognitions, open-source &amp; cultural impact
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {achievementsData.map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    {ach.highlight && (
                      <strong className={`font-mono text-[10px] block uppercase tracking-wider mb-0.5 font-bold ${
                        isLight ? 'text-amber-700' : 'text-amber-300'
                      }`}>
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
