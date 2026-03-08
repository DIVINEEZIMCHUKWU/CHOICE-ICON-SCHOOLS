import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/auth/me', { headers });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
