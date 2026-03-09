import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import SuccessMessage from '../components/SuccessMessage';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Careers() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploadError, setCvUploadError] = useState<string>('');

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setCvUploadError('');

    try {
      if (!cvFile) {
        setCvUploadError('Please upload your CV');
        setIsSubmitting(false);
        return;
      }

      // Upload CV to Supabase Storage
      const fileName = `${data.email}_${Date.now()}_${cvFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('career_cvs')
        .upload(fileName, cvFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('CV upload error:', uploadError);
        setCvUploadError('Failed to upload CV. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('career_cvs')
        .getPublicUrl(fileName);

      const cvUrl = publicUrlData?.publicUrl;

      const applicationDetails = `
Gender: ${data.gender}
Marital Status: ${data.maritalStatus}
Date of Birth: ${data.dob}
Qualification: ${data.qualification}
Address: ${data.address}
      `.trim();

      const response = await fetch('http://localhost:5000/api/career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${data.surname} ${data.firstName}`,
          email: data.email,
          phone: data.phone,
          message: applicationDetails,
          cvUrl: cvUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setShowSuccess(true);
      reset();
      setCvFile(null);
      // Hide success message after 4 seconds
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Curriculum Vitae (CV)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sky-blue hover:bg-blue-50 transition-colors">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          setCvUploadError('File size must be less than 5MB');
                          setCvFile(null);
                        } else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
                          setCvUploadError('Only PDF and Word documents are allowed');
                          setCvFile(null);
                        } else {
                          setCvFile(file);
                          setCvUploadError('');
                        }
                      }
                    }}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PDF or Word document (Max 5MB)</p>
                  </label>
                  {cvFile && <p className="text-green-600 font-medium mt-3">✓ {cvFile.name}</p>}
                </div>
                {cvUploadError && <span className="text-red-500 text-xs mt-2 block">{cvUploadError}</span>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-sky-blue hover:bg-deep-blue text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <SuccessMessage isVisible={showSuccess} formType="Career" />
    </>
  );
}
