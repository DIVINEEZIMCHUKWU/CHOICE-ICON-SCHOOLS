import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-10"></div>
            <h1 className="text-lg md:text-xl font-bold text-navy-blue">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-navy-blue">Admin User</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Super Admin</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-sky-blue/10 text-sky-blue rounded-full flex items-center justify-center font-bold border border-sky-blue/20">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
