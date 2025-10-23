'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FolderOpen,
  Code,
  Briefcase,
  User,
  BarChart3,
  Settings,
  Menu,
  X,
  Mail,
} from 'lucide-react';
import ProjectsTab from '@/components/admin/ProjectsTab';
import SkillsTab from '@/components/admin/SkillsTab';
import ExperienceTab from '@/components/admin/ExperienceTab';
import ProfileTab from '@/components/admin/ProfileTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import ContactsTab from '@/components/admin/ContactsTab';
import NotificationContainer from '@/components/admin/NotificationContainer';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'contacts', label: 'Messages', icon: Mail },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'projects':
        return <ProjectsTab />;
      case 'skills':
        return <SkillsTab />;
      case 'experience':
        return <ExperienceTab />;
      case 'profile':
        return <ProfileTab />;
      case 'contacts':
        return <ContactsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <NotificationContainer />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background-secondary border-r border-border-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border-primary">
          <h1 className="text-xl font-bold text-text-primary">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-secondary hover:text-text-primary"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors duration-200 mb-1 ${
                  activeTab === item.id
                    ? 'bg-primary-400 text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-primary'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-background-secondary border-b border-border-primary h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-secondary hover:text-text-primary"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-text-secondary">
              Welcome back, Admin
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

// OverviewTab component with real data
function OverviewTab() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    contacts: 0,
    featuredProjects: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>>([]);

  const fetchStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      
      const [projectsRes, skillsRes, experienceRes, contactsRes] = await Promise.all([
        fetch('/api/projects', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
        fetch('/api/skills', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
        fetch('/api/experience', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
        fetch('/api/contacts', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
      ]);

      console.log('API responses:', { projectsRes, skillsRes, experienceRes, contactsRes });

      const projectsData = await projectsRes.json();
      const skillsData = await skillsRes.json();
      const experienceData = await experienceRes.json();
      const contactsData = await contactsRes.json();

      console.log('Parsed data:', { projectsData, skillsData, experienceData, contactsData });

      // Calculate featured projects
      const featuredProjects = projectsData.data?.filter((project: any) => project.featured) || [];
      
      // Calculate unread messages
      const unreadMessages = contactsData.data?.filter((contact: any) => !contact.read) || [];

      const newStats = {
        projects: projectsData.data?.length || 0,
        skills: skillsData.data?.length || 0,
        experience: experienceData.data?.length || 0,
        contacts: contactsData.data?.length || 0,
        featuredProjects: featuredProjects.length,
        unreadMessages: unreadMessages.length,
      };

      // Generate recent activity from real data
      const activity = [];
      
      if (newStats.projects > 0) {
        activity.push({
          id: '1',
          type: 'projects',
          message: `${newStats.projects} projects available (${newStats.featuredProjects} featured)`,
          timestamp: 'Just now'
        });
      }
      
      if (newStats.skills > 0) {
        activity.push({
          id: '2',
          type: 'skills',
          message: `${newStats.skills} skills configured`,
          timestamp: 'Just now'
        });
      }
      
      if (newStats.experience > 0) {
        activity.push({
          id: '3',
          type: 'experience',
          message: `${newStats.experience} work experiences added`,
          timestamp: 'Just now'
        });
      }
      
      if (newStats.contacts > 0) {
        activity.push({
          id: '4',
          type: 'contacts',
          message: `${newStats.contacts} contact messages received (${newStats.unreadMessages} unread)`,
          timestamp: 'Just now'
        });
      }

      console.log('Setting stats:', newStats);
      setStats(newStats);
      setRecentActivity(activity);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set fallback stats
      setStats({
        projects: 0,
        skills: 0,
        experience: 0,
        contacts: 0,
        featuredProjects: 0,
        unreadMessages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Listen for custom refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchStats();
    };

    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-text-primary">
            Dashboard Overview
          </h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-text-primary">
          Dashboard Overview
        </h2>
        <button
          onClick={() => {
            setLoading(true);
            fetchStats();
          }}
          className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-text-primary">
                {stats.projects}
              </p>
              <p className="text-primary-400 text-sm mt-1">
                {stats.featuredProjects} featured
              </p>
            </div>
            <div className="p-3 bg-primary-400/20 rounded-lg">
              <FolderOpen className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Skills</p>
              <p className="text-2xl font-bold text-text-primary">
                {stats.skills}
              </p>
              <p className="text-green-400 text-sm mt-1">
                Across categories
              </p>
            </div>
            <div className="p-3 bg-primary-400/20 rounded-lg">
              <Code className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Experience</p>
              <p className="text-2xl font-bold text-text-primary">
                {stats.experience}
              </p>
              <p className="text-orange-400 text-sm mt-1">
                Work positions
              </p>
            </div>
            <div className="p-3 bg-primary-400/20 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Messages</p>
              <p className="text-2xl font-bold text-text-primary">
                {stats.contacts}
              </p>
              <p className="text-red-400 text-sm mt-1">
                {stats.unreadMessages} unread
              </p>
            </div>
            <div className="p-3 bg-primary-400/20 rounded-lg">
              <Mail className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <p className="text-text-secondary">
                  {activity.message}
                </p>
                <span className="text-text-secondary text-sm">
                  {activity.timestamp}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <p className="text-text-secondary">
                No activity data available
              </p>
              <span className="text-text-secondary text-sm">
                Just now
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
