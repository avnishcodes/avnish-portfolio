import React, { useState } from 'react';
import { skillCategories } from '../data/portfolioData';
import { 
  Code, 
  BrainCircuit, 
  Database, 
  Cpu, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  Box
} from 'lucide-react';
import { ThreeSkillSphere } from './ThreeSkillSphere';
import { TiltCard } from './TiltCard';
import { useTheme } from '../context/ThemeContext';

export const SkillsSection: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showSphere, setShowSphere] = useState<boolean>(true);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-4 h-4" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-4 h-4" />;
      case 'Database':
        return <Database className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Cpu':
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const filteredCategories = activeCategory === 'all'
    ? skillCategories
    : skillCategories.filter(c => c.id === activeCategory);

  return (
    <section id="skills" className={`py-24 relative z-10 border-t ${
      isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/80 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2.5">
              <span className="w-4 h-px bg-indigo-500" />
              <span>03 · Technical Arsenal</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Skills &amp; <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent italic font-normal">Expertise</span>
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 max-w-xl ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Grounded in computer science fundamentals, with specialized focus on machine learning algorithms, Python pipelines, relational databases, and 3D web graphics.
            </p>
          </div>

          {/* Category Tabs & 3D Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSphere(!showSphere)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border shadow-sm ${
                showSphere
                  ? isLight 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 font-semibold' 
                    : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                  : isLight 
                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{showSphere ? 'Hide 3D Sphere' : 'Show 3D Sphere'}</span>
            </button>

            <div className={`flex flex-wrap gap-1.5 p-1.5 rounded-xl border ${
              isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All Domains
              </button>
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                  <span>{cat.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional 3D Interactive Skill Sphere Constellation */}
        {showSphere && (
          <div className="mb-10 animate-fade-in">
            <ThreeSkillSphere />
          </div>
        )}

        {/* Skills Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((category) => (
            <TiltCard key={category.id} maxTilt={6} scale={1.01}>
              <div
                id={`skill-category-${category.id}`}
                className={`rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between h-full transition-all duration-300 border ${
                  isLight
                    ? 'bg-white border-slate-200/90 shadow-md shadow-slate-200/50 hover:border-indigo-400 hover:shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/30'
                }`}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                      isLight
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                    }`}>
                      {getCategoryIcon(category.iconName)}
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {category.name}
                      </h3>
                      <p className={`text-xs ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className={`h-px mb-5 ${
                    isLight ? 'bg-slate-200' : 'bg-slate-800/80'
                  }`} />

                  {/* Skill List with Progress Bars */}
                  <div className="space-y-4">
                    {category.skills.map((skill, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className={`font-semibold transition-colors ${
                            isLight
                              ? 'text-slate-800 group-hover:text-indigo-600'
                              : 'text-slate-200 group-hover:text-indigo-300'
                          }`}>
                            {skill.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-mono ${
                              isLight ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              {skill.experience}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-indigo-500 dark:text-indigo-400">
                              {skill.level}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className={`h-2 w-full rounded-full overflow-hidden p-0.5 border ${
                          isLight
                            ? 'bg-slate-100 border-slate-200'
                            : 'bg-slate-950/80 border-slate-800/80'
                        }`}>
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 transition-all duration-700"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>

                        {/* Highlight Note */}
                        {skill.highlight && (
                          <p className={`text-[11px] mt-1 font-mono ${
                            isLight ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            ↳ {skill.highlight}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom tag */}
                <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] font-mono ${
                  isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
                }`}>
                  <span className={`flex items-center gap-1 font-medium ${
                    isLight ? 'text-emerald-600' : 'text-emerald-400'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified in Code Repositories
                  </span>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                    {category.skills.length} core competencies
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
};
