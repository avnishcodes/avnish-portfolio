import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { CoursesSection } from './components/CoursesSection';
import { HobbiesSection } from './components/HobbiesSection';
import { BlogSection } from './components/BlogSection';
import { BlogArticleView } from './components/BlogArticleView';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { GeminiAiModal } from './components/GeminiAiModal';
import { AiFloatingWidget } from './components/AiFloatingWidget';
import { BlogPost } from './types';

export default function App() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<'chat' | 'voice'>('chat');
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  const handleOpenAi = (tab: 'chat' | 'voice' = 'chat') => {
    setAiModalTab(tab);
    setIsAiModalOpen(true);
  };

  const handleNavigateHome = (sectionId?: string) => {
    setSelectedBlogPost(null);
    if (sectionId) {
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden transition-colors duration-300">
        {/* Dynamic Animated Particle Canvas Network */}
        <ParticleBackground />

        {/* Navigation Header */}
        <Navbar 
          onOpenResume={() => setIsResumeModalOpen(true)}
          onOpenAiModal={(tab) => handleOpenAi(tab || 'chat')}
          onNavigateHome={handleNavigateHome}
          isArticleView={!!selectedBlogPost}
        />

        {/* Main Content: Dedicated Article Page View OR Full Portfolio Homepage */}
        <main className="relative z-10">
          {selectedBlogPost ? (
            <BlogArticleView 
              post={selectedBlogPost}
              onBack={() => {
                setSelectedBlogPost(null);
                setTimeout(() => {
                  const el = document.getElementById('blog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onSelectPost={(post) => setSelectedBlogPost(post)}
            />
          ) : (
            <>
              <Hero onOpenResume={() => setIsResumeModalOpen(true)} />
              <AboutSection />
              <ProjectsSection />
              <SkillsSection />
              <ExperienceSection />
              <EducationSection />
              <CoursesSection />
              <HobbiesSection />
              <BlogSection onSelectPost={(post) => setSelectedBlogPost(post)} />
              <ContactSection />
            </>
          )}
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating AI Interaction Widget */}
        <AiFloatingWidget
          onOpenChat={() => handleOpenAi('chat')}
          onOpenVoice={() => handleOpenAi('voice')}
        />

        {/* Gemini Multi-turn Chat & Live Voice AI Modal */}
        <GeminiAiModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          initialTab={aiModalTab}
        />

        {/* Interactive Resume Preview & Print Modal */}
        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}

