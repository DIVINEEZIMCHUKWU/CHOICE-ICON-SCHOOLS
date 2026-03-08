import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Events from './pages/Events';
import FAQ from './pages/FAQ';

import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminAdmissions from './pages/admin/Admissions';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminGallery from './pages/admin/Gallery';
import AdminJobs from './pages/admin/Jobs';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminEvents from './pages/admin/Events';
import AdminMediaLibrary from './pages/admin/MediaLibrary';
import AdminContentManager from './pages/admin/ContentManager';
import AdminSettings from './pages/admin/Settings';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminBlog from './pages/admin/Blog';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/academics" element={<Layout><Academics /></Layout>} />
          <Route path="/admissions" element={<Layout><Admissions /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/team" element={<Layout><Team /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admissions" element={<AdminAdmissions />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="content" element={<AdminContentManager />} />
              <Route path="media" element={<AdminMediaLibrary />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
