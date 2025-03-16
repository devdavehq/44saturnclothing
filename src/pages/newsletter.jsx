import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const hasSubscribed = localStorage.getItem('news');

    if (!hasSubscribed) {
      setIsOpen(true); // Show popup initially

      const interval = setInterval(() => {
        if (!localStorage.getItem('news')) {
          setIsOpen(true);
        } else {
          clearInterval(interval); // Stop showing the popup if subscribed
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, []);

  const handleSubmit = () => {
    if (!email.trim()) {
      alert('Please provide a valid email'); // Use alert for better UX
      return;
    }
    localStorage.setItem('newsletterSubscribed', 'true'); // Save subscription status
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <motion.div
          className="relative bg-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          
          <div 
            className="w-full h-40 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: "url('https://source.unsplash.com/600x400/?fashion')" }}
          />

          <h2 className="text-center text-2xl font-bold mt-4">Subscribe to Our Newsletter</h2>
          <p className="text-center text-gray-600 mt-2">
            Stay updated with our latest products and offers!
          </p>

          <div className="mt-4">
            <input 
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              className="w-full bg-black text-white py-2 mt-3 rounded-lg hover:bg-gray-800"
              onClick={handleSubmit}
            >
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default NewsletterPopup;
