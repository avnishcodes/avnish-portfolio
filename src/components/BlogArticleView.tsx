import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  Share2, 
  Check, 
  Copy, 
  BookOpen, 
  Sparkles, 
  User, 
  ExternalLink,
  ChevronRight,
  Bookmark,
  Twitter,
  Linkedin,
  Code2,
  Terminal
} from 'lucide-react';
import { BlogPost } from '../types';
import { blogPostsData } from '../data/blogData';
import { SocialShareBar } from './SocialShareBar';

interface BlogArticleViewProps {
  post: BlogPost;
  onBack: () => void;
  onSelectPost: (post: BlogPost) => void;
}

interface CodeSnippetBlockProps {
  code: string;
  language: string;
  index: number;
}

const CodeSnippetBlock: React.FC<CodeSnippetBlockProps> = ({ code, language, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all hover:border-slate-700">
      {/* Code Block Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 select-none">
        <div className="flex items-center gap-3">
          {/* Terminal Window Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Language & Line Count Badge */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-300 font-semibold uppercase flex items-center gap-1">
              <Terminal className="w-3 h-3 text-indigo-400" />
              {language}
            </span>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              {lines.length} {lines.length === 1 ? 'line' : 'lines'}
            </span>
          </div>
        </div>

        {/* Copy to Clipboard Button */}
        <button
          onClick={handleCopy}
          id={`copy-code-btn-${index}`}
          aria-label={copied ? 'Code snippet copied to clipboard' : 'Copy code snippet to clipboard'}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer shadow-sm ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scale-in" />
              <span className="text-emerald-300 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="relative flex overflow-x-auto p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-200 selection:bg-indigo-500/30">
        {/* Line Numbers Column */}
        <div className="select-none pr-4 text-right text-slate-600 font-mono text-xs hidden sm:block border-r border-slate-800/80 mr-4">
          {lines.map((_, lineIdx) => (
            <div key={lineIdx} className="leading-relaxed">
              {lineIdx + 1}
            </div>
          ))}
        </div>

        {/* Code Content */}
        <pre className="flex-1 overflow-x-auto focus:outline-none">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const BlogArticleView: React.FC<BlogArticleViewProps> = ({ 
  post, 
  onBack,
  onSelectPost
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const updateScrollProgress = () => {
      const currentProgress = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100));
        setReadingProgress(progress);
      } else {
        setReadingProgress(0);
      }
    };

    // Calculate initial progress on mount
    updateScrollProgress();

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const relatedPosts = blogPostsData.filter(p => p.id !== post.id).slice(0, 2);

  // Helper to render markdown-like content blocks nicely
  const renderFormattedContent = (rawContent: string) => {
    const sections = rawContent.split('\n\n');

    return sections.map((sec, idx) => {
      const trimmed = sec.trim();
      if (!trimmed) return null;

      // H3 Heading
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-8 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // H4 Heading
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-lg font-bold text-slate-100 mt-6 mb-2">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }

      // Horizontal Rule
      if (trimmed === '---') {
        return <hr key={idx} className="my-8 border-slate-800" />;
      }

      // Code Block
      if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
        const lines = trimmed.split('\n');
        const language = lines[0].replace('```', '').trim() || 'code';
        const code = lines.slice(1, -1).join('\n');

        return (
          <CodeSnippetBlock 
            key={idx} 
            code={code} 
            language={language} 
            index={idx} 
          />
        );
      }

      // Numbered List or Bullet List
      if (trimmed.startsWith('1. ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="my-4 space-y-2.5 pl-2">
            {items.map((it, itIdx) => {
              const cleanText = it.replace(/^(\d+\.\s|-\s)/, '');
              return (
                <li key={itIdx} className="flex items-start gap-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2.5" />
                  <span>
                    {cleanText.includes('**') ? (
                      cleanText.split('**').map((part, pIdx) => 
                        pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{part}</strong> : part
                      )
                    ) : (
                      cleanText
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Standard Paragraph
      return (
        <p key={idx} className="text-slate-300 text-sm sm:text-base leading-relaxed my-4">
          {trimmed.includes('`') ? (
            trimmed.split('`').map((part, pIdx) => 
              pIdx % 2 === 1 ? (
                <code key={pIdx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300 font-mono text-xs sm:text-sm">
                  {part}
                </code>
              ) : (
                part
              )
            )
          ) : (
            trimmed
          )}
        </p>
      );
    });
  };

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 relative z-20">
      {/* Subtle Horizontal Scroll Progress Bar at the very top of the screen */}
      <div 
        id="article-scroll-progress-container"
        className="fixed top-0 left-0 right-0 h-1 bg-slate-950/40 z-[60] pointer-events-none"
      >
        <div 
          id="article-scroll-progress-bar"
          role="progressbar"
          aria-label="Article reading progress"
          aria-valuenow={Math.round(readingProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.7)] transition-[width] duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Desktop Floating Social Share Sidebar */}
      <SocialShareBar post={post} variant="floating" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-4">
          <button
            onClick={onBack}
            id="blog-article-back-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </button>

          {/* Top Social Media Sharing Component */}
          <SocialShareBar post={post} variant="inline" />
        </div>

        {/* Article Header Card */}
        <header className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            {/* Category & Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {post.categoryLabel}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-950/60 border border-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-500" />
                {post.date}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-950/60 border border-slate-800 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed mb-6">
                {post.subtitle}
              </p>
            )}

            {/* Author Credit Bar */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/25 shrink-0">
                AS
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  {post.author.name}
                </span>
                <span className="text-xs text-indigo-300 font-mono">
                  {post.author.role} · Computer Science &amp; Engineering
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Key Takeaways Callout Card */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="mb-10 p-6 sm:p-7 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2.5 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Core Takeaways &amp; Executive Summary</span>
            </div>
            <div className="space-y-3">
              {post.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-3 text-slate-200 text-xs sm:text-sm leading-relaxed">
                  <span className="w-5 h-5 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-10 mb-12 shadow-xl">
          {renderFormattedContent(post.content)}
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5" />
            Tags:
          </span>
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Social Media Sharing Interactive Component */}
        <SocialShareBar post={post} variant="card" />

        {/* Author Bio Footer Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25 shrink-0">
            AS
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white mb-1">
              Written by Avnish Singh
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
              B.Tech Computer Science student at IKGPTU, Punjab. Passionate about Machine Learning workflows, Python optimization, and reliable software engineering.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono text-indigo-400">
              <a href="https://github.com/avnishcodes" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                GitHub ↗
              </a>
              <span>•</span>
              <a href="https://www.linkedin.com/in/avnishcodes" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                LinkedIn ↗
              </a>
              <span>•</span>
              <a href="mailto:Savnish174@gmail.com" className="hover:underline flex items-center gap-1">
                Savnish174@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Next / Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>More Articles &amp; Insights</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((rPost) => (
                <div
                  key={rPost.id}
                  onClick={() => onSelectPost(rPost)}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-mono text-indigo-400 block mb-1">
                      {rPost.categoryLabel} · {rPost.readTime}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                      {rPost.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {rPost.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-indigo-400">
                    <span>Read Article</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
