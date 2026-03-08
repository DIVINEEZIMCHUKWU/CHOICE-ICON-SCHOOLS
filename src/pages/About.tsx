import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | The Choice ICON Schools</title>
        <meta name="description" content="Learn about The Choice ICON Schools, our history, mission, vision, and educational philosophy." />
      </Helmet>

      {/* Header */}
      <div className="bg-navy-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Grooming Icons for the Future</p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold text-navy-blue mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  Welcome to The Choice ICON Schools! We are academically selective schools offering Nigeria British curriculum.
                </p>
                <p>
                  The birth of this great institution was borne out of passion, desire and a sense of duty. It is a divine project and the outcome of inspiration and revelation.
                </p>
                <p>
                  It is an institution with a mandate to steer our young ones away from moral and intellectual decadence.
                </p>
                <p className="italic border-l-4 border-sky-blue pl-4 my-6 text-gray-800">
                  The scripture admonishes us to train up a child in the way he should go, even when he is old he will not depart from it. (Proverb 22:6).
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-sky-blue/10 rounded-2xl transform rotate-3"></div>
              <img 
                src="/Images/13.jpg" 
                alt="School Building" 
                className="relative rounded-2xl shadow-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-navy-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
              <h3 className="text-2xl font-bold mb-6 text-sky-blue">Our Mission</h3>
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                The Choice ICON Schools is committed to providing a challenging and rigorous curriculum that helps each student progress at a developmentally appropriate rate and provides a safe environment for all students.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
              <h3 className="text-2xl font-bold mb-6 text-sky-blue">Our Vision</h3>
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                To become a leading International Best Practice Schools, connecting and impacting our students to do great things in life and to produce future ICONS through dynamic teaching and learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-navy-blue mb-4">Our Educational Philosophy</h2>
            <div className="w-16 h-1 bg-sky-blue mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-sky-blue/10 rounded-full flex items-center justify-center text-sky-blue mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-navy-blue mb-4">Child Development</h3>
              <p className="text-gray-600 text-sm">
                We believe in providing a challenging and rigorous curriculum that helps each student progress at a developmentally appropriate rate.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-sky-blue/10 rounded-full flex items-center justify-center text-sky-blue mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-navy-blue mb-4">Safe Environment</h3>
              <p className="text-gray-600 text-sm">
                We are committed to providing a safe, conducive, and serene environment for all students to thrive academically and socially.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-sky-blue/10 rounded-full flex items-center justify-center text-sky-blue mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-navy-blue mb-4">Moral Instruction</h3>
              <p className="text-gray-600 text-sm">
                Beyond academics, we prioritize counselling and moral instruction to build character and integrity in our future icons.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
