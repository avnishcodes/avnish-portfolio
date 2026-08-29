import React, { useState } from 'react';
import { hobbiesData } from '../data/portfolioData';
import { Sparkles, Heart, Activity, Camera, Music, Trophy } from 'lucide-react';

export const HobbiesSection: React.FC = () => {
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);

  const getHobbyGlow = (color: string) => {
    switch (color) {
      case 'blue':
        return 'hover:border-blue-500/50 hover:shadow-blue-500/15';
      case 'teal':
        return 'hover:border-teal-500/50 hover:shadow-teal-500/15';
      case 'amber':
        return 'hover:border-amber-500/50 hover:shadow-amber-500/15';
      case 'purple':
        return 'hover:border-purple-500/50 hover:shadow-purple-500/15';
      case 'rose':
      default:
        return 'hover:border-rose-500/50 hover:shadow-rose-500/15';
    }
  };

  return (
    <section id="hobbies" className="py-24 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2.5">
            <span className="w-4 h-px bg-indigo-500" />
            <span>07 · Beyond Code</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Hobbies &amp; <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic font-normal">Interests</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
            Activities that rejuvenate my creativity, foster strategic discipline, and maintain physical and mental vitality outside of programming.
          </p>
        </div>

        {/* Hobbies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {hobbiesData.map((hobby) => (
            <div
              key={hobby.id}
              id={`hobby-card-${hobby.id}`}
              onClick={() => setSelectedHobby(selectedHobby === hobby.id ? null : hobby.id)}
              className={`bg-slate-900/80 border border-slate-800 rounded-2xl p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl ${getHobbyGlow(
                hobby.color
              )} ${selectedHobby === hobby.id ? 'ring-2 ring-indigo-500 bg-slate-900' : ''}`}
            >
              <div>
                <span className="text-3xl block mb-3 transform group-hover:scale-110 transition-transform">
                  {hobby.emoji}
                </span>

                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-0.5">
                  {hobby.tag}
                </span>

                <h3 className="text-sm font-semibold text-white mb-1.5">
                  {hobby.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {hobby.description}
                </p>
              </div>

              {selectedHobby === hobby.id && (
                <div className="mt-3.5 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 font-mono animate-fade-in">
                  💡 {hobby.detail}
                </div>
              )}

              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 text-right">
                {selectedHobby === hobby.id ? 'Tap to collapse' : 'Tap to expand'}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
