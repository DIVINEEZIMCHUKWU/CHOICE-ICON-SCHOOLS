import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fallbackImages = [
    { id: 101, title: 'School Campus', category: 'Facilities', image_url: '/Images/0.jpg' },
    { id: 102, title: 'Learning Environment', category: 'Facilities', image_url: '/Images/24.jpg' },
    { id: 103, title: 'Modern Facilities', category: 'Facilities', image_url: '/Images/25.jpg' },
    { id: 104, title: 'Academic Excellence', category: 'Facilities', image_url: '/Images/26.jpg' },
    { id: 105, title: 'Student Life', category: 'Facilities', image_url: '/Images/27.jpg' },
    { id: 106, title: 'School Activities', category: 'Facilities', image_url: '/Images/23.jpg' }
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

  // All images from Images folder for Photo Gallery (excluding specified ones)
  const allGalleryImages = [
    { id: 201, title: 'School View 0', category: 'Gallery', image_url: '/Images/0.jpg' },
    { id: 202, title: 'School View 1', category: 'Gallery', image_url: '/Images/1.jpg' },
    { id: 203, title: 'School View 2', category: 'Gallery', image_url: '/Images/2.jpg' },
    { id: 204, title: 'School View 4', category: 'Gallery', image_url: '/Images/4.jpg' },
    { id: 205, title: 'School View 5', category: 'Gallery', image_url: '/Images/5.jpg' },
    { id: 206, title: 'School View 6', category: 'Gallery', image_url: '/Images/6.jpg' },
    { id: 207, title: 'School View 7', category: 'Gallery', image_url: '/Images/7.jpg' },
    { id: 208, title: 'School View 8', category: 'Gallery', image_url: '/Images/8.jpg' },
    { id: 209, title: 'School View 10', category: 'Gallery', image_url: '/Images/10.jpg' },
    { id: 210, title: 'School View 11', category: 'Gallery', image_url: '/Images/11.jpg' },
    { id: 211, title: 'School View 12', category: 'Gallery', image_url: '/Images/12.jpg' },
    { id: 212, title: 'School View 13', category: 'Gallery', image_url: '/Images/13.jpg' },
    { id: 213, title: 'School View 14', category: 'Gallery', image_url: '/Images/14.jpg' },
    { id: 214, title: 'School View 15', category: 'Gallery', image_url: '/Images/15.jpg' },
    { id: 215, title: 'School View 16', category: 'Gallery', image_url: '/Images/16.jpg' },
    { id: 216, title: 'School View 17', category: 'Gallery', image_url: '/Images/17.jpg' },
    { id: 217, title: 'School View 19', category: 'Gallery', image_url: '/Images/19.jpg' },
    { id: 218, title: 'School View 21', category: 'Gallery', image_url: '/Images/21.jpg' },
    { id: 219, title: 'School View 22', category: 'Gallery', image_url: '/Images/22.jpg' },
    { id: 220, title: 'School View 23', category: 'Gallery', image_url: '/Images/23.jpg' },
    { id: 221, title: 'School View 24', category: 'Gallery', image_url: '/Images/24.jpg' },
    { id: 222, title: 'School View 25', category: 'Gallery', image_url: '/Images/25.jpg' },
    { id: 223, title: 'School View 26', category: 'Gallery', image_url: '/Images/26.jpg' },
    { id: 224, title: 'School View 27', category: 'Gallery', image_url: '/Images/27.jpg' },
    { id: 225, title: 'Science Laboratory', category: 'Gallery', image_url: '/Images/Science.jpg' },
    { id: 226, title: 'Science Lab 2', category: 'Gallery', image_url: '/Images/Science 2.jpg' }
  ];

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
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
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
            {allGalleryImages.map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg aspect-video cursor-pointer">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-navy-blue/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedImage(item.image_url)}
                    className="text-white font-bold text-lg border border-white px-6 py-2 rounded-full hover:bg-white hover:text-navy-blue transition-colors"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Full size image" 
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
