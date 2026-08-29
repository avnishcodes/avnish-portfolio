import React, { useState } from 'react';
import { projectsData } from '../data/portfolioData';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { TiltCard } from './TiltCard';
import { 
  Github, 
  ExternalLink, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2,
  Layers,
  FolderGit2
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects', count: projectsData.length },
    { id: 'ml', label: 'ML & GenAI', count: projectsData.filter(p => p.category === 'ml').length },
    { id: 'web', label: 'Web Systems', count: projectsData.filter(p => p.category === 'web').length },
    { id: 'python', label: 'Python & Desktop', count: projectsData.filter(p => p.category === 'python').length },
  ];

  const filteredProjects = projectsData.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2.5">
              <span className="w-4 h-px bg-indigo-500" />
              <span>02 · Projects Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Featured <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic font-normal">Works</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
              Practical applications ranging from supervised machine learning pipelines and desktop text editors to algorithmic graph visualizers and SQL extractors.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="projects-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or tech..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`projects-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm border border-indigo-500'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === cat.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-400">No projects found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-mono text-indigo-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <TiltCard key={project.id} maxTilt={7} scale={1.02} className="h-full">
                <div
                  id={`project-card-${project.id}`}
                  className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 group relative overflow-hidden h-full"
                >
                  {/* Subtle top color accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: project.accentColor }}
                  />

                  <div>
                    {/* Category Pill & Star */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border"
                        style={{
                          backgroundColor: `${project.accentColor}12`,
                          borderColor: `${project.accentColor}30`,
                          color: project.accentColor,
                        }}
                      >
                        {project.categoryLabel}
                      </span>

                      {project.featured && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1">
                      {project.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mb-2.5">
                      {project.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-3.5 line-clamp-3 font-normal">
                      {project.description}
                    </p>

                    {/* Metrics preview if available */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        {project.metrics.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="text-center">
                            <span className="block text-xs font-bold text-white font-mono">
                              {m.value}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-[11px] font-mono text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveProjectModal(project)}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white transition-colors border border-indigo-500/30"
                          title="Open Live Preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {activeProjectModal && (
        <ProjectModal
          project={activeProjectModal}
          onClose={() => setActiveProjectModal(null)}
        />
      )}
    </section>
  );
};
