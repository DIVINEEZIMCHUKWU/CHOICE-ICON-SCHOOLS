import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, GraduationCap, Baby, Pencil } from 'lucide-react';

export default function Academics() {
  const levels = [
    {
      title: 'Early Years',
      icon: <Baby size={40} className="text-white" />,
      description: 'Our Early Years program focuses on learning through play, social development, and basic literacy and numeracy skills.',
      color: 'bg-pink-500'
    },
    {
      title: 'Nursery',
      icon: <Pencil size={40} className="text-white" />,
      description: 'The Nursery section builds on the foundation, introducing more structured learning while maintaining a fun and engaging environment.',
      color: 'bg-orange-500'
    },
    {
      title: 'Primary',
      icon: <BookOpen size={40} className="text-white" />,
      description: 'Our Primary curriculum is robust, covering core subjects and extracurricular activities to ensure holistic development.',
      color: 'bg-green-500'
    },
    {
      title: 'Secondary',
      icon: <GraduationCap size={40} className="text-white" />,
      description: 'The Secondary school prepares students for national and international examinations, focusing on academic excellence and leadership.',
      color: 'bg-blue-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Academics | The Choice ICON Schools</title>
        <meta name="description" content="Explore our academic programs from Early Years to Secondary school, featuring the Nigeria-British curriculum." />
      </Helmet>

      <div className="bg-navy-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Academics</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Excellence in Teaching and Learning</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-2xl font-bold text-navy-blue mb-6">Nigeria British Curriculum</h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                The school operates a hybrid curriculum consisting of Nigeria British. This unique blend allows us to offer the best of both worlds, ensuring our students are grounded in their local context while being globally competitive.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                Our institution is comprised of highly motivated and experienced teachers who received continual professional development and schedule training session often.
              </p>
            </div>
            <div className="bg-sky-blue/10 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-navy-blue mb-4">Why Our Curriculum Works</h3>
              <ul className="space-y-3">
                {['Global Standards', 'Cultural Relevance', 'Critical Thinking', 'Practical Application', 'Holistic Development'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-sky-blue rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {levels.map((level, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`${level.color} p-6 flex justify-center items-center`}>
                  {level.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-navy-blue mb-3">{level.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{level.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
