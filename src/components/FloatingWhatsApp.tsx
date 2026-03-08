import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingWhatsApp() {
  const phoneNumber = "2348069077937"; // International format without +
  const message = encodeURIComponent("Hello, I’m interested in learning more about admission into The Choice ICON Schools. Please provide me with more information.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 left-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg z-50 hover:shadow-xl transition-shadow flex items-center justify-center"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </motion.a>
  );
}
