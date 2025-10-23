'use client';

import { useState, useEffect } from 'react';

type ProfileData = {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  profileImage: string;
};

export function AboutSection() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setProfile(json?.data ?? null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-20 bg-background-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading profile...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              About Me
            </h2>
            <div className="h-1 w-24 bg-primary-400 mx-auto rounded-full"></div>
          </div>
          <div className="bg-background-secondary rounded-2xl p-8 border border-border-primary">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-text-primary mb-4">
                  {profile?.name || 'Monther Alzamli'}
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  {profile?.bio || 'I create beautiful, functional, and user-centered digital experiences using modern web technologies like React, Next.js, and TypeScript.'}
                </p>
                <div className="space-y-3">
                  {profile?.location && (
                    <div className="flex items-center text-text-secondary">
                      <span className="font-medium mr-2">Location:</span>
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center text-text-secondary">
                      <span className="font-medium mr-2">Email:</span>
                      <a href={`mailto:${profile.email}`} className="text-primary-400 hover:text-primary-300 transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center text-text-secondary">
                      <span className="font-medium mr-2">Phone:</span>
                      <a href={`tel:${profile.phone}`} className="text-primary-400 hover:text-primary-300 transition-colors">
                        {profile.phone}
                      </a>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center text-text-secondary">
                      <span className="font-medium mr-2">Website:</span>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-primary-400 rounded-2xl p-1">
                    <div className="w-full h-full bg-background-primary rounded-2xl p-2">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-background-secondary">
                        <img
                          src={profile?.profileImage || "/profile-image.jpg"}
                          alt={profile?.name || "Monther Alzamli"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
