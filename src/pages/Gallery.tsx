import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  image_url: string;
}

interface MediaLink {
  id: number;
  title: string;
  url: string;
  type: 'youtube' | 'googledrive';
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<MediaLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImages = [
    { id: 101, title: 'ICT Laboratory', category: 'Facilities', image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' },
    { id: 102, title: 'Science Laboratory', category: 'Facilities', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop' },
    { id: 103, title: 'School Environment', category: 'Facilities', image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2064&auto=format&fit=crop' },
    { id: 104, title: 'Classrooms', category: 'Facilities', image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop' },
    { id: 105, title: 'Transport System', category: 'Facilities', image_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop' },
    { id: 106, title: 'Healing Bay', category: 'Facilities', image_url: 'https://plus.unsplash.com/premium_photo-1661281397737-9b5d75b52beb?q=80&w=2069&auto=format&fit=crop' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: imagesData, error: imagesError } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (imagesError) throw imagesError;
        setImages(imagesData && imagesData.length > 0 ? imagesData : fallbackImages);

        const { data: videosData, error: videosError } = await supabase
          .from('gallery_videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (videosError) throw videosError;
        setVideos(videosData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setImages(fallbackImages);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayImages = images.length > 0 ? images : fallbackImages;

  const getYoutubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <>
      <Helmet>
        <title>School Gallery | The Choice ICON Schools</title>
        <meta name="description" content="Explore our school gallery including ICT labs, science labs, and serene learning environment." />
      </Helmet>

      <div className="bg-navy-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">School Gallery</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">A Glimpse into Our World</p>
        </div>
      </div>

      {/* Virtual Tour Slider */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Take a Virtual Tour</h2>
            <p className="text-gray-400 text-sm">Experience our campus from anywhere.</p>
          </div>
          
          <div className="h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              className="h-full w-full"
            >
              {displayImages.slice(0, 4).map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative h-full w-full group">
                    <img src={item.image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      {videos.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy-blue mb-12 text-center">Video Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="aspect-video">
                    {video.type === 'youtube' ? (
                      <iframe
                        src={getYoutubeEmbedUrl(video.url)}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <iframe
                        src={video.url.replace('/view', '/preview')}
                        title={video.title}
                        className="w-full h-full"
                        allow="autoplay"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-navy-blue text-base">{video.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {video.type === 'youtube' ? 'YouTube Video' : 'Google Drive Video'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-blue mb-12 text-center">Photo Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayImages.map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg aspect-video cursor-pointer">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-navy-blue/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg border border-white px-6 py-2 rounded-full hover:bg-white hover:text-navy-blue transition-colors">
                    View {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
