'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Search,
  Save,
  X,
  Loader2,
  Building2,
} from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
  order: number;
}

interface ExperienceFormData {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export default function ExperienceTab() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch experiences
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      console.log('Fetching experiences...');
      const response = await fetch('/api/experience', { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched experiences:', data.data);
        setExperiences(data.data || []);
      } else {
        console.error('Failed to fetch experiences:', response.status);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const url = editingExperience
        ? `/api/experience/${editingExperience.id}`
        : '/api/experience';

      const method = editingExperience ? 'PUT' : 'POST';

      const experienceData = {
        ...formData,
        endDate: formData.current ? '' : (formData.endDate || ''),
        order: editingExperience
          ? editingExperience.order
          : experiences.length + 1,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      });

      if (response.ok) {
        console.log('Experience created/updated successfully');
        // Reset form first
        resetForm();
        
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: editingExperience ? 'Experience updated successfully!' : 'Experience created successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#3b82f6'
        });
        
        // Then refresh the list
        setTimeout(async () => {
          console.log('Refreshing experiences list...');
          await fetchExperiences();
          // Trigger dashboard refresh
          window.dispatchEvent(new CustomEvent('refreshDashboard'));
        }, 200);
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error!',
          text: errorData.error || 'An error occurred',
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
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      color: '#e2e8f0',
      background: '#1e293b'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchExperiences();
        Swal.fire({
          title: 'Deleted!',
          text: 'Experience has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#3b82f6'
        });
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete experience.',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      role: experience.role,
      startDate: experience.startDate.split('T')[0], // Convert to YYYY-MM-DD format
      endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
      description: experience.description,
      current: experience.current,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    });
    setEditingExperience(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const filteredExperiences = experiences.filter(
    experience =>
      experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-text-primary">
          Experience Management
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setLoading(true);
              fetchExperiences();
            }}
            className="flex items-center px-4 py-2 bg-background-secondary text-text-primary rounded-lg hover:bg-background-primary transition-colors border border-border-primary"
          >
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Experience
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search experiences..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-4">
        {filteredExperiences
          .sort(
            (a, b) =>
              a.order - b.order ||
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
          .map((experience, index) => (
            <div
              key={experience.id}
              className="bg-background-secondary rounded-xl border border-border-primary p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-400 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-text-primary">
                        {experience.role}
                      </h3>
                      {experience.current && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-primary-400 font-medium mb-2">
                      {experience.company}
                    </p>
                    <div className="flex items-center text-text-secondary text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(experience.startDate)} —{' '}
                      {experience.current
                        ? 'Present'
                        : experience.endDate
                          ? formatDate(experience.endDate)
                          : 'N/A'}
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {experience.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="flex items-center px-3 py-1 bg-primary-400 text-white text-sm rounded hover:bg-primary-500 transition-colors"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {filteredExperiences.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">No experiences found</p>
        </div>
      )}

      {/* Experience Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary rounded-xl border border-border-primary w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border-primary">
              <h3 className="text-xl font-semibold text-text-primary">
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button
                onClick={resetForm}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, role: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    disabled={formData.current}
                    className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                  placeholder="Describe your role, responsibilities, and achievements..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate,
                    }));
                  }}
                  className="h-4 w-4 text-primary-400 focus:ring-primary-400 border-border-primary rounded"
                />
                <label
                  htmlFor="current"
                  className="ml-2 text-sm text-text-primary"
                >
                  Currently working here
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border-primary">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-background-primary border border-border-primary text-text-primary rounded-lg hover:bg-background-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50"
                >
                  {formLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  <Save className="h-4 w-4 mr-2" />
                  {editingExperience
                    ? 'Update Experience'
                    : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
