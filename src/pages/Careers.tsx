import React from 'react';

import { Helmet } from 'react-helmet-async';

import { useForm } from 'react-hook-form';

import { supabase } from '../lib/supabase';



export default function Careers() {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();



  const onSubmit = async (data: any) => {

    try {

      let cvUrl = '';

      

      // Upload CV if exists

      if (data.cv[0]) {

        const file = data.cv[0];

        const fileExt = file.name.split('.').pop();

        const fileName = `${Math.random()}.${fileExt}`;

        const filePath = `cvs/${fileName}`;



        const { error: uploadError } = await supabase.storage

          .from('documents')

          .upload(filePath, file);



        if (uploadError) throw uploadError;



        const { data: { publicUrl } } = supabase.storage

          .from('documents')

          .getPublicUrl(filePath);

          

        cvUrl = publicUrl;

      }



      const coverLetter = `

        Gender: ${data.gender}

        Marital Status: ${data.maritalStatus}

        DOB: ${data.dob}

        Qualification: ${data.qualification}

        Address: ${data.address}

      `;



      const response = await fetch('/api/career-upload', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          email: data.email,

          name: `${data.surname} ${data.firstName}`,

          phone: data.phone,

          gender: data.gender,

          maritalStatus: data.maritalStatus,

          dob: data.dob,

          qualification: data.qualification,

          address: data.address,

          cvFileName: cvUrl ? data.cv[0].name : '',

          cvFile: cvUrl,

        }),

      });



      if (!response.ok) {

        throw new Error('Failed to submit career application');

      }



      alert('Application submitted successfully!');

      reset();

    } catch (error) {

      console.error('Error submitting application:', error);

      alert('An error occurred. Please try again.');

    }

  };



  return (

    <>

      <Helmet>

        <title>Careers | The Choice ICON Schools</title>

        <meta name="description" content="Join our team at The Choice ICON Schools." />

      </Helmet>



      <div className="bg-navy-blue text-white py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="text-3xl md:text-4xl font-bold mb-4">Careers</h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Join Our Mission</p>

        </div>

      </div>



      <section className="py-20 bg-white">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <h1 className="text-2xl md:text-3xl font-bold text-sky-blue mb-6 uppercase tracking-wider">

              JOB APPLICATION FORM

            </h1>

            <h2 className="text-xl font-bold text-navy-blue mb-4">

              Do you want to join a passionate team on a mission to steer our young ones away from moral and intellectual decadence?

            </h2>

            <p className="text-gray-600 text-sm">Fill out the form below to apply.</p>

          </div>



          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>

                  <input {...register('surname', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none" />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>

                  <input {...register('firstName', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none" />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>

                  <input {...register('phone', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none" />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>

                  <input {...register('email', { required: true })} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none" />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>

                  <select {...register('gender', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none">

                    <option value="">Select...</option>

                    <option value="Male">Male</option>

                    <option value="Female">Female</option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>

                  <select {...register('maritalStatus', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none">

                    <option value="">Select...</option>

                    <option value="Single">Single</option>

                    <option value="Married">Married</option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>

                  <input {...register('dob', { required: true })} type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none" />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Qualification</label>

                  <input {...register('qualification', { required: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none" />

                </div>

              </div>

              

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>

                <textarea {...register('address', { required: true })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none"></textarea>

              </div>



              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">CV Upload (PDF)</label>

                <input 

                  {...register('cv', { 

                    required: 'CV is required',

                    validate: {

                      fileSize: (value) => {

                        return !value[0] || value[0].size <= 500 * 1024 || 'File size must be less than 500KB';

                      },

                      fileType: (value) => {

                        return !value[0] || value[0].type === 'application/pdf' || 'Only PDF files are allowed';

                      }

                    }

                  })} 

                  type="file" 

                  accept=".pdf" 

                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue outline-none" 

                />

                <p className="text-xs text-gray-500 mt-1">Max file size: 500KB. Format: PDF only.</p>

                {errors.cv && <span className="text-red-500 text-xs">{errors.cv.message as string}</span>}

              </div>



              <button type="submit" className="w-full bg-sky-blue hover:bg-deep-blue text-white font-bold py-3 rounded-lg transition-colors shadow-lg">

                Submit Application

              </button>

            </form>

          </div>

        </div>

      </section>

    </>

  );

}

