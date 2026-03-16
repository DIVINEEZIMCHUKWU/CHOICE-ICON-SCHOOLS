import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Image,
  MessageSquare,
  Bell,
  HelpCircle,
  Calendar,
  Settings,
  LogOut,
  Globe,
  BookOpen,
  Home,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Admissions', path: '/admin/admissions', icon: <Users size={20} /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare size={20} /> },
    { name: 'Job Applications', path: '/admin/jobs', icon: <Briefcase size={20} /> },
    { name: 'Blog Manager', path: '/admin/blog', icon: <FileText size={20} /> },
    { name: 'Gallery Manager', path: '/admin/gallery', icon: <Image size={20} /> },
    { name: 'Announcements', path: '/admin/announcements', icon: <Bell size={20} /> },
    { name: 'Events Calendar', path: '/admin/events', icon: <Calendar size={20} /> },
    { name: 'Content Manager', path: '/admin/content', icon: <Globe size={20} /> },
    { name: 'Media Library', path: '/admin/media', icon: <Image size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-navy-blue text-white p-3 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-navy-blue text-white w-64 min-h-screen flex flex-col shadow-2xl z-40 fixed lg:static transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img 
            src="/Images/Choice Logo.jpg" 
            alt="Choice Icon Schools" 
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h1 className="text-base font-bold tracking-tight">Admin Panel</h1>
            <p className="text-[10px] text-sky-blue/70 uppercase tracking-widest font-medium">The Choice ICON</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-sky-blue text-white shadow-lg shadow-sky-blue/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={location.pathname === item.path ? 'text-white' : 'text-gray-500 group-hover:text-white'}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-sky-blue hover:bg-sky-blue/10 rounded-lg w-full text-left transition-all"
        >
          <Home size={18} />
          <span>Back to Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg w-full text-left transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
      </div>
    </>
  );
}
