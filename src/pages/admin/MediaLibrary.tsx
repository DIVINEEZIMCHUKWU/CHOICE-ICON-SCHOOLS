import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Upload, Trash2, Download, Eye, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: number;
  created_at: string;
}

export default function AdminMediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('media_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      const fileType = file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 'document';

      const { error: insertError } = await supabase
        .from('media_links')
        .insert([{
          title: file.name,
          url: publicUrl,
          type: fileType
        }]);

      if (insertError) throw insertError;

      fetchMediaFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await supabase
        .from('media_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMediaFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const filteredFiles = mediaFiles.filter(file =>
    file.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} />;
      case 'video': return <Video size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Media Library | Admin Panel</title>
      </Helmet>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-blue">Media Library</h2>
        <p className="text-gray-600">Manage your images, videos, and documents</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search media files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none"
              />
            </div>
            <label className="bg-sky-blue hover:bg-sky-blue/90 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-2">
              <Upload size={16} />
              {uploading ? 'Uploading...' : 'Upload File'}
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-blue"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No media files found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    {file.type === 'image' ? (
                      <img src={file.url} alt={file.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-gray-400">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 truncate mb-2">{file.title}</h4>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="text-sky-blue hover:text-sky-blue/70 text-sm"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{selectedFile.title}</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {selectedFile.type === 'image' ? (
                <img src={selectedFile.url} alt={selectedFile.title} className="w-full h-auto" />
              ) : (
                <div className="text-center py-12">
                  {getFileIcon(selectedFile.type)}
                  <p className="mt-4 text-gray-600">Preview not available</p>
                  <a
                    href={selectedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 bg-sky-blue text-white px-4 py-2 rounded-lg hover:bg-sky-blue/90"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
