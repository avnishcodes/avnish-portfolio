import React, { useEffect } from 'react';
import { Project } from '../types';
import { 
  X, 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Code, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!project) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      id="project-detail-modal"
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[94vh] sm:max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div
          className="h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 shrink-0"
        />

        {/* Sticky Top Header Navigation Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/95 border-b border-slate-800/90 shrink-0 select-none z-10 backdrop-blur-md">
          {/* Back Navigation Button */}
          <button
            onClick={onClose}
            id="back-to-projects-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono font-medium transition-all active:scale-95"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Back to Projects</span>
          </button>

          {/* Center Category Indicator (Hidden on very small screens) */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border bg-indigo-500/10 border-indigo-500/20 text-indigo-300">
              {project.categoryLabel}
            </span>
            {project.featured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          {/* Close X Button */}
          <button
            onClick={onClose}
            id="close-project-modal-btn"
            aria-label="Close modal"
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto touch-scroll-y p-5 sm:p-8 space-y-6 text-slate-300 overscroll-contain">
          
          {/* Title & Tagline Header */}
          <div>
            <div className="flex sm:hidden items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border bg-indigo-500/10 border-indigo-500/20 text-indigo-300">
                {project.categoryLabel}
              </span>
              {project.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Featured
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-indigo-400 mt-1">
              // {project.tagline}
            </p>
          </div>

          {/* Metrics Grid */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="text-center p-1.5">
                  <span className="block text-base sm:text-lg font-bold text-white font-mono">
                    {metric.value}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Project Overview */}
          <div className="space-y-2.5 p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider font-mono text-indigo-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Project Architecture &amp; Overview</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {project.detailedOverview || project.description}
            </p>
          </div>

          {/* Key Engineering Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider font-mono text-teal-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Key Technical Implementations</span>
              </h3>
              <ul className="space-y-2.5">
                {project.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Chips */}
          <div className="pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Technologies &amp; Libraries Used</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-900/95 border-t border-slate-800/90 shrink-0 z-10 backdrop-blur-md">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            Close Modal
          </button>

          <div className="flex items-center gap-2.5">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-md shadow-indigo-600/30"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
