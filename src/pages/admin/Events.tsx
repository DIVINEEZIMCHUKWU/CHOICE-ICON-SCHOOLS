import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Calendar, MapPin, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  created_at: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', event_date: '', location: '', image_url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(formData)
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([formData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', event_date: '', location: '', image_url: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({ 
        title: event.title, 
        description: event.description, 
        event_date: event.event_date.split('T')[0], 
        location: event.location, 
        image_url: event.image_url 
      });
    } else {
      setEditingEvent(null);
      setFormData({ title: '', description: '', event_date: '', location: '', image_url: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Events Calendar</h2>
          <p className="text-gray-600">Manage school events and activities</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-sky-blue hover:bg-deep-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              {event.image_url && (
                <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex-1 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-navy-blue leading-tight">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-sky-blue" />
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} className="text-sky-blue" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => openModal(event)}
                    className="p-2 text-gray-400 hover:text-sky-blue transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No events yet</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-navy-blue">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
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
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
