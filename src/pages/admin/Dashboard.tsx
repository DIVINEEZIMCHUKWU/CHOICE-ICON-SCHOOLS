import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, FileText, MessageSquare, Calendar, Home } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    admissions: 0,
    enquiries: 0,
    jobs: 0,
    posts: 0,
    events: 0,
    announcements: 0,
    media: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/stats', { headers });
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        } else {
          console.error('Failed to fetch stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, textColor }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-bold text-navy-blue mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} ${textColor}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | Admin Panel</title>
      </Helmet>
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Overview</h2>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <a 
          href="/" 
          className="flex items-center gap-2 bg-navy-blue text-white px-4 py-2 rounded-xl hover:bg-deep-blue transition-all text-sm font-bold shadow-lg shadow-navy-blue/20"
        >
          <Home size={16} />
          <span>Home</span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 md:mb-10">
        <StatCard title="Admissions" value={stats.admissions} icon={<Users size={20} />} color="bg-sky-blue/10" textColor="text-sky-blue" />
        <StatCard title="Enquiries" value={stats.enquiries} icon={<MessageSquare size={20} />} color="bg-emerald-50" textColor="text-emerald-500" />
        <StatCard title="Job Apps" value={stats.jobs} icon={<FileText size={20} />} color="bg-purple-50" textColor="text-purple-500" />
        <StatCard title="Upcoming Events" value={stats.events} icon={<Calendar size={20} />} color="bg-orange-50" textColor="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-navy-blue">Recent Enquiries</h3>
            <button className="text-sky-blue text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">No recent enquiries found.</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-navy-blue">Recent Admissions</h3>
            <button className="text-sky-blue text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Users size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">No recent admissions found.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
