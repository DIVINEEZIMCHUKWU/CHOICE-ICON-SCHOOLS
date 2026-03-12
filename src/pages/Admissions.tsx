import React, { useState } from 'react';

import { Helmet } from 'react-helmet-async';

import { useForm } from 'react-hook-form';

import { CheckCircle, Download, ChevronDown } from 'lucide-react';

import { supabase } from '../lib/supabase';



export default function Admissions() {

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  const { register: registerFeedback, handleSubmit: handleSubmitFeedback, reset: resetFeedback } = useForm();

  

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showProspectusMenu, setShowProspectusMenu] = useState(false);

  

  const source = watch('source');



  const onSubmit = async (data: any) => {

    try {

      const message = `Reason: ${data.reason}\nSource: ${data.source}\nReferral: ${data.referralName || 'N/A'}\nOther Source: ${data.otherSource || 'N/A'}\nNote: ${data.note}`;

      

      const response = await fetch('/api/admission', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          name: data.fullName,

          email: data.email || '',

          phone: data.phone,

          message: message,

        }),

      });



      if (!response.ok) {

        throw new Error('Failed to submit admission enquiry');

      }



      setIsSubmitted(true);

      reset();

    } catch (error) {

      console.error('Error submitting enquiry:', error);

      alert('An error occurred. Please try again.');

    }

  };



  const onSubmitFeedback = async (data: any) => {

    try {

      const response = await fetch('/api/feedback', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          name: data.name,

          phone: data.phone,

          email: data.email || '',

          message: data.message,

        }),

      });



      if (!response.ok) {

        throw new Error('Failed to submit feedback');

      }



      alert('Feedback submitted successfully!');

      resetFeedback();

    } catch (error) {

      console.error('Error submitting feedback:', error);

      alert('Failed to submit feedback.');

    }

  };

  const handleDownloadProspectus = (prospectusFile: string) => {
    const link = document.createElement('a');
    link.href = `/Images/${prospectusFile}`;
    link.download = prospectusFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowProspectusMenu(false);
  };

  return (

    <>

      <Helmet>

        <title>Admissions | The Choice ICON Schools</title>

        <meta name="description" content="Apply for admission into The Choice ICON Schools. Early Years, Nursery, Primary and Secondary admissions open." />

      </Helmet>



      <div className="bg-navy-blue text-white py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admissions Open</h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Join the Icon Family</p>

        </div>

      </div>



      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            

            {/* Main Form */}

            <div className="lg:col-span-2">

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">

                <h2 className="text-xl font-bold text-navy-blue mb-6">Visitors Enquiry Form</h2>

                

                {isSubmitted ? (

                  <div className="bg-green-50 text-green-800 p-6 rounded-xl flex flex-col items-center text-center">

                    <CheckCircle size={48} className="mb-4 text-green-500" />

                    <h3 className="text-xl font-bold mb-2">Enquiry Submitted!</h3>

                    <p>Thank you for your interest. Our admissions team will contact you shortly.</p>

                    <p className="mt-4 text-sm font-mono bg-white px-3 py-1 rounded border border-green-200">Your Tracking ID: 12345</p>

                    <button onClick={() => setIsSubmitted(false)} className="mt-6 text-green-600 font-semibold hover:underline">Submit another enquiry</button>

                  </div>

                ) : (

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>

                        <input 

                          {...register('fullName', { required: true })}

                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                          placeholder="Terry Mike"

                        />

                        {errors.fullName && <span className="text-red-500 text-xs">This field is required</span>}

                      </div>

                      <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>

                        <input 

                          {...register('phone', { required: true })}

                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                          placeholder="+234..."

                        />

                        {errors.phone && <span className="text-red-500 text-xs">This field is required</span>}

                      </div>

                    </div>

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>

                      <input 

                        {...register('email', { required: true })}

                        type="email"

                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                        placeholder="your.email@example.com"

                      />

                      {errors.email && <span className="text-red-500 text-xs">This field is required</span>}

                    </div>



                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Enquiry</label>

                      <select 

                        {...register('reason', { required: true })}

                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                      >

                        <option value="Admission">Admission</option>

                        <option value="Recruitment">Recruitment</option>

                        <option value="Contractor">Contractor</option>

                        <option value="Other">Other</option>

                      </select>

                    </div>



                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>

                      <select 

                        {...register('source', { required: true })}

                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                      >

                        <option value="Social Media">Social Media</option>

                        <option value="Online Search">Online Search</option>

                        <option value="Television / Radio / Flyer">Television / Radio / Flyer</option>

                        <option value="Family or Friend Referral">Family or Friend Referral</option>

                        <option value="Others">Others</option>

                      </select>



                      {source === 'Family or Friend Referral' && (

                        <div className="mt-4 animate-fade-in-up">

                          <label className="block text-sm font-medium text-gray-700 mb-1">Name of Referral</label>

                          <input 

                            {...register('referralName', { required: true })}

                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                            placeholder="Enter name of referral"

                          />

                        </div>

                      )}



                      {source === 'Others' && (

                        <div className="mt-4 animate-fade-in-up">

                          <label className="block text-sm font-medium text-gray-700 mb-1">Please Specify</label>

                          <input 

                            {...register('otherSource', { required: true })}

                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                            placeholder="Please specify"

                          />

                        </div>

                      )}

                    </div>



                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Note</label>

                      <textarea 

                        {...register('note', { required: true })}

                        rows={4}

                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                        placeholder="Please provide details..."

                      ></textarea>

                      {errors.note && <span className="text-red-500 text-xs">This field is required</span>}

                    </div>



                    <button type="submit" className="w-full bg-sky-blue hover:bg-deep-blue text-white font-bold py-3 rounded-lg transition-colors shadow-lg">

                      Submit Enquiry

                    </button>

                  </form>

                )}

              </div>

            </div>



            {/* Sidebar */}

            <div className="space-y-8">

              {/* Prospectus */}

              <div className="bg-deep-blue text-white p-6 rounded-2xl shadow-lg relative">

                <h3 className="text-lg font-bold mb-2">School Prospectus</h3>

                <p className="text-sm text-gray-300 mb-4">Download our detailed prospectus to learn more about our curriculum and facilities.</p>

                <div className="relative">

                  <button 

                    onClick={() => setShowProspectusMenu(!showProspectusMenu)}

                    className="w-full bg-white text-navy-blue py-3 rounded-lg font-bold hover:bg-sky-blue hover:text-white transition-colors flex items-center justify-center gap-2"

                  >

                    <Download size={18} /> Select Prospectus <ChevronDown size={16} />

                  </button>

                  {showProspectusMenu && (

                    <div className="absolute top-full mt-2 w-full bg-white text-navy-blue rounded-lg shadow-lg overflow-hidden z-10">

                      <button

                        onClick={() => handleDownloadProspectus('EARLY YEARS & NURSERY SCHOOL PROSPECTUS.pdf')}

                        className="w-full px-4 py-3 text-left hover:bg-sky-blue hover:text-white transition-colors flex items-center gap-2 border-b border-gray-200"

                      >

                        <Download size={16} /> Early Years & Nursery

                      </button>

                      <button

                        onClick={() => handleDownloadProspectus('PRIMARY SCHOOL PROSPECTUS.pdf')}

                        className="w-full px-4 py-3 text-left hover:bg-sky-blue hover:text-white transition-colors flex items-center gap-2 border-b border-gray-200"

                      >

                        <Download size={16} /> Primary School

                      </button>

                      <button

                        onClick={() => handleDownloadProspectus('SECONDARY SCHOOL PROSPECTUS.pdf')}

                        className="w-full px-4 py-3 text-left hover:bg-sky-blue hover:text-white transition-colors flex items-center gap-2"

                      >

                        <Download size={16} /> Secondary School

                      </button>

                    </div>

                  )}

                </div>

              </div>



              {/* Classes */}

              <div className="bg-white p-6 rounded-2xl border border-gray-200">

                <h3 className="text-lg font-bold text-navy-blue mb-4">Available Classes</h3>

                <ul className="space-y-2">

                  {['Early Years', 'Nursery', 'Primary', 'Secondary'].map((cls, idx) => (

                    <li key={idx} className="flex items-center gap-2 text-gray-600">

                      <div className="w-1.5 h-1.5 bg-sky-blue rounded-full"></div>

                      {cls}

                    </li>

                  ))}

                </ul>

              </div>

            </div>



          </div>

        </div>

      </section>



      {/* Complaints/Feedback Section */}

      <section className="py-20 bg-gray-50">

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">

            <div className="text-center mb-10">

              <h2 className="text-xl md:text-2xl font-bold text-navy-blue mb-2">COMPLAINTS/FEEDBACK FORM</h2>

              <div className="w-16 h-1 bg-sky-blue mx-auto rounded-full mb-4"></div>

              <p className="text-gray-600 text-sm">Kindly complete and submit the form below</p>

            </div>



            <form onSubmit={handleSubmitFeedback(onSubmitFeedback)} className="space-y-6">

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>

                <input 

                  {...registerFeedback('name', { required: true })}

                  type="text"

                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                  placeholder="Your Full Name"

                />

              </div>

              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>

                  <input 

                    {...registerFeedback('phone')}

                    type="tel"

                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                    placeholder="Your Phone Number"

                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>

                  <input 

                    {...registerFeedback('email')}

                    type="email"

                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all"

                    placeholder="Your Email Address"

                  />

                </div>

              </div>



              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>

                <textarea 

                  {...registerFeedback('message', { required: true })}

                  rows={5}

                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent outline-none transition-all resize-none"

                  placeholder="How can we help you?"

                ></textarea>

              </div>



              <button type="submit" className="w-full bg-navy-blue hover:bg-deep-blue text-white font-bold py-3 rounded-lg transition-colors shadow-lg text-base">

                Submit Feedback

              </button>

            </form>

          </div>

        </div>

      </section>

    </>

  );

}

