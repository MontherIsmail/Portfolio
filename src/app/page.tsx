import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { StructuredData } from '@/components/StructuredData';
import { ErrorBoundary } from '@/components/LoadingComponents';

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <StructuredData />
        <Navigation />
        <div id="main-content">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection />
        </div>
        <Footer />
      </main>
    </ErrorBoundary>
  );
}
