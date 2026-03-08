import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Youtube, Video, ExternalLink } from 'lucide-react';

interface MediaLink {
  id: number;
  title: string;
  url: string;
  type: 'youtube' | 'googledrive';
  created_at: string;
}

export default function MediaLibrary() {
  const [links, setLinks] = useState<MediaLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '', type: 'youtube' as const });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching media links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', url: '', type: 'youtube' });
        fetchLinks();
      }
    } catch (error) {
      console.error('Error adding media link:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media link?')) return;

    try {
      const response = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error('Error deleting media link:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Media Library</h2>
          <p className="text-gray-600">Manage video links from YouTube and Google Drive</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-blue hover:bg-deep-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Video Link
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <div key={link.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {link.type === 'youtube' ? (
                    <Youtube className="text-red-600" size={24} />
                  ) : (
                    <Video className="text-blue-600" size={24} />
                  )}
                </div>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="font-bold text-navy-blue mb-2">{link.title}</h3>
              <p className="text-xs text-gray-500 mb-4 truncate">{link.url}</p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <ExternalLink size={14} />
                View Source
              </a>
            </div>
          ))}
          {links.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <Video size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No media links yet</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-navy-blue">Add Video Link</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School Inter-house Sports 2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="youtube">YouTube URL</option>
                  <option value="googledrive">Google Drive Video Link</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  For YouTube, use the full URL or share link. For Google Drive, ensure the video is set to "Anyone with the link can view".
                </p>
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
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
