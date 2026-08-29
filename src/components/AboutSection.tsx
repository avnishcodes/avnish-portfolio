import React, { useState } from 'react';
import { personalInfo } from '../data/portfolioData';
import { Target, Shield, Globe, Award, Sparkles, Terminal, Code2, Brain } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'values' | 'approach'>('overview');

  const keyPills = [
    'Python', 'SQL', 'Machine Learning', 'Data Structures', 'Algorithms',
    'Scikit-learn', 'Data Preprocessing', 'Feature Engineering',
    'Model Evaluation', 'Pandas & NumPy', 'Open Source', 'NCC Cadet'
  ];

  return (
    <section id="about" className="py-24 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2.5">
            <span className="w-4 h-px bg-indigo-500" />
            <span>01 · Biography</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Who I <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic font-normal">Am</span>
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Bio Narrative & Interactive Tabs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('values')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'values'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Values &amp; NCC
              </button>
              <button
                onClick={() => setActiveTab('approach')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'approach'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Engineering Mindset
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-3.5 text-slate-300 text-xs sm:text-[13px] leading-relaxed">
              {activeTab === 'overview' && (
                <>
                  <p>
                    I am a dedicated Computer Science and Engineering student at <strong className="text-white font-semibold">I.K. Gujral Punjab Technical University (IKGPTU)</strong>, with a deep interest in Artificial Intelligence, Machine Learning, and software system development.
                  </p>
                  <p>
                    With hands-on experience in <span className="text-indigo-300 font-mono text-xs px-1.5 py-0.5 bg-indigo-950/60 rounded border border-indigo-800/40">Python</span> and <span className="text-indigo-300 font-mono text-xs px-1.5 py-0.5 bg-indigo-950/60 rounded border border-indigo-800/40">SQL</span>, I continuously expand my knowledge in data structures, algorithms, and modern ML frameworks. I enjoy turning raw data into actionable models and crafting responsive, maintainable code.
                  </p>
                  <p>
                    My educational foundation includes completing a Diploma in CSE with <strong className="text-teal-400">Grade A</strong> at Government Polytechnic College, Ferozepur, followed by internships at EME Technologies where I trained supervised ML algorithms and engineered custom desktop utilities.
                  </p>
                </>
              )}

              {activeTab === 'values' && (
                <>
                  <p>
                    As an active <strong className="text-emerald-400">NCC Cadet</strong>, I uphold strict discipline, accountability, and team cohesion. The rigorous drills and leadership camps have instilled in me the resilience to stay calm under intense pressure and solve problems systematically.
                  </p>
                  <p>
                    Beyond academics, I choreographed and presented an awareness dance performance on the theme of eradicating child labor at the PTIS state event. I believe technology and human empathy must go hand-in-hand to build positive community impact.
                  </p>
                </>
              )}

              {activeTab === 'approach' && (
                <>
                  <p>
                    When approaching software and ML problems, I prioritize clean architecture, statistical validity, and computational efficiency. Whether cleaning messy datasets with Pandas, tuning Random Forest classifiers, or optimizing relational SQL schemas, I focus on repeatability and clear documentation.
                  </p>
                  <p>
                    I am a passionate believer in continuous learning through open-source contributions, technical workshops, and building real-world practical projects that solve genuine pain points.
                  </p>
                </>
              )}
            </div>

            {/* Skills & Competencies Cloud */}
            <div className="mt-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Core Skills &amp; Competencies
                </span>
                <a href="#skills" className="text-xs font-mono text-indigo-400 hover:underline">
                  View Full Skills Matrix →
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {keyPills.map((pill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs font-mono text-slate-300 hover:text-indigo-300 rounded-lg transition-colors cursor-default"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Focus Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            
            {/* Card 1: Machine Learning */}
            <TiltCard maxTilt={8} scale={1.02}>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      🎯 Machine Learning &amp; AI Focus
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Building predictive pipelines using Scikit-learn, supervised algorithms, robust feature transformations, and thorough model evaluation metrics.
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Card 2: NCC Cadet & Leadership */}
            <TiltCard maxTilt={8} scale={1.02}>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-teal-500/40 transition-all">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      🪖 NCC Cadet &amp; Leadership
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Developing leadership, tactical discipline, operational teamwork, and national service values alongside rigorous computer science academics.
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Card 3: Open Source & Community */}
            <TiltCard maxTilt={8} scale={1.02}>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      🌐 Open Source &amp; Collaboration
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Contributing to developer tools, engaging with tech webinars, sharing code repositories, and building collaborative peer study communities.
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Quick stats banner */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">Diploma with Grade A</span>
              </div>
              <span className="text-indigo-400 font-semibold">2021–2024</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

