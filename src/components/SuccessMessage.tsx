import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  isVisible: boolean;
  formType: 'Contact' | 'Admission' | 'Career';
}

export default function SuccessMessage({ isVisible, formType }: SuccessMessageProps) {
  if (!isVisible) return null;

  const messages = {
    Contact: 'Thank you! Your message has been sent successfully.',
    Admission: 'Thank you! Your enquiry has been submitted successfully.',
    Career: 'Thank you! Your application has been submitted successfully.',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
        <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
        <p className="text-green-800 font-medium">{messages[formType]}</p>
      </div>
    </div>
  );
}
