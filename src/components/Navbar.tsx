import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, FileText, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenResume: () => void;
  onNavigateHome?: (sectionId?: string) => void;
  isArticleView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onNavigateHome, isArticleView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sectionIds = ['home', 'about', 'projects', 'skills', 'experience', 'education', 'courses', 'hobbies', 'blog', 'contact'];
      const current = sectionIds.find((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 180 && rect.bottom >= 180;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Blog', href: '#blog', id: 'blog' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (isArticleView && onNavigateHome) {
      onNavigateHome(href.replace('#', ''));
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/40'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            id="nav-brand-logo"
            className="group flex items-center gap-2 font-mono text-base font-medium tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              AS
            </span>
            <span className="text-white font-semibold">
              avnish<span className="text-indigo-400">.dev</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-full border border-slate-800 backdrop-blur-md">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="inline-flex items-center justify-center w-9 h-9 text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all hover:border-indigo-500/50 hover:text-indigo-300 group shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            <button
              id="nav-resume-btn"
              onClick={onOpenResume}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all hover:border-slate-600 hover:text-white shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Resume
            </button>

            <a
              id="nav-hire-btn"
              href="mailto:Savnish174@gmail.com"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Hire Me</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Quick Theme Toggle for Mobile */}
            <button
              id="mobile-quick-theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              aria-label="Toggle Navigation Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-panel"
            className="lg:hidden mt-3 p-4 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-2xl animate-fade-in"
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-link-${item.id}`}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              {/* Theme Toggle option inside mobile drawer */}
              <button
                id="mobile-theme-toggle-option"
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between py-2.5 px-4 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  )}
                  <span>Theme: {theme === 'dark' ? 'Slate Dark' : 'High-Contrast Light'}</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </span>
              </button>

              <button
                id="mobile-resume-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                View &amp; Download Resume
              </button>

              <a
                id="mobile-contact-cta"
                href="mailto:Savnish174@gmail.com"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-xl text-xs font-semibold text-white shadow-lg shadow-indigo-500/25"
              >
                <Mail className="w-4 h-4" />
                Contact / Hire Me
              </a>

              <div className="flex items-center justify-center gap-4 pt-2 text-slate-400">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
