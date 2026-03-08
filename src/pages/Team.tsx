import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Team() {
  const team = [
    {
      name: 'Emmanuel M. Odiniya',
      role: 'Principal',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1974&auto=format&fit=crop'
    },
    // Placeholders for other staff
    {
      name: 'Academic Staff',
      role: 'Teaching Staff',
      img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'
    },
    {
      name: 'Support Staff',
      role: 'Non-Teaching Staff',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop'
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
                <div className="h-80 overflow-hidden">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
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
    </>
  );
}
