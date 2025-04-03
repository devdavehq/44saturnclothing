import React, { useState } from "react";

import { Link } from "react-router-dom";
import { FaPinterest, FaInstagramSquare, FaTwitter , FaTiktok } from 'react-icons/fa';
import { post } from '../../api'

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  




  const handleSubmit = async (e) => {
      e.preventDefault();
  
      setError(''); // Clear previous error
      setSuccess('');
          let formData = new FormData()
          formData.append('email', email)
          const res = await post('/newsletter', formData);
          const { data, error, isLoading } = res;
  
          // console.log({ email: email, password: password });
          
          if (data) {
              if (data.msg === 'Email saved successfully') {
                  localStorage.setItem('news', data.msg)
                  setSuccess(data.msg)
                  //  console.log(res, localStorage.getItem('success'));
                  // return console.log(data);
                  
              }
          }
  
          if (error) {
              return setError(error.err);
          }
      
  };

  

  return (

    <>
    <div className="bg-gray-100 py-12 px-6 md:px-16">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter to get the latest updates and offers.
        </p>
        {error && (
                    <p className="text-red-700 p-5 ">{error ? error : success}</p>
        )}
        {success && (
                    <p className="text-green-700 p-5 ">{success ? success : error}</p>
        )}
        <form className="flex flex-col md:flex-row items-center" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full md:w-auto flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-transparent"
          />
          <button
            type="submit"
            className="mt-4 md:mt-0 md:ml-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-goldenrod transition-all"
          >
            Subscribe
          </button>
        </form>
        <div className="flex gap-10 justify-center align-middle w-full mt-10">
           <a href="https://pin.it/4wgjktYRK" className="flex gap-4"><FaPinterest className="text-black cursor-pointer text-xl"/></a>
            <a href="https://www.instagram.com/44saturnclothing?igsh=ZDBuYmxpYjBtbmNl&utm_source=qr" className="flex gap-4"><FaInstagramSquare className="text-black cursor-pointer text-xl"/> </a>
            <a href="https://www.tiktok.com/@44saturnclothing?_t=ZM-8uGv7PaZaDv&_r=1" className="flex gap-4"><FaTiktok className="text-black cursor-pointer text-xl"/></a>
        </div>
      </div>

    
    </div>
    <p className="bg-gray-100 text-gray-600 text-sm text-center pb-3"><Link to="/returns&shippings">Return and Shipping poilcy</Link></p>
    <p className="bg-gray-100 text-gray-600 text-sm text-center pb-3 pt-7">copyrignt&copy; 44saturnclothing 2025</p>
    </>
  );
};

export default Newsletter;