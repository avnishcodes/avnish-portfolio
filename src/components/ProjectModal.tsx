import React from 'react';
import { Project } from '../types';
import { X, Github, ExternalLink, CheckCircle2, Layers, Cpu, BarChart3, Code } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      id="project-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-project-modal-btn"
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="mb-6 pr-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
            >
              {project.categoryLabel}
            </span>
            {project.featured && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                ★ Featured Project
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {project.title}
          </h2>
          <p className="text-sm font-mono text-slate-400 mt-1">
            {project.tagline}
          </p>
        </div>

        {/* Metrics Grid */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <span className="block text-lg sm:text-xl font-bold text-white">
                  {metric.value}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Overview */}
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-indigo-400 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Project Architecture &amp; Overview
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {project.detailedOverview}
          </p>
        </div>

        {/* Key Engineering Highlights */}
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-teal-400 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Key Technical Implementations
          </h3>
          <ul className="space-y-2">
            {project.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Chips */}
        <div className="mb-8 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            Technologies &amp; Libraries Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs transition-all"
          >
            <Github className="w-4 h-4" />
            <span>View Source Code</span>
          </a>

          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Explore Repository</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
