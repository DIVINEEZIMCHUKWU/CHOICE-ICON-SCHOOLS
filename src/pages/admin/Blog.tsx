import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Trash2, Edit, Plus, Image as ImageIcon, X, Save, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  image_url: string;
  additional_images?: string[];
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/blog`, { headers });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data);
      } else {
        console.error('Failed to fetch blog posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          throw new Error('Failed to delete post');
        }

        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setCurrentPost({
      title: '',
      category: '',
      excerpt: '',
      content: '',
      image_url: '',
      additional_images: [],
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const uploadImage = async (file: File, bucket: string = 'blog-images') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload error response:', errorData);
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    console.log('Upload success:', data);
    return data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const publicUrl = await uploadImage(file, 'blog-images');
        setCurrentPost({ ...currentPost, image_url: publicUrl });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        setUploading(true);
        const uploadPromises = Array.from(files).map(file => uploadImage(file, 'blog-images'));
        const urls = await Promise.all(uploadPromises);
        
        setCurrentPost(prev => ({
          ...prev,
          additional_images: [...(prev.additional_images || []), ...urls]
        }));
      } catch (error) {
        console.error('Error uploading gallery images:', error);
        alert('Failed to upload some images');
      } finally {
        setUploading(false);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setCurrentPost(prev => ({
      ...prev,
      additional_images: prev.additional_images?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (isEditing && currentPost.id) {
        const response = await fetch(`${API_BASE_URL}/blog/${currentPost.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            title: currentPost.title,
            category: currentPost.category,
            excerpt: currentPost.excerpt,
            content: currentPost.content,
            image_url: currentPost.image_url,
            additional_images: currentPost.additional_images
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update post');
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/blog`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: currentPost.title,
            category: currentPost.category,
            excerpt: currentPost.excerpt,
            content: currentPost.content,
            image_url: currentPost.image_url,
            additional_images: currentPost.additional_images
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create post');
        }
      }
      
      fetchPosts();
      setShowForm(false);
      setCurrentPost({});
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Blog Manager | Admin Panel</title>
      </Helmet>
      
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-blue">Blog Manager</h2>
          <p className="text-sm text-gray-500">Create, edit, and manage school blog posts and news.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search posts..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-blue/20 focus:border-sky-blue outline-none w-full text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-navy-blue text-white px-4 py-2 rounded-xl hover:bg-deep-blue transition-all text-sm font-bold shadow-lg shadow-navy-blue/20"
          >
            <Plus size={16} /> <span className="hidden sm:inline">New Post</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-navy-blue">{isEditing ? 'Edit Post' : 'Create New Post'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                    value={currentPost.title || ''}
                    onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                    value={currentPost.category || ''}
                    onChange={e => setCurrentPost({...currentPost, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Announcements">Announcements</option>
                    <option value="Education">Education</option>
                    <option value="Parenting / School Life">Parenting / School Life</option>
                    <option value="Events">Events</option>
                    <option value="News">News</option>
                    <option value="Student Stories">Student Stories</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Featured Image</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                    value={currentPost.image_url || ''}
                    onChange={e => setCurrentPost({...currentPost, image_url: e.target.value})}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                    title="Upload Image"
                  >
                    <Upload size={20} />
                  </button>
                </div>
                {currentPost.image_url && (
                  <div className="mt-2 h-32 w-full rounded-lg overflow-hidden bg-gray-100 relative group">
                    <img src={currentPost.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCurrentPost({...currentPost, image_url: ''})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gallery Images</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={galleryInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                  />
                  <button 
                    type="button" 
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-sky-blue hover:text-sky-blue transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={20} />
                    <span className="text-sm font-medium">Add More Images</span>
                  </button>
                </div>
                {currentPost.additional_images && currentPost.additional_images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {currentPost.additional_images.map((img, idx) => (
                      <div key={idx} className="h-20 rounded-lg overflow-hidden bg-gray-100 relative group">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove Image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Excerpt</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                  value={currentPost.excerpt || ''}
                  onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-blue/20 outline-none transition-all"
                  value={currentPost.content || ''}
                  onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-navy-blue text-white hover:bg-deep-blue font-bold shadow-lg shadow-navy-blue/20 transition-all flex items-center gap-2"
                >
                  <Save size={18} />
                  {isEditing ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No posts found. Create your first post!</div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={post.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(post)}
                    className="bg-white/90 p-2 rounded-full text-navy-blue hover:text-sky-blue shadow-sm backdrop-blur-sm"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="bg-white/90 p-2 rounded-full text-red-500 hover:text-red-600 shadow-sm backdrop-blur-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-navy-blue/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs text-gray-400 mb-2 font-medium">{new Date(post.date).toLocaleDateString()}</div>
                <h3 className="text-lg font-bold text-navy-blue mb-2 line-clamp-2 leading-tight">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">{post.excerpt}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
