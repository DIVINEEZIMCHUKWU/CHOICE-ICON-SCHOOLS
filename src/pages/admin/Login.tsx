import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/admin/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | The Choice ICON Schools</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-navy-blue rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-navy-blue/20">
              IC
            </div>
            <h2 className="text-2xl font-bold text-navy-blue">Admin Login</h2>
            <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-medium">The Choice ICON Schools</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="admin@example.com"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-blue/20 focus:border-sky-blue outline-none transition-all text-sm"
              />
              {errors.email && <span className="text-red-500 text-[10px] font-bold mt-1 block uppercase tracking-wide">{errors.email.message as string}</span>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-blue/20 focus:border-sky-blue outline-none transition-all text-sm"
              />
              {errors.password && <span className="text-red-500 text-[10px] font-bold mt-1 block uppercase tracking-wide">{errors.password.message as string}</span>}
            </div>
            <button
              type="submit"
              className="w-full bg-navy-blue hover:bg-deep-blue text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-navy-blue/20 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} The Choice ICON Schools
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
