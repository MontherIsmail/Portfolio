'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  current: boolean;
  order: number;
};

export function ExperienceSection() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch('/api/experience?limit=20', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setItems(json?.data ?? []);
        }
      } catch (error) {
        console.error('Error fetching experience:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-background-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading experience...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Work Experience
            </h2>
            <div className="h-1 w-24 bg-primary-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mt-6">
            My professional journey and the experiences that shaped my career
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-background-secondary rounded-2xl p-8 max-w-md mx-auto border border-border-primary">
              <p className="text-lg text-text-secondary">No experience yet.</p>
            </div>
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-400"></div>

            <div className="space-y-8">
              {items
                .sort((a, b) => {
                  // Sort by startDate with newest first
                  const dateA = new Date(a.startDate).getTime();
                  const dateB = new Date(b.startDate).getTime();
                  return dateB - dateA;
                })
                .map((e, index) => (
                  <div key={e.id} className="relative flex items-start group">
                    {/* Timeline dot */}
                    <div className="absolute left-6 top-6 flex h-4 w-4 items-center justify-center rounded-full bg-primary-400 ring-8 ring-background-primary group-hover:scale-125 transition-transform duration-300">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>

                    {/* Content card */}
                    <div className="ml-16 bg-background-secondary rounded-2xl p-6 border border-border-primary hover:border-primary-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-text-primary group-hover:text-primary-400 transition-colors">
                            {e.role}
                          </h3>
                          <p className="text-lg font-semibold text-primary-400">
                            {e.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-background-primary text-primary-400 border border-border-primary">
                            {e.current ? (
                              <span className="flex items-center gap-1">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                Current
                              </span>
                            ) : (
                              'Completed'
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <time className="text-sm font-medium text-text-secondary">
                          {new Date(e.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })}{' '}
                          —{' '}
                          {e.current
                            ? 'Present'
                            : e.endDate
                              ? new Date(e.endDate).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                  }
                                )
                              : 'N/A'}
                        </time>
                      </div>

                      <p className="text-text-secondary leading-relaxed">
                        {e.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
