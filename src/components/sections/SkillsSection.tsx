'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  iconUrl?: string | null;
  order: number;
};

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills?limit=100', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setSkills(json?.data ?? []);
        }
      } catch (error) {
        logger.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-background-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading skills...</p>
          </div>
        </div>
      </section>
    );
  }
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section id="skills" className="py-20 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Skills & Technologies
            </h2>
            <div className="h-1 w-24 bg-primary-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mt-6">
            Technologies and tools I work with to bring ideas to life
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-background-secondary rounded-2xl p-8 max-w-md mx-auto border border-border-primary">
              <p className="text-lg text-text-secondary">No skills yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map(cat => (
              <div key={cat} className="group">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary-400 transition-colors">
                    {cat}
                  </h3>
                  <div className="h-0.5 w-16 bg-primary-400 mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {skills
                    .filter(s => s.category === cat)
                    .sort((a, b) => a.order - b.order || b.level - a.level)
                    .map(s => (
                      <div
                        key={s.id}
                        className="group/skill bg-background-secondary rounded-2xl p-6 border border-border-primary hover:border-primary-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {s.iconUrl && (
                            <div className="p-2 bg-background-primary rounded-xl">
                              <img
                                src={s.iconUrl}
                                alt={s.name}
                                className="h-6 w-6"
                              />
                            </div>
                          )}
                          <span className="text-text-primary font-semibold text-sm group-hover/skill:text-primary-400 transition-colors">
                            {s.name}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-text-secondary font-medium">
                              Proficiency
                            </span>
                            <span className="text-xs text-primary-400 font-bold">
                              {s.level}/5
                            </span>
                          </div>
                          <div className="h-2 bg-background-primary rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-primary-400 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${(s.level / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
