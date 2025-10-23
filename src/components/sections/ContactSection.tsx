'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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

export function ContactSection() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

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
      }
    };

    fetchProfile();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (name.length < 2) {
      toast.error('Name must be at least 2 characters long.');
      return;
    }
    
    if (message.length < 10) {
      toast.error('Message must be at least 10 characters long.');
      return;
    }
    
    setStatus('loading');
    try {
      console.log('Submitting contact form:', { name, email, message });
      
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      
      console.log('Response status:', res.status);
      const responseData = await res.json();
      console.log('Response data:', responseData);
      
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to send message');
      }
      
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      
      // Show success message with Toastify
      toast.success('Thank you for your message. I\'ll get back to you soon!');
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      toast.error((error as Error).message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                Get In Touch
              </h2>
              <div className="h-1 w-24 bg-primary-400 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mt-6">
              Have a project in mind or want to collaborate? I'd love to hear
              from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-background-secondary rounded-2xl p-8 border border-border-primary">
                <h3 className="text-2xl font-bold text-text-primary mb-6">
                  Let's Connect
                </h3>
                <div className="space-y-6">
                  {profile?.email && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-background-primary rounded-xl">
                        <svg
                          className="h-6 w-6 text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Email</p>
                        <a href={`mailto:${profile.email}`} className="text-text-primary font-medium hover:text-primary-400 transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-background-primary rounded-xl">
                        <svg
                          className="h-6 w-6 text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Phone</p>
                        <a href={`tel:${profile.phone}`} className="text-text-primary font-medium hover:text-primary-400 transition-colors">
                          {profile.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-background-primary rounded-xl">
                        <svg
                          className="h-6 w-6 text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Location</p>
                        <p className="text-text-primary font-medium">{profile.location}</p>
                      </div>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-background-primary rounded-xl">
                        <svg
                          className="h-6 w-6 text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Website</p>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-text-primary font-medium hover:text-primary-400 transition-colors">
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background-primary rounded-xl">
                      <svg
                        className="h-6 w-6 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">
                        Response Time
                      </p>
                      <p className="text-text-primary font-medium">
                        Within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-background-secondary rounded-2xl shadow-xl p-8 border border-border-primary">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Name *
                    </label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border-primary bg-background-primary text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border-primary bg-background-primary text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border-primary bg-background-primary text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell me about your project or just say hello!"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    disabled={status === 'loading'}
                    className="group relative inline-flex items-center px-8 py-4 bg-primary-400 text-white font-semibold rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-400/25"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg
                          className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </>
                    )}
                  </button>

                  {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">
                        Message sent successfully!
                      </span>
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="font-medium">
                        Something went wrong. Please try again.
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
