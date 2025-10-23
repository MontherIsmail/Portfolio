'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  Save,
  Upload,
  User,
  Mail,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Loader2,
} from 'lucide-react';

interface ProfileData {
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
}

export default function ProfileTab() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    profileImage: '/profile-image.jpg',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load profile data',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#3b82f6'
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error!',
          text: errorData.error || 'Failed to update profile',
          icon: 'error',
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Network error occurred',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = event => {
        setProfileData(prev => ({
          ...prev,
          profileImage: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-text-primary">
          Profile Management
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      ) : (
        /* Profile Form */
        <div className="bg-background-secondary rounded-xl border border-border-primary p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Image */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-xl object-cover border-2 border-border-primary"
              />
              <label className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="h-6 w-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Profile Picture
              </h3>
              <p className="text-sm text-text-secondary">
                Click on the image to upload a new one
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={e =>
                  setProfileData(prev => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Professional Title *
              </label>
              <input
                type="text"
                required
                value={profileData.title}
                onChange={e =>
                  setProfileData(prev => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Bio *
            </label>
            <textarea
              required
              rows={4}
              value={profileData.bio}
              onChange={e =>
                setProfileData(prev => ({ ...prev, bio: e.target.value }))
              }
              className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Social Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  GitHub
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="url"
                    value={profileData.github}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        github: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="url"
                    value={profileData.linkedin}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        linkedin: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="url"
                    value={profileData.twitter}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        twitter: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end pt-6 border-t border-border-primary">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
}
