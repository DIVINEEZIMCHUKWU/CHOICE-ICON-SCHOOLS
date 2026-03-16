import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Upload, Image as ImageIcon, Video, Plus, Youtube } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../../config/api';

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}

interface GalleryVideo {
  id: number;
  title: string;
  url: string;
  type: 'youtube' | 'googledrive';
  created_at: string;
}

export default function AdminGallery() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const { register: registerImage, handleSubmit: handleSubmitImage, reset: resetImage, formState: { errors: imageErrors } } = useForm();
  const { register: registerVideo, handleSubmit: handleSubmitVideo, reset: resetVideo, formState: { errors: videoErrors } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/gallery`, { headers });
      if (response.ok) {
        const data = await response.json();
        const images = data.data.filter((item: any) => item.type === 'image');
        const videos = data.data.filter((item: any) => item.type === 'video');
        setImages(images);
        setVideos(videos);
      } else {
        console.error('Failed to fetch gallery data');
      }
    } catch (error) {
      console.error('Error fetching gallery data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onImageSubmit = async (data: any) => {
    const file = data.image[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title || 'Gallery Image');
      formData.append('category', data.category || 'General');
      
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/gallery/image`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      fetchData();
      resetImage();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onVideoSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/gallery/video`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: data.title,
          url: data.url,
          type: data.url.includes('drive.google.com') ? 'googledrive' : 'youtube'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add video');
      }

      fetchData();
      resetVideo();
      alert('Video added successfully!');
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video.');
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/gallery/image/${id}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        fetchData();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image');
      }
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/gallery/video/${id}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          throw new Error('Failed to delete video');
        }

        fetchData();
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Gallery Manager | Admin Panel</title>
      </Helmet>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-blue">Gallery Manager</h2>
        <p className="text-sm text-gray-500">Manage school photos and videos.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('photos')}
          className={`pb-4 px-4 font-bold text-sm transition-colors relative ${
            activeTab === 'photos' ? 'text-navy-blue' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <ImageIcon size={18} /> Photos
          </div>
          {activeTab === 'photos' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-navy-blue rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-4 px-4 font-bold text-sm transition-colors relative ${
            activeTab === 'videos' ? 'text-navy-blue' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Video size={18} /> Videos
          </div>
          {activeTab === 'videos' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-navy-blue rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'photos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-navy-blue mb-4 flex items-center gap-2">
                <Upload size={20} /> Upload New Photo
              </h3>
              <form onSubmit={handleSubmitImage(onImageSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                  <input 
                    {...registerImage('title', { required: true })}
                    type="text"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                    placeholder="e.g. Science Lab Session"
                  />
                  {imageErrors.title && <span className="text-red-500 text-xs">Title is required</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select 
                    {...registerImage('category', { required: true })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                  >
                    <option value="Events">Events</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Students">Students</option>
                    <option value="Staff">Staff</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Image File</label>
                  <input 
                    {...registerImage('image', { required: true })}
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-navy-blue file:text-white hover:file:bg-deep-blue cursor-pointer"
                  />
                  {imageErrors.image && <span className="text-red-500 text-xs">Image is required</span>}
                </div>

                <button type="submit" className="w-full bg-navy-blue text-white py-3 rounded-xl font-bold hover:bg-deep-blue transition-all shadow-lg shadow-navy-blue/20 flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Photo
                </button>
              </form>
            </div>
          </div>

          {/* Image Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-navy-blue flex items-center gap-2">
                  <ImageIcon size={20} /> Photo Library
                </h3>
                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{images.length} Photos</span>
              </div>
              
              {isLoading ? (
                <p className="text-center text-gray-500 py-12">Loading images...</p>
              ) : images.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <ImageIcon size={48} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No images found. Upload your first photo!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="group relative rounded-xl overflow-hidden border border-gray-100 aspect-square shadow-sm hover:shadow-md transition-all">
                      <img 
                        src={image.image_url} 
                        alt={image.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <p className="text-white text-sm font-bold truncate">{image.title}</p>
                        <p className="text-gray-300 text-[10px] uppercase tracking-wider">{image.category}</p>
                        <button 
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-navy-blue mb-4 flex items-center gap-2">
                <Video size={20} /> Add New Video
              </h3>
              <form onSubmit={handleSubmitVideo(onVideoSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Video Title</label>
                  <input 
                    {...registerVideo('title', { required: true })}
                    type="text"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                    placeholder="e.g. Annual Sports Day"
                  />
                  {videoErrors.title && <span className="text-red-500 text-xs">Title is required</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Video URL</label>
                  <input 
                    {...registerVideo('url', { required: true })}
                    type="url"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Supports YouTube or Google Drive links</p>
                  {videoErrors.url && <span className="text-red-500 text-xs">URL is required</span>}
                </div>

                <button type="submit" className="w-full bg-navy-blue text-white py-3 rounded-xl font-bold hover:bg-deep-blue transition-all shadow-lg shadow-navy-blue/20 flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Video
                </button>
              </form>
            </div>
          </div>

          {/* Video List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-navy-blue flex items-center gap-2">
                  <Youtube size={20} /> Video Library
                </h3>
                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{videos.length} Videos</span>
              </div>
              
              {isLoading ? (
                <p className="text-center text-gray-500 py-12">Loading videos...</p>
              ) : videos.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Video size={48} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No videos found. Add your first video!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-sky-blue/30 hover:shadow-md transition-all group bg-white">
                      <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                        <Video size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-navy-blue truncate">{video.title}</h4>
                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-blue hover:underline truncate block">
                          {video.url}
                        </a>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1 inline-block bg-gray-50 px-2 py-0.5 rounded">
                          {video.type}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
