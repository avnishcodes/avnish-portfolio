import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search, 
  Tag, 
  Sparkles, 
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { BlogPost } from '../types';
import { blogPostsData } from '../data/blogData';

interface BlogSectionProps {
  onSelectPost: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onSelectPost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'machine-learning', label: 'Machine Learning' },
    { id: 'software-engineering', label: 'Software Eng' },
    { id: 'data-engineering', label: 'Data & SQL' },
    { id: 'career-growth', label: 'Growth & Discipline' }
  ];

  const filteredPosts = blogPostsData.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2.5">
              <span className="w-4 h-px bg-indigo-500" />
              <span>08 · Technical Writing &amp; Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Blog &amp; <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic font-normal">Engineering Notes</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
              Deep dives, architectural reflections, and practical engineering guides covering Machine Learning pipelines, Python systems, and data modeling.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 pb-1">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? blogPostsData.length 
              : blogPostsData.filter(p => p.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                id={`blog-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                id={`blog-card-${post.id}`}
                onClick={() => onSelectPost(post)}
                className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-950/20 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

                <div>
                  {/* Top Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.categoryLabel}
                    </span>

                    <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4 font-normal">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-slate-950 border border-slate-800/80 rounded text-[10px] font-mono text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer with Read Link */}
                <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 text-[11px]">
                    By {post.author.name}
                  </span>

                  <span className="inline-flex items-center gap-1 text-indigo-400 font-semibold group-hover:text-indigo-300 group-hover:translate-x-1 transition-all text-xs">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              No matching articles found
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              We couldn't find any articles matching "{searchQuery}". Try selecting another category or clearing your query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
