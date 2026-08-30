export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'ml' | 'python' | 'web' | 'data';
  categoryLabel: string;
  description: string;
  detailedOverview: string;
  highlights: string[];
  technologies: string[];
  metrics?: { label: string; value: string }[];
  githubUrl: string;
  liveDemoUrl?: string;
  featured?: boolean;
  accentColor: string; // e.g. '#3b82f6'
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  accent: string;
  skills: {
    name: string;
    level: number; // 0 to 100
    experience: string;
    highlight?: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  type: string;
  period: string;
  dateRange: string;
  accent: 'blue' | 'teal' | 'amber' | 'purple';
  description: string;
  bullets: string[];
  technologies: string[];
  keyOutcome: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade?: string;
  status: string;
  accent: 'blue' | 'teal' | 'amber';
  about: string;
  highlights: { title: string; detail: string }[];
  badges: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
  icon: string;
  skills: string[];
  description: string;
  category?: 'certification' | 'course' | 'specialization';
  platform?: string;
  instructor?: string;
  status?: 'Verified' | 'Completed' | 'In Progress' | 'Active';
  progress?: number;
  rating?: number;
  accent?: 'blue' | 'teal' | 'amber' | 'purple' | 'cyan' | 'indigo';
}

export interface HobbyItem {
  id: string;
  name: string;
  emoji: string;
  tag: string;
  color: 'blue' | 'teal' | 'amber' | 'purple' | 'rose';
  description: string;
  detail: string;
}

export interface PersonalInfo {
  name: string;
  role: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  linkedinUsername: string;
  degree: string;
  university: string;
  batch: string;
  status: string;
  shortBio: string;
  fullBio: string[];
}

export interface PositionOfResponsibility {
  id: string;
  role: string;
  organization: string;
  period: string;
  bullets: string[];
}

export interface AchievementItem {
  id: string;
  description: string;
  highlight?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  date: string;
  readTime: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  keyTakeaways: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  relationship: string;
  quote: string;
  initials: string;
  rating: number;
  highlightTag: string;
  accentColor?: string;
  verified?: boolean;
}
