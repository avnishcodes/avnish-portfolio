import React, { useState } from 'react';
import { 
  Share2, 
  Linkedin, 
  Twitter, 
  Copy, 
  Check, 
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { BlogPost } from '../types';

interface SocialShareBarProps {
  post: BlogPost;
  variant?: 'inline' | 'floating' | 'card';
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({ post, variant = 'inline' }) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://avnishcodes.github.io/blog/${post.slug}`;
  };

  const shareTitle = `${post.title} | By Avnish Singh`;
  const shareSummary = post.excerpt;

  const handleCopy = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTwitterShare = () => {
    const url = getShareUrl();
    const text = `Just read "${post.title}" by @avnishcodes — highly recommend for anyone interested in ${post.categoryLabel}!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(post.tags.slice(0, 3).join(','))}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleLinkedInShare = () => {
    const url = getShareUrl();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleRedditShare = () => {
    const url = getShareUrl();
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareTitle)}`;
    window.open(redditUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const text = `Check out this technical article: "${post.title}" by Avnish Singh: ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: getShareUrl(),
        });
      } catch (err) {
        // Fallback to copy if user dismissed
        console.log('Share dismissed or failed', err);
      }
    } else {
      handleCopy();
    }
  };

  if (variant === 'card') {
    return (
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl my-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
              <Share2 className="w-4 h-4" />
              <span>Share Knowledge</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Found this article insightful?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Share it with your network on Twitter (X), LinkedIn, or copy the link directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Twitter / X Share Button */}
            <button
              onClick={handleTwitterShare}
              id="share-twitter-btn"
              title="Share on Twitter / X"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f1419] hover:bg-black border border-slate-700 hover:border-slate-500 text-white text-xs font-semibold transition-all shadow-sm hover:shadow-indigo-900/20 hover:-translate-y-0.5"
            >
              <Twitter className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Post to X</span>
            </button>

            {/* LinkedIn Share Button */}
            <button
              onClick={handleLinkedInShare}
              id="share-linkedin-btn"
              title="Share on LinkedIn"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077b5]/90 hover:bg-[#0077b5] border border-blue-400/30 text-white text-xs font-semibold transition-all shadow-sm hover:shadow-blue-900/30 hover:-translate-y-0.5"
            >
              <Linkedin className="w-4 h-4" />
              <span>Share on LinkedIn</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopy}
              id="share-copy-link-btn"
              title="Copy article link"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-mono transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <aside 
        aria-label="Social media sharing sidebar"
        className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-2.5 z-40 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl animate-fade-in"
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 py-1 border-b border-slate-800 w-full text-center">
          Share
        </span>

        {/* Twitter / X */}
        <button
          onClick={handleTwitterShare}
          id="floating-share-twitter-btn"
          title="Share to Twitter / X"
          className="p-2.5 rounded-xl bg-slate-950 hover:bg-[#0f1419] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition-all hover:scale-110 group relative"
        >
          <Twitter className="w-4 h-4" />
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          id="floating-share-linkedin-btn"
          title="Share to LinkedIn"
          className="p-2.5 rounded-xl bg-slate-950 hover:bg-[#0077b5]/20 border border-slate-800 hover:border-[#0077b5]/50 text-slate-300 hover:text-[#0077b5] transition-all hover:scale-110 group relative"
        >
          <Linkedin className="w-4 h-4" />
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          id="floating-share-copy-btn"
          title="Copy Link"
          className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all hover:scale-110"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
        </button>
      </aside>
    );
  }

  // Default / inline variant for headers or action rows
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5 text-indigo-400" />
        Share:
      </span>

      {/* Twitter / X */}
      <button
        onClick={handleTwitterShare}
        id="top-share-twitter-btn"
        title="Share to Twitter / X"
        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
      >
        <Twitter className="w-4 h-4 text-cyan-400" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={handleLinkedInShare}
        id="top-share-linkedin-btn"
        title="Share to LinkedIn"
        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-[#0077b5] transition-all hover:scale-105"
      >
        <Linkedin className="w-4 h-4" />
      </button>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        id="top-share-copy-btn"
        title="Copy article link"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};
