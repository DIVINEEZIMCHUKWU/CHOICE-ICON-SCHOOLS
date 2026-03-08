import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function Team() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const team = [
    {
      name: 'Emmanuel M. Odiniya',
      role: 'Principal',
      img: '/Images/PRINCIPAL.jpg'
    },
    // Academic Staff Members
    {
      name: 'Academic Staff Members',
      role: 'Teaching Staff',
      img: '/Images/31.jpg'
    },
    {
      name: 'Academic Staff Members',
      role: 'Teaching Staff',
      img: '/Images/Staff ICON.jpg'
    },
    // Support Staff Members
    {
      name: 'Support Staff Members',
      role: 'Non-Teaching Staff',
      img: '/Images/29.jpg'
    },
    {
      name: 'Support Staff Members',
      role: 'Non-Teaching Staff',
      img: '/Images/30.jpg'
    },
    {
      name: 'Support Staff Members',
      role: 'Non-Teaching Staff',
      img: '/Images/28.jpg'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Team | The Choice ICON Schools</title>
        <meta name="description" content="Meet the dedicated team behind The Choice ICON Schools." />
      </Helmet>

      <div className="bg-navy-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Dedicated Professionals</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow group">
                <div className="h-80 overflow-hidden relative">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-navy-blue/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => setSelectedImage(member.img)}
                      className="text-white font-bold text-lg border border-white px-6 py-2 rounded-full hover:bg-white hover:text-navy-blue transition-colors"
                    >
                      VIEW
                    </button>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-navy-blue mb-1">{member.name}</h3>
                  <p className="text-sky-blue text-sm font-medium">{member.role}</p>
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
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Full size team member image" 
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
