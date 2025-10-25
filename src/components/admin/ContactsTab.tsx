'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import logger from '@/lib/logger';
import {
  Mail,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare,
  CheckSquare,
  Square,
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();

        setContacts(data.data || []);
      } else {
        logger.error('Failed to fetch contacts:', response.status);
      }
    } catch (error) {
      logger.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read }),
      });

      if (response.ok) {
        await fetchContacts();
        Swal.fire({
          title: 'Success!',
          text: `Message marked as ${read ? 'read' : 'unread'}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#3b82f6',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update message.',
          icon: 'error',
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      logger.error('Error updating contact:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Network error occurred.',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
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
      background: '#1e293b',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchContacts();
        Swal.fire({
          title: 'Deleted!',
          text: 'Contact message has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#3b82f6',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete message.',
          icon: 'error',
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      logger.error('Error deleting contact:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Network error occurred.',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const handleBulkMarkAsRead = async (read: boolean) => {
    if (selectedContacts.length === 0) return;

    try {
      await Promise.all(
        selectedContacts.map(id =>
          fetch(`/api/contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read }),
          })
        )
      );
      await fetchContacts();
      setSelectedContacts([]);
      Swal.fire({
        title: 'Success!',
        text: `${selectedContacts.length} message(s) marked as ${read ? 'read' : 'unread'}.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#3b82f6',
      });
    } catch (error) {
      logger.error('Error bulk updating contacts:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update messages.',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedContacts.length} message(s). This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel',
      color: '#e2e8f0',
      background: '#1e293b',
    });

    if (!result.isConfirmed) return;

    try {
      await Promise.all(
        selectedContacts.map(id =>
          fetch(`/api/contacts/${id}`, { method: 'DELETE' })
        )
      );
      await fetchContacts();
      setSelectedContacts([]);
      Swal.fire({
        title: 'Deleted!',
        text: `${selectedContacts.length} message(s) have been deleted.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#3b82f6',
      });
    } catch (error) {
      logger.error('Error deleting contacts:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete messages.',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterRead === 'all' ||
      (filterRead === 'read' && contact.read) ||
      (filterRead === 'unread' && !contact.read);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-text-primary">
          Contact Messages
        </h2>
        <button
          onClick={() => {
            setLoading(true);
            fetchContacts();
          }}
          className="flex items-center px-4 py-2 bg-background-secondary text-text-primary rounded-lg hover:bg-background-primary transition-colors border border-border-primary"
        >
          <Mail className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>
        <select
          value={filterRead}
          onChange={e => setFilterRead(e.target.value)}
          className="px-3 py-2 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-400 focus:border-transparent"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="flex items-center space-x-3 p-4 bg-background-secondary rounded-lg border border-border-primary">
          <span className="text-sm text-text-secondary">
            {selectedContacts.length} selected
          </span>
          <button
            onClick={() => handleBulkMarkAsRead(true)}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            Mark as Read
          </button>
          <button
            onClick={() => handleBulkMarkAsRead(false)}
            className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Mark as Unread
          </button>
          <button
            onClick={handleBulkDelete}
            className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            {selectedContacts.length === filteredContacts.length ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
            <span className="text-sm">
              {selectedContacts.length === filteredContacts.length
                ? 'Deselect All'
                : 'Select All'}
            </span>
          </button>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-background-secondary rounded-2xl p-8 max-w-md mx-auto border border-border-primary">
              <Mail className="h-16 w-16 text-text-secondary mx-auto mb-4" />
              <p className="text-lg text-text-secondary">
                No contact messages found.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`bg-background-secondary rounded-xl border p-6 transition-all duration-200 ${
                  contact.read
                    ? 'border-border-primary'
                    : 'border-primary-400 bg-primary-400/5'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleSelectContact(contact.id)}
                      className="text-text-secondary hover:text-primary-400 transition-colors"
                    >
                      {selectedContacts.includes(contact.id) ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {contact.name}
                      </h3>
                      <p className="text-text-secondary">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary">
                      {formatDate(contact.createdAt)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          handleMarkAsRead(contact.id, !contact.read)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          contact.read
                            ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                            : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        }`}
                        title={contact.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {contact.read ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-background-primary rounded-lg p-4">
                  <p className="text-text-secondary leading-relaxed">
                    {contact.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
