'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ImageUpload from './ImageUpload';
import logger from '@/lib/logger';
import {
  Save,
  User,
  Mail,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Loader2,
  Image,
  X,
  Check,
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

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
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
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [availableImages, setAvailableImages] = useState<CloudinaryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

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
      logger.error('Error fetching profile:', error);
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

  const fetchAvailableImages = async () => {
    try {
      setLoadingImages(true);
      const response = await fetch('/api/images?folder=portfolio&maxResults=50');
      const result = await response.json();
      
      if (result.success) {
        setAvailableImages(result.data);
      } else {
        // Don't show error for empty results, just set empty array
        setAvailableImages([]);
      }
    } catch (error) {
      logger.error('Error fetching images:', error);
      // Don't show SweetAlert for this error, just set empty array
      setAvailableImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setProfileData(prev => ({
      ...prev,
      profileImage: imageUrl,
    }));
    setShowImageSelector(false);
    
    // Show success message after selecting image
    Swal.fire({
      title: 'Success!',
      text: 'Profile image updated successfully!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      color: '#e2e8f0',
      background: '#1e293b',
      confirmButtonColor: '#3b82f6'
    });
  };

  const openImageSelector = () => {
    setShowImageSelector(true);
    fetchAvailableImages();
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
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Profile Picture
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Upload a new image or choose from your gallery
              </p>
            </div>
            
            {/* Current Image Preview */}
            {profileData.profileImage && (
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={profileData.profileImage}
                  alt="Current Profile"
                  className="w-20 h-20 rounded-lg object-cover border-2 border-border-primary"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageSelector();
                    }}
                    className="px-3 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors flex items-center space-x-2"
                  >
                    <Image className="h-4 w-4" />
                    <span>Choose from Gallery</span>
                  </button>
                </div>
              </div>
            )}

            <ImageUpload
              onImageSelect={(url) =>
                setProfileData(prev => ({
                  ...prev,
                  profileImage: url,
                }))
              }
              currentImage={profileData.profileImage}
              folder="profile"
              showPreview={false}
              className="max-w-md"
            />
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

      {/* Image Selector Modal */}
      {showImageSelector && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background-secondary rounded-xl max-w-4xl max-h-[90vh] overflow-hidden w-full">
            <div className="flex items-center justify-between p-4 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">Choose Profile Image</h3>
              <button
                onClick={() => setShowImageSelector(false)}
                className="p-2 hover:bg-background-primary rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {loadingImages ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400 border-t-transparent"></div>
                </div>
              ) : availableImages.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                  <div className="text-text-secondary mb-2">No images found</div>
                  <div className="text-sm text-text-secondary mb-4">
                    Upload images in the Images tab first, then come back here to select one
                  </div>
                  <button
                    onClick={() => setShowImageSelector(false)}
                    className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableImages.map((image) => (
                    <div key={image.public_id} className="group relative">
                      <div className="aspect-square bg-background-primary rounded-lg overflow-hidden border border-border-primary">
                        <img
                          src={image.secure_url}
                          alt={image.public_id}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleImageSelect(image.secure_url)}
                            className="p-2 bg-primary-400/20 rounded-lg hover:bg-primary-400/30 transition-colors"
                          >
                            <Check className="h-6 w-6 text-white" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Image Info */}
                      <div className="mt-2 text-xs text-text-secondary">
                        <div>{image.width} × {image.height}</div>
                        <div>{Math.round(image.bytes / 1024)}KB</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
