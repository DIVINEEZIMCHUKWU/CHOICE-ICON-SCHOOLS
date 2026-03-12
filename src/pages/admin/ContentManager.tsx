import React, { useState, useEffect } from 'react';
import { Save, Globe, Phone, Mail, MapPin, Facebook } from 'lucide-react';

export default function ContentManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      console.log('🔧 ContentManager: Updating setting:', { key, value });
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      console.log('🔧 ContentManager: Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('🔧 ContentManager: Response data:', data);
      } else {
        console.error('🔧 ContentManager: Failed to update setting');
      }
    } catch (error) {
      console.error(`🔧 ContentManager: Error updating setting ${key}:`, error);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      console.log('🔧 ContentManager: Starting save all process...');
      console.log('🔧 ContentManager: Current settings to save:', settings);
      
      for (const [key, value] of Object.entries(settings)) {
        console.log('🔧 ContentManager: Saving setting:', key, value);
        await updateSetting(key, value as string);
        // Add small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('🔧 ContentManager: All settings saved, refreshing...');
      await fetchSettings(); // Refresh settings from server
      alert('All settings saved successfully!');
    } catch (error) {
      console.error('🔧 ContentManager: Error in save all:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Content Manager</h2>
          <p className="text-gray-600">Update general website information and contact details</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-sky-blue hover:bg-deep-blue text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={20} className="text-sky-blue" />
            <h3 className="font-bold text-navy-blue">Contact Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Phone Numbers</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none text-sm"
                value={settings.phone || '+234-806-9077-937 / +234-810-7601-537'}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none text-sm"
                value={settings.email || 'thechoiceiconschools@gmail.com'}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Physical Address</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none text-sm"
                value={settings.address || 'ICON Avenue, off Delta State Polytechnic Road, Behind Joanchim Filling Station, Ogwashi-Uku, Delta State'}
                onChange={(e) => handleChange('address', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={20} className="text-sky-blue" />
            <h3 className="font-bold text-navy-blue">Social Media</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                <Facebook size={12} /> Facebook URL
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none text-sm"
                value={settings.facebook || 'https://www.facebook.com/thechoiceiconschools'}
                onChange={(e) => handleChange('facebook', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Home Page Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-sky-blue" />
            <h3 className="font-bold text-navy-blue">Hero Section & Announcements</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hero Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none text-sm"
                value={settings.hero_title || 'Nurturing the Next Generation of Global Icons'}
                onChange={(e) => handleChange('hero_title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hero Subtitle</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none text-sm"
                value={settings.hero_subtitle || 'An Institution with a mandate to steer our young ones away from moral and intellectual decadence.'}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none text-sm"
                value={settings.announcement_bar || 'Admissions Now Open for Early Years, Nursery, Primary and Secondary'}
                onChange={(e) => handleChange('announcement_bar', e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

import { FileText } from 'lucide-react';
