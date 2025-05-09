import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { post } from '../api'; // Ensure this path is correct
import { assets } from "../../Images/assets";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const checkSubscription = () => {
      const hasSubscribed = localStorage.getItem('news');
      if (!hasSubscribed) {
        setIsOpen(true); // Show popup if not subscribed
      }
    };

    // Check immediately on mount
    checkSubscription();

    // Set interval to check every minute (60000 ms)
    const intervalId = setInterval(checkSubscription, 120000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(''); // Clear previous error
    setSuccess('');

    try {
      let formData = new FormData();
      formData.append('email', email);
      const res = await post('/newsletter', formData);

      if (res.data && res.data.msg === 'Email saved successfully') {
        localStorage.setItem('news', res.data.msg);
        setSuccess(res.data.msg);
        setIsOpen(false);
      } else if (res.error) {
        setError(res.error.err || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
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
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-5xl"
            onClick={() => setIsOpen(false)}
            aria-label="Close newsletter popup"
          >
            &times;
          </button>
          <img
                    src={assets.logo}
                    alt="Logo"
                    className="p-4  text-xl font-semibold w-[100px] mb-10 rounded-full shadow-md object-cover object-center"
                  style={{
                    margin: '30px auto'
                  }}
                />
          

          <h2 className="text-center text-2xl font-bold mt-4">Subscribe to Our Newsletter</h2>
          <p className="text-center text-gray-600 mt-2">
            Stay updated with our latest products and offers!
          </p>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-700 p-5">{error}</p>}
            {success && <p className="text-green-700 p-5">{success}</p>}
            <div className="mt-4">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 mt-3 rounded-lg hover:bg-gray-800"
              >
                Subscribe
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )
  );
};

export default NewsletterPopup;