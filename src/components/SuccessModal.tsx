import React from 'react';
import { CheckCircle, Mail, Clock } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  email: string;
  formType: 'Contact' | 'Admission' | 'Career';
  onClose: () => void;
}

export default function SuccessModal({ isOpen, title, message, email, formType, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  const typeColors = {
    Contact: '#EC4899',
    Admission: '#EF4444',
    Career: '#F59E0B',
  };

  const typeEmoji = {
    Contact: '💬',
    Admission: '📝',
    Career: '💼',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-8 text-center text-white"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          }}
        >
          <div className="flex justify-center mb-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <CheckCircle size={48} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mt-2"
            style={{ backgroundColor: typeColors[formType] }}
          >
            {typeEmoji[formType]} {formType} Submission
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <p className="text-gray-700 text-center mb-6 leading-relaxed">{message}</p>

          {/* Email confirmation */}
          <div
            className="p-4 rounded-lg mb-6 flex items-start gap-3"
            style={{ backgroundColor: '#f0f9ff', borderLeft: `4px solid ${typeColors[formType]}` }}
          >
            <Mail size={20} style={{ color: typeColors[formType] }} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Confirmation Email Sent</p>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </div>

          {/* Timeline */}
          <div
            className="p-4 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: '#f9fafb', borderLeft: `4px solid #1e40af` }}
          >
            <Clock size={20} className="text-sky-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Response Time</p>
              <p className="text-sm text-gray-600">We'll respond within 24-48 hours during business days</p>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Need immediate assistance?</p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Call:</strong>{' '}
                <a href="tel:+2348069077937" className="text-sky-blue hover:underline">
                  +234-806-9077-937
                </a>
              </p>
              <p>
                <strong>WhatsApp:</strong>{' '}
                <a href="https://wa.me/2348069077937" target="_blank" rel="noopener noreferrer" className="text-sky-blue hover:underline">
                  Chat with us
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-sky-blue text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
          <a
            href="https://choiceiconschools.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}
