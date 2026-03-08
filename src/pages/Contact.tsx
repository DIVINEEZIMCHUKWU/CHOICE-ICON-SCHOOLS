import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | The Choice ICON Schools</title>
        <meta name="description" content="Get in touch with The Choice ICON Schools. Visit us in Ogwashi-Uku, Delta State." />
      </Helmet>

      <div className="bg-navy-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">We'd Love to Hear From You</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-navy-blue mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-sky-blue/10 p-3 rounded-full text-sky-blue shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-navy-blue mb-1">Visit Us</h3>
                    <p className="text-gray-600 text-sm">
                      ICON Avenue, off Delta State Polytechnic Road<br />
                      Behind Joanchim Filling Station<br />
                      Ogwashi-Uku, Delta State
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-sky-blue/10 p-3 rounded-full text-sky-blue shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-navy-blue mb-1">Call Us</h3>
                    <p className="text-gray-600 text-sm">+234-806-9077-937 / +234-810-7601-537</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-sky-blue/10 p-3 rounded-full text-sky-blue shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-navy-blue mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm">thechoiceiconschools@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-sky-blue/10 p-3 rounded-full text-sky-blue shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-navy-blue mb-1">Office Hours</h3>
                    <p className="text-gray-600 text-sm">Monday - Friday: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <iframe 
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Ogwashi-Uku,%20Delta%20State+(The%20Choice%20ICON%20Schools)&t=&z=14&ie=UTF8&iwloc=B&output=embed" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
