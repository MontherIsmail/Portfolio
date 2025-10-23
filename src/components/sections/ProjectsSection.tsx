'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Github, Calendar } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  link?: string | null;
  githubUrl?: string | null;
  technologies: string;
  featured: boolean;
};

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects?limit=6', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setProjects(json?.data ?? []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Featured Projects
            </h2>
            <div className="h-1 w-24 bg-primary-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mt-6">
            Here are some of my recent projects that showcase my skills and
            experience
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-background-secondary rounded-2xl p-8 max-w-md mx-auto border border-border-primary">
              <p className="text-lg text-text-secondary">No projects yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(p => (
              <article
                key={p.id}
                className="group bg-background-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border-primary hover:border-primary-400 hover:-translate-y-2"
              >
                <div className="aspect-video bg-background-primary flex items-center justify-center overflow-hidden relative">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-primary-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-text-secondary mb-4 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.technologies.split(',').slice(0, 5).map(t => (
                      <span
                        key={t.trim()}
                        className="px-3 py-1.5 bg-background-primary text-text-secondary text-sm rounded-full font-medium border border-border-primary"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        className="flex-1 bg-primary-400 text-white text-center py-3 px-4 rounded-xl hover:bg-primary-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-400/25 font-medium"
                      >
                        Live Demo
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        className="flex-1 bg-background-primary text-text-primary text-center py-3 px-4 rounded-xl border border-border-primary hover:border-primary-400 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
