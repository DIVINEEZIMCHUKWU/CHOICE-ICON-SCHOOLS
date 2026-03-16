import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, FileText, MessageSquare, Calendar, Home } from 'lucide-react';
import { api } from '../../utils/api';

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
        if (!token) return;

        const data = await api.getStats(token);
        if (data) {
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
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">{title}</h3>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-navy-blue mt-1">{value}</p>
      </div>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${color} ${textColor}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | Admin Panel</title>
      </Helmet>
      
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-blue">Overview</h2>
          <p className="text-xs sm:text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <a 
          href="/" 
          className="flex items-center gap-2 bg-navy-blue text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-deep-blue transition-all text-xs sm:text-sm font-bold shadow-lg shadow-navy-blue/20"
        >
          <Home size={14} className="sm:size-16" />
          <span className="hidden sm:inline">Home</span>
          <span className="sm:hidden">🏠</span>
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8 md:mb-10">
        <StatCard title="Admissions" value={stats.admissions} icon={<Users size={18} className="sm:size-20" />} color="bg-sky-blue/10" textColor="text-sky-blue" />
        <StatCard title="Enquiries" value={stats.enquiries} icon={<MessageSquare size={18} className="sm:size-20" />} color="bg-emerald-50" textColor="text-emerald-500" />
        <StatCard title="Job Apps" value={stats.jobs} icon={<FileText size={18} className="sm:size-20" />} color="bg-purple-50" textColor="text-purple-500" />
        <StatCard title="Events" value={stats.events} icon={<Calendar size={18} className="sm:size-20" />} color="bg-orange-50" textColor="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-navy-blue">Recent Enquiries</h3>
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
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-navy-blue">Recent Admissions</h3>
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
