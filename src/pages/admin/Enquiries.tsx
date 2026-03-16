import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Trash2, Mail, CheckCircle } from 'lucide-react';
import { api } from '../../utils/api';

interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  type: string;
  created_at: string;
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      console.log('📧 Fetching enquiries data...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('📧 No token found');
        setEnquiries([]);
        setIsLoading(false);
        return;
      }

      const data = await api.getEnquiries(token);
      console.log('📧 Enquiries data received:', data);
      setEnquiries(data.data || []);
    } catch (error) {
      console.error('📧 Error fetching enquiries:', error);
      setEnquiries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication required. Please login again.');
          return;
        }

        await api.deleteEnquiry(id.toString(), token);
        fetchEnquiries();
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        alert('Failed to delete enquiry. Please try again.');
      }
    }
  };

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredEnquiries = enquiries.filter(enquiry =>
    enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Enquiries | Admin Panel</title>
      </Helmet>
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Visitor Enquiries</h2>
          <p className="text-sm text-gray-500">View and respond to messages from website visitors.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search enquiries..."
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
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">Loading enquiries...</td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No enquiries found</td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-navy-blue">{enquiry.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 break-all max-w-xs" title={enquiry.email}>{enquiry.email}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{enquiry.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-[10px] font-bold rounded-full bg-sky-50 text-sky-600 uppercase tracking-wider">
                        {enquiry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{enquiry.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleReply(enquiry.email)} 
                          className="text-gray-400 hover:text-sky-blue transition-colors p-2 hover:bg-sky-50 rounded-lg" 
                          title="Reply via Email"
                        >
                          <Mail size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(enquiry.id)} 
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
