import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: number;
  created_at: string;
}

export default function AnnouncementsBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 AnnouncementsBar: Fetching data...');
        
        // Fetch settings for existing announcement
        const settingsResponse = await fetch('/api/settings');
        console.log('🔍 AnnouncementsBar: Settings response:', settingsResponse.status);
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          console.log('🔍 AnnouncementsBar: Settings data:', settingsData);
          setSettings(settingsData);
        }

        // Fetch dynamic announcements
        const announcementsResponse = await fetch('/api/announcements');
        console.log('🔍 AnnouncementsBar: Announcements response:', announcementsResponse.status);
        if (announcementsResponse.ok) {
          const data = await announcementsResponse.json();
          console.log('🔍 AnnouncementsBar: Announcements data:', data);
          // Handle both response formats
          const announcementsArray = Array.isArray(data) ? data : data.data || [];
          // Only show active announcements (handle both boolean and number)
          const activeAnnouncements = announcementsArray.filter((a: Announcement) => 
            a.is_active === true || a.is_active === 1
          );
          console.log('🔍 AnnouncementsBar: Active announcements:', activeAnnouncements);
          setAnnouncements(activeAnnouncements);
        }
      } catch (error) {
        console.error('🔍 AnnouncementsBar: Error fetching data:', error);
      }
    };

    fetchData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Combine static announcement with dynamic announcements
  const allAnnouncements = [
    ...(settings.announcement_bar ? [{
      id: 0,
      title: 'School Announcement',
      content: settings.announcement_bar,
      is_active: 1,
      created_at: new Date().toISOString()
    } as Announcement] : []),
    ...announcements
  ];

  console.log('🔍 AnnouncementsBar: All announcements:', allAnnouncements);
  console.log('🔍 AnnouncementsBar: Current index:', currentIndex);
  console.log('🔍 AnnouncementsBar: Is visible:', isVisible);
  console.log('🔍 AnnouncementsBar: Settings announcement_bar:', settings.announcement_bar);

  const currentAnnouncement = allAnnouncements[currentIndex];
  console.log('🔍 AnnouncementsBar: Current announcement:', currentAnnouncement);

  // Auto-rotate announcements
  useEffect(() => {
    if (allAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allAnnouncements.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [allAnnouncements.length]);

  if (allAnnouncements.length === 0 || !isVisible) {
    console.log('🔍 AnnouncementsBar: Not displaying - empty or hidden');
    return null;
  }

  return (
    <div className="bg-sky-blue text-white py-2 sm:py-3 px-3 sm:px-4 text-center text-xs sm:text-sm font-medium relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1 flex items-center justify-center min-w-0">
          <span className="line-clamp-2 sm:truncate">
            📢 {currentAnnouncement.title}: {currentAnnouncement.content}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {allAnnouncements.length > 1 && (
            <div className="flex gap-1.5">
              {allAnnouncements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to announcement ${index + 1}`}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
            aria-label="Close announcements"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
