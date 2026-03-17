import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import ChatBot from './ChatBot';
import FloatingWhatsApp from './FloatingWhatsApp';
import AnnouncementsBar from './AnnouncementsBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'School Gallery', path: '/gallery' },
    { name: 'Our Team', path: '/team' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const contactInfo = {
    phone: settings.phone || '+234-806-9077-937 / +234-810-7601-537',
    email: settings.email || 'thechoiceiconschools@gmail.com',
    address: settings.address || 'ICON Avenue, off Delta State Polytechnic Road, Behind Joanchim Filling Station, Ogwashi-Uku, Delta State',
    facebook: settings.facebook || 'https://www.facebook.com/thechoiceiconschools',
    announcementBar: settings.announcement_bar || 'Admissions Now Open for Early Years, Nursery, Primary and Secondary'
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      {/* Dynamic Announcements Bar */}
      <AnnouncementsBar />

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={12} /> {contactInfo.phone}</span>
            <span className="flex items-center gap-1"><Mail size={12} /> {contactInfo.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-navy-blue transition-colors"><Facebook size={14} /></a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-navy-blue text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/Images/Choice Logo.jpg" 
                alt="The Choice ICON Schools" 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-bold text-base md:text-lg leading-tight tracking-tight">THE CHOICE</span>
                <span className="font-light text-[10px] md:text-xs tracking-[0.2em] text-sky-blue">ICON SCHOOLS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-sky-blue ${
                    location.pathname === link.path ? 'text-sky-blue' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admissions"
                className="bg-sky-blue hover:bg-deep-blue text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-sky-blue/30"
              >
                Apply Now
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-blue border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-deep-blue text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  to="/admissions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center bg-sky-blue text-white px-5 py-3 rounded-md font-bold"
                >
                  Apply for Admission
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-navy-blue text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/Images/Choice Logo.jpg" 
                  alt="The Choice ICON Schools" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-base md:text-lg leading-tight">THE CHOICE</span>
                  <span className="font-light text-[10px] md:text-xs tracking-[0.2em] text-sky-blue">ICON SCHOOLS</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
                {settings.hero_subtitle || 'An Institution with a mandate to steer our young ones away from moral and intellectual decadence.'}
              </p>
              <div className="flex gap-4">
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-blue transition-colors"><Facebook size={16} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-bold mb-6 border-b border-sky-blue inline-block pb-2">Quick Links</h4>
              <ul className="space-y-3 text-xs md:text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-sky-blue transition-colors">About Us</Link></li>
                <li><Link to="/academics" className="hover:text-sky-blue transition-colors">Academics</Link></li>
                <li><Link to="/admissions" className="hover:text-sky-blue transition-colors">Admissions</Link></li>
                <li><Link to="/gallery" className="hover:text-sky-blue transition-colors">School Gallery</Link></li>
                <li><Link to="/careers" className="hover:text-sky-blue transition-colors">Careers</Link></li>
                <li><Link to="/events" className="hover:text-sky-blue transition-colors">Events</Link></li>
                <li><Link to="/faq" className="hover:text-sky-blue transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-base font-bold mb-6 border-b border-sky-blue inline-block pb-2">Contact Us</h4>
              <ul className="space-y-4 text-xs md:text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-sky-blue shrink-0 mt-1" />
                  <span>{contactInfo.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-sky-blue shrink-0" />
                  <span>{contactInfo.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-sky-blue shrink-0" />
                  <span>{contactInfo.email}</span>
                </li>
              </ul>
            </div>

            {/* Newsletter/Map */}
            <div>
              <h4 className="text-base font-bold mb-6 border-b border-sky-blue inline-block pb-2">Locate Us</h4>
              <div className="bg-gray-800 h-32 md:h-40 rounded-lg overflow-hidden relative group">
                {/* Placeholder for map */}
                <iframe 
                  src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Ogwashi-Uku,%20Delta%20State+(The%20Choice%20ICON%20Schools)&t=&z=14&ie=UTF8&iwloc=B&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                ></iframe>
                {/* Maps Button */}
                <a 
                  href="https://www.google.com/maps/place/The+Choice+ICON+Schools/@6.1861331,6.5262925,17z/data=!3m1!4b1!4m6!3m5!1s0x1043e5b50c4631a9:0xad0e881adb6e7881!8m2!3d6.1861331!4d6.5262925!16s%2Fg%2F11rsr5w5rr?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded shadow-md transition-all duration-200 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Maps
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} The Choice ICON Schools. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      <ChatBot />
      <FloatingWhatsApp />
    </div>
  );
}
