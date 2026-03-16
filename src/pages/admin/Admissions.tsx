import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, FileText, CheckCircle, Download, Search, Trash2 } from 'lucide-react';
import { api } from '../../utils/api';

interface Admission {
  id: number;
  applicant_name: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      console.log('🎓 Fetching admissions data...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('🎓 No token found');
        setAdmissions([]);
        setIsLoading(false);
        return;
      }

      const data = await api.getAdmissions(token);
      console.log('🎓 Admissions data received:', data);
      setAdmissions(data.data || []);
    } catch (error) {
      console.error('🎓 Error fetching admissions:', error);
      setAdmissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication required. Please login again.');
          return;
        }

        await api.deleteAdmission(id.toString(), token);
        fetchAdmissions();
      } catch (error) {
        console.error('Error deleting admission:', error);
        alert('Failed to delete admission. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      await api.updateAdmission(id.toString(), { status: newStatus }, token);
      fetchAdmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const filteredAdmissions = admissions.filter(admission =>
    admission.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admission.phone.includes(searchTerm)
  );

  const exportCSV = () => {
    const headers = ['ID,Name,Phone,Message,Status,Date'];
    const rows = filteredAdmissions.map(a => 
      `${a.id},"${a.applicant_name}","${a.phone}","${a.message}","${a.status}","${new Date(a.created_at).toLocaleDateString()}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admissions.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <Helmet>
        <title>Admissions | Admin Panel</title>
      </Helmet>
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Admissions</h2>
          <p className="text-sm text-gray-500">Manage student admission enquiries and applications.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search applicants..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-blue/20 focus:border-sky-blue outline-none w-full text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all text-sm font-bold shadow-lg shadow-emerald-500/20"
          >
            <Download size={16} /> <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applicant</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">Loading admissions...</td>
                </tr>
              ) : filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No admissions found</td>
                </tr>
              ) : (
                filteredAdmissions.map((admission) => (
                  <tr key={admission.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-navy-blue">{admission.applicant_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{admission.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{admission.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={admission.status}
                        onChange={(e) => handleStatusChange(admission.id, e.target.value)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-sky-blue/20 cursor-pointer uppercase tracking-wider
                          ${admission.status === 'New' ? 'bg-blue-50 text-blue-600' : 
                            admission.status === 'Contacted' ? 'bg-amber-50 text-amber-600' : 
                            admission.status === 'Application in Progress' ? 'bg-purple-50 text-purple-600' : 
                            'bg-emerald-50 text-emerald-600'}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Application in Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admission.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(admission.id)} 
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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
