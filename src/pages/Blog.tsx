import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  if (selectedPost) {
    return (
      <>
        <Helmet>
          <title>{selectedPost.title} | The Choice ICON Schools</title>
          <meta name="description" content={selectedPost.excerpt} />
          {/* Open Graph tags for social sharing */}
          <meta property="og:title" content={selectedPost.title} />
          <meta property="og:description" content={selectedPost.excerpt} />
          <meta property="og:image" content={selectedPost.image_url} />
        </Helmet>

        <div className="bg-white py-16 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button 
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-navy-blue font-bold mb-8 hover:text-sky-blue transition-colors"
            >
              <ArrowLeft size={20} /> Back to Blog
            </button>

            <article>
              <div className="h-[400px] rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="bg-sky-blue/10 text-sky-blue px-3 py-1 rounded-full font-bold">{selectedPost.category}</span>
                <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-navy-blue mb-6">{selectedPost.title}</h1>
              
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>{selectedPost.content}</p>
              </div>

              {selectedPost.additional_images && selectedPost.additional_images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-navy-blue mb-6">Gallery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.additional_images.map((img, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden h-64 shadow-md">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | The Choice ICON Schools</title>
        <meta name="description" content="Latest news, updates, and articles from The Choice ICON Schools." />
      </Helmet>

      <div className="bg-navy-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">School Blog</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">News & Updates</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow flex flex-col h-full group">
                <div className="h-48 overflow-hidden">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span className="bg-sky-blue/10 text-sky-blue px-2 py-1 rounded-full font-medium">{post.category}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <h3 
                    onClick={() => setSelectedPost(post)}
                    className="text-lg font-bold text-navy-blue mb-3 hover:text-sky-blue transition-colors cursor-pointer"
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="text-sky-blue font-semibold hover:text-deep-blue self-start flex items-center gap-1"
                  >
                    Read More &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
