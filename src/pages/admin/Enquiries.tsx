import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Trash2, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('enquiries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setEnquiries((prev) => [payload.new as Enquiry, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setEnquiries((prev) => prev.filter((enquiry) => enquiry.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const { error } = await supabase
          .from('enquiries')
          .delete()
          .eq('id', id);

        if (error) throw error;
        // State update handled by realtime subscription
      } catch (error) {
        console.error('Error deleting enquiry:', error);
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{enquiry.email}</div>
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
