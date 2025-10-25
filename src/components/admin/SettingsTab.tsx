'use client';

import { useState, useEffect } from 'react';
import logger from '@/lib/logger';
import {
  Save,
  Key,
  Database,
  Mail,
  Shield,
  Bell,
  Palette,
  Loader2,
} from 'lucide-react';

interface SettingsData {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  emailNotifications: boolean;
  theme: string;
}

export default function SettingsTab() {
  const [settingsData, setSettingsData] = useState<SettingsData>({
    siteTitle: '',
    siteDescription: '',
    contactEmail: '',
    maintenanceMode: false,
    analyticsEnabled: true,
    emailNotifications: true,
    theme: 'dark',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch settings data on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettingsData(data.data);
      }
    } catch (error) {
      logger.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      if (response.ok) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-text-primary">Settings</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400 border-t-transparent"></div>
        </div>
      ) : (
        /* Settings Form */
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* General Settings */}
          <div className="bg-background-secondary rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary-400" />
              General Settings
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={settingsData.siteTitle}
                    onChange={e =>
                      setSettingsData(prev => ({
                        ...prev,
                        siteTitle: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsData.contactEmail}
                    onChange={e =>
                      setSettingsData(prev => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Site Description
                </label>
                <textarea
                  rows={3}
                  value={settingsData.siteDescription}
                  onChange={e =>
                    setSettingsData(prev => ({
                      ...prev,
                      siteDescription: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Theme
                </label>
                <select
                  value={settingsData.theme}
                  onChange={e =>
                    setSettingsData(prev => ({
                      ...prev,
                      theme: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-background-secondary rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary-400" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary font-medium">
                    Maintenance Mode
                  </p>
                  <p className="text-text-secondary text-sm">
                    Enable to show maintenance page to visitors
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsData.maintenanceMode}
                    onChange={e =>
                      setSettingsData(prev => ({
                        ...prev,
                        maintenanceMode: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-primary after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary font-medium">
                    Analytics Tracking
                  </p>
                  <p className="text-text-secondary text-sm">
                    Enable visitor analytics and tracking
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsData.analyticsEnabled}
                    onChange={e =>
                      setSettingsData(prev => ({
                        ...prev,
                        analyticsEnabled: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-primary after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-background-secondary rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary-400" />
              Notification Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary font-medium">
                    Email Notifications
                  </p>
                  <p className="text-text-secondary text-sm">
                    Receive email notifications for contact form submissions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsData.emailNotifications}
                    onChange={e =>
                      setSettingsData(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-primary after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Database Settings */}
          <div className="bg-background-secondary rounded-xl border border-border-primary p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary-400" />
              Database Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary font-medium">
                    Database Status
                  </p>
                  <p className="text-text-secondary text-sm">
                    PostgreSQL connection status
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm font-medium">
                    Connected
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary font-medium">Last Backup</p>
                  <p className="text-text-secondary text-sm">
                    Automated database backup
                  </p>
                </div>
                <span className="text-text-secondary text-sm">2 hours ago</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center px-6 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
