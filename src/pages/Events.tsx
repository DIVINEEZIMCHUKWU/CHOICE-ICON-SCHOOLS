import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return { day, month, year };
  };

  return (
    <>
      <Helmet>
        <title>Events Calendar | The Choice ICON Schools</title>
        <meta name="description" content="Upcoming events and important dates at The Choice ICON Schools." />
      </Helmet>

      <div className="bg-navy-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">School Events</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Mark Your Calendars</p>
        </div>
      </div>

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 && !isLoading ? (
            <div className="text-center text-gray-500 py-12">
              <p>No upcoming events scheduled at the moment.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {events.map((event, idx) => {
                const { day, month, year } = formatDate(event.event_date);
                return (
                  <div key={idx} className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className={`bg-sky-blue text-white p-4 sm:p-6 sm:w-48 flex flex-col justify-center items-center text-center shrink-0`}>
                      <Calendar size={32} className="mb-2 opacity-80" />
                      <span className="text-3xl font-bold">{day}</span>
                      <span className="text-sm uppercase tracking-wider font-medium">{month}</span>
                      <span className="text-xs opacity-75 mt-1">{year}</span>
                    </div>
                    <div className="p-4 sm:p-6 md:p-8 flex-1">
                      <h3 className="text-xl font-bold text-navy-blue mb-3">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-sky-blue" />
                          {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} className="text-sky-blue" />
                          {event.location}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
