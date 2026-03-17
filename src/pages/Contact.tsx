import React, { useState } from 'react';

import { Helmet } from 'react-helmet-async';

import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Facebook } from 'lucide-react';

import { api } from '../utils/api';



export default function Contact() {

  const [formData, setFormData] = useState({

    name: '',

    email: '',

    phone: '',

    message: ''

  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [error, setError] = useState('');



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setIsSubmitting(true);

    setError('');



    try {

      const responseData = await api.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      if (responseData.success) {

        setIsSubmitted(true);

        setFormData({ name: '', email: '', phone: '', message: '' });

      } else {

        throw new Error('Failed to submit form');

      }

    } catch (error) {

      setError('An error occurred. Please try again.');

    } finally {

      setIsSubmitting(false);

    }

  };

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



      <section className="py-12 sm:py-16 md:py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">

            

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



                {/* Social Media */}
                <div className="flex items-start gap-4">

                  <div className="bg-sky-blue/10 p-3 rounded-full text-sky-blue shrink-0">

                    <Facebook size={20} />

                  </div>

                  <div>

                    <h3 className="font-bold text-base text-navy-blue mb-1">Follow Us</h3>

                    <div className="flex gap-3">
                      <a 
                        href="https://www.facebook.com/thechoiceiconschools" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Facebook size={20} />
                      </a>
                      <p className="text-gray-600 text-sm">Connect with us on Facebook</p>
                    </div>

                  </div>

                </div>



                <div className="flex items-start gap-4">

                  <div className="bg-sky-blue/10 p-3 rounded-full text-sky-blue shrink-0">

                    <Clock size={20} />

                  </div>

                  <div>

                    <h3 className="font-bold text-base text-navy-blue mb-1">School Hours</h3>

                    <p className="text-gray-600 text-sm">Monday - Friday: 7:00 AM - 3:00 PM</p>

                  </div>

                </div>

              </div>

            </div>



            {/* Map */}

            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200">

              <iframe 

                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=ICON+Avenue+Off+Delta+State+Polytechnic+Road+Behind+Joanchim+Filling+Station+Ogwashi-Uku+Delta+State+Nigeria&output=embed" 

                width="100%" 

                height="100%" 

                style={{border:0}} 

                allowFullScreen 

                loading="lazy" 

                referrerPolicy="no-referrer-when-downgrade"

              ></iframe>

              {/* Open in Maps Button */}
              <a 
                href="https://www.google.com/maps/search/ICON+Avenue+Off+Delta+State+Polytechnic+Road+Behind+Joanchim+Filling+Station+Ogwashi-Uku+Delta+State+Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-navy-blue px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-md transition-all duration-200 text-xs sm:text-sm font-medium flex items-center gap-2 hover:shadow-lg"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Open in Maps
              </a>

            </div>



          </div>

        </div>

      </section>



      {/* Contact Form Section */}

      <section className="py-20 bg-gray-50">

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold text-navy-blue mb-4">Send Us a Message</h2>

            <p className="text-gray-600">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

          </div>



          {isSubmitted ? (

            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">

              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

              <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>

              <p className="text-green-600">Thank you for contacting us. We'll get back to you within 24-48 hours.</p>

            </div>

          ) : (

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

              {error && (

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">

                  <p className="text-red-600">{error}</p>

                </div>

              )}



              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>

                  <input

                    type="text"

                    name="name"

                    value={formData.name}

                    onChange={handleChange}

                    required

                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                    placeholder="Your full name"

                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>

                  <input

                    type="email"

                    name="email"

                    value={formData.email}

                    onChange={handleChange}

                    required

                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                    placeholder="your.email@example.com"

                  />

                </div>

              </div>



              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>

                <input

                  type="tel"

                  name="phone"

                  value={formData.phone}

                  onChange={handleChange}

                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                  placeholder="+234-XXX-XXX-XXXX"

                />

              </div>



              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>

                <textarea

                  name="message"

                  value={formData.message}

                  onChange={handleChange}

                  required

                  rows={5}

                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all resize-none"

                  placeholder="Tell us how we can help you..."

                />

              </div>



              <button

                type="submit"

                disabled={isSubmitting}

                className="w-full bg-sky-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-sky-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

              >

                {isSubmitting ? (

                  <>

                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                    Sending...

                  </>

                ) : (

                  <>

                    <Send size={20} />

                    Send Message

                  </>

                )}

              </button>

            </form>

          )}

        </div>

      </section>

    </>

  );

}

