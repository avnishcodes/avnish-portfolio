import React, { useState } from 'react';
import { 
  ArrowRight, 
  Download, 
  Mail, 
  Github, 
  Linkedin, 
  MapPin, 
  GraduationCap, 
  Sparkles,
  ChevronDown,
  Box,
  Terminal,
  Play,
  Copy,
  Check,
  Zap,
  Activity
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { ThreeHeroScene } from './ThreeHeroScene';
import { TiltCard } from './TiltCard';
import confetti from 'canvas-confetti';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const [rightView, setRightView] = useState<'3d' | 'card'>('3d');
  const [copiedCmd, setCopiedCmd] = useState(false);

  const chips = [
    { label: 'Python (Advanced)', icon: '🐍', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-300' },
    { label: 'Machine Learning & AI', icon: '🤖', bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
    { label: 'SQL & Pandas', icon: '🗄️', bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' },
    { label: 'Three.js / 3D Graphics', icon: '🧊', bg: 'bg-teal-500/10 border-teal-500/20 text-teal-300' },
    { label: 'REST APIs', icon: '⚡', bg: 'bg-sky-500/10 border-sky-500/20 text-sky-300' },
    { label: 'NCC Cadet', icon: '🪖', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' }
  ];

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('pip install avnish-singh-portfolio');
    setCopiedCmd(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#6366f1', '#06b6d4', '#10b981'],
    });
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleResumeClick = () => {
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#38bdf8'],
    });
    onOpenResume();
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background ambient radial glows & animated 3D grid line */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      
      {/* Subtle perspective grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bio & Hero Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Status & Location Pill */}
            <div 
              id="hero-eyebrow-badge"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono mb-5 shadow-sm shadow-indigo-500/10 hover:border-indigo-500/60 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              <span>B.Tech CSE · IKGPTU · Punjab, India</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3" /> Available for Hire
              </span>
            </div>

            {/* Main Headline with Animated Gradient */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-5">
              Hi, I'm <br />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                Avnish Singh
              </span>
            </h1>

            {/* Description Subtitle */}
            <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed max-w-2xl mb-6 font-normal">
              AI/ML focused Computer Science engineer building data-driven machine learning models, computational pipelines, and modern interactive web experiences. NCC Cadet &amp; Open-source builder.
            </p>

            {/* Interactive Terminal Quick Run Widget */}
            <div className="w-full max-w-lg mb-6 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 overflow-hidden">
                <span className="text-indigo-400 select-none font-bold">❯</span>
                <span className="text-slate-400 truncate">pip install avnish-singh-portfolio</span>
              </div>
              <button
                onClick={handleCopyInstall}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 shrink-0 text-[11px]"
                title="Copy command"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Technology / Interest Chips */}
            <div className="flex flex-wrap gap-1.5 mb-8">
              {chips.map((chip, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${chip.bg} transition-all hover:-translate-y-0.5 hover:shadow-sm cursor-default`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                id="hero-view-projects-btn"
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/30 hover:shadow-lg hover:shadow-indigo-600/40 hover:-translate-y-0.5 group"
              >
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                id="hero-resume-btn"
                onClick={handleResumeClick}
                className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 text-slate-200 hover:text-white font-medium text-xs sm:text-sm transition-all hover:-translate-y-0.5"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Resume</span>
              </button>

              <a
                id="hero-contact-btn"
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-transparent hover:bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Social Link Quick Row */}
            <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-2 mt-8 pt-6 border-t border-slate-800/80 w-full max-w-lg text-xs text-slate-400">
              <span className="font-mono text-slate-500 text-[11px] sm:text-xs">Connect:</span>
              <a
                id="hero-github-link"
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs"
              >
                <Github className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span>GitHub</span>
              </a>
              <a
                id="hero-linkedin-link"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-xs"
              >
                <Linkedin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>LinkedIn</span>
              </a>
              <a
                id="hero-email-link"
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all text-xs max-w-full"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{personalInfo.email}</span>
              </a>
            </div>

          </div>

          {/* Right Column: 3D WebGL Scene & Profile View Switcher (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-4 z-20 backdrop-blur-md">
              <button
                onClick={() => setRightView('3d')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                  rightView === '3d'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D AI Visualizer</span>
              </button>
              <button
                onClick={() => setRightView('card')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                  rightView === 'card'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Developer Card</span>
              </button>
            </div>

            {/* View Container */}
            {rightView === '3d' ? (
              <div className="w-full flex justify-center animate-fade-in">
                <ThreeHeroScene />
              </div>
            ) : (
              <TiltCard className="w-full max-w-md animate-fade-in" maxTilt={10}>
                <div
                  id="hero-profile-card"
                  className="relative w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-indigo-500/40 transition-all duration-300"
                >
                  {/* Card top gradient ambient */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-600/20 via-cyan-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                  {/* Avatar & Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-600 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/25">
                        AS
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-teal-400 border-2 border-slate-900 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-teal-300 animate-ping opacity-75" />
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-lg font-bold text-white tracking-tight">Avnish Singh</h2>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-xs font-mono text-indigo-400">// CSE Student · ML Enthusiast</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        Punjab, India
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-800/80 mb-6" />

                  {/* Information Grid */}
                  <div className="grid grid-cols-2 gap-3.5 mb-6">
                    <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">
                        Degree
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        B.Tech CSE
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">
                        University
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        IKGPTU
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">
                        Batch
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        2024 – 2027
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">
                        Primary Focus
                      </span>
                      <span className="text-xs font-semibold text-indigo-400">
                        ML / AI &amp; Python
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between p-3.5 bg-teal-950/40 border border-teal-500/25 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                      <span className="text-xs font-medium text-teal-300">
                        Open to Internships &amp; Projects
                      </span>
                    </div>
                    <GraduationCap className="w-4 h-4 text-teal-400 opacity-80" />
                  </div>

                  {/* Quick links footer */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Savnish174@gmail.com</span>
                    <span className="text-indigo-400 font-sans">Active Status</span>
                  </div>
                </div>
              </TiltCard>
            )}
          </div>

        </div>
      </div>

      {/* Scroll down indicator */}
      <a
        href="#about"
        aria-label="Scroll to About Section"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors text-xs font-mono"
      >
        <span>EXPLORE</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
