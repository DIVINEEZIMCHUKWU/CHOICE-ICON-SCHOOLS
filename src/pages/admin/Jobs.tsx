import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Trash2, Download } from 'lucide-react';
import { api } from '../../utils/api';
import { supabase } from '../../lib/supabase';

interface JobApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  cover_letter: string;
  cv_url: string;
  created_at: string;
}

export default function AdminJobs() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('job_applications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setApplications((prev) => [payload.new as JobApplication, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setApplications((prev) => prev.filter((app) => app.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchApplications = async () => {
    try {
      console.log('💼 Fetching job applications data...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('💼 No token found');
        setApplications([]);
        setIsLoading(false);
        return;
      }

      const data = await api.getJobs(token);
      console.log('💼 Job applications data received:', data);
      setApplications(data.data || []);
    } catch (error) {
      console.error('💼 Error fetching job applications:', error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const { error } = await supabase
          .from('job_applications')
          .delete()
          .eq('id', id);

        if (error) throw error;
        // State update handled by realtime subscription
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const handleCVDownload = (cvUrl: string, applicantName: string) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = `${applicantName.replace(/\s+/g, '_')}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApplications = applications.filter(app =>
    app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Job Applications | Admin Panel</title>
      </Helmet>
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Job Applications</h2>
          <p className="text-sm text-gray-500">Review and manage applications for teaching and staff positions.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search applicants..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-blue/20 focus:border-sky-blue outline-none w-full text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applicant</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Position</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">Loading applications...</td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">No applications found</td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-navy-blue">{app.full_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-[10px] font-bold rounded-full bg-purple-50 text-purple-600 uppercase tracking-wider">
                        {app.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 break-all max-w-xs" title={app.email}>{app.email}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {app.cv_url && (
                          <button
                            onClick={() => handleCVDownload(app.cv_url, app.full_name)}
                            className="text-sky-blue hover:text-deep-blue p-2 hover:bg-sky-50 rounded-lg transition-colors inline-flex items-center gap-1"
                            title="Download CV"
                          >
                            <Download size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
