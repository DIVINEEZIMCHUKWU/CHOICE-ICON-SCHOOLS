import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Plus, Trash2, Edit2, Bell } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: boolean | number; // Handle both boolean and number
  created_at: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', is_active: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/announcements`, { headers });
      console.log('🔍 AdminAnnouncements: Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 AdminAnnouncements: Raw data:', data);
        // Handle both response formats
        const announcementsArray = Array.isArray(data) ? data : data.data || [];
        console.log('🔍 AdminAnnouncements: Processed announcements:', announcementsArray);
        setAnnouncements(announcementsArray);
      } else {
        console.error('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('🔍 AdminAnnouncements: Submitting form...');
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (editingAnnouncement) {
        console.log('🔍 AdminAnnouncements: Updating announcement...');
        const response = await fetch(`${API_BASE_URL}/announcements/${editingAnnouncement.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            is_active: formData.is_active
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update announcement');
        }
        console.log('🔍 AdminAnnouncements: Update successful');
      } else {
        console.log('🔍 AdminAnnouncements: Creating new announcement...');
        const response = await fetch(`${API_BASE_URL}/announcements`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            is_active: formData.is_active
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create announcement');
        }
        console.log('🔍 AdminAnnouncements: Create successful');
      }
      
      console.log('🔍 AdminAnnouncements: Refreshing announcements list...');
      fetchAnnouncements();
      setIsModalOpen(false);
      setEditingAnnouncement(null);
      setFormData({ title: '', content: '', is_active: 1 });
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete announcement');
      }

      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const openModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({ title: announcement.title, content: announcement.content, is_active: announcement.is_active });
    } else {
      setEditingAnnouncement(null);
      setFormData({ title: '', content: '', is_active: 1 });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Announcements</h2>
          <p className="text-gray-600">Manage school announcements and news</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-sky-blue hover:bg-deep-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Announcement
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-navy-blue">{announcement.title}</h3>
                  {announcement.is_active ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Active</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{announcement.content}</p>
                <p className="text-gray-400 text-xs">Posted on: {new Date(announcement.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(announcement)}
                  className="p-2 text-gray-400 hover:text-sky-blue transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No announcements yet</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-navy-blue">
                {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                ></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (Visible on website)</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-deep-blue transition-colors"
                >
                  {editingAnnouncement ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
