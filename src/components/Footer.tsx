import React from 'react';
import { personalInfo } from '../data/portfolioData';
import { Github, Linkedin, Mail, ArrowUp, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand & Bio */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a
              href="#home"
              className="font-mono text-sm font-bold text-white tracking-tight hover:opacity-80 transition-opacity"
            >
              avnish<span className="text-indigo-400">.dev</span>
            </a>
            <p className="text-xs text-slate-500 mt-1">
              B.Tech CSE · I.K. Gujral Punjab Technical University (IKGPTU) · Punjab, India 🇮🇳
            </p>
          </div>

          {/* Center: Social Links & Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#projects" className="hover:text-white transition-colors">Projects</a>
              <a href="#skills" className="hover:text-white transition-colors">Skills</a>
              <a href="#blog" className="hover:text-white transition-colors">Blog</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all hover:-translate-y-0.5"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-indigo-400 transition-all hover:-translate-y-0.5"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                aria-label="Direct Email"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-teal-400 transition-all hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right: Scroll to Top */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-500">
              © {new Date().getFullYear()} Avnish Singh
            </span>

            <button
              onClick={scrollToTop}
              id="back-to-top-btn"
              aria-label="Back to top"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
