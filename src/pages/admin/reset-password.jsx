// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { get, post, put, del } from '../../api'

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setsuccessMessage] = useState('');


  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    // Handle password reset logic here const 

    const { data, error, isLoading } = await post('/reset-password', { email })
    
    if(data) {
        // console.log(data);
        setsuccessMessage(data.msg)
        return true
        
    }
    if(error) {
      // console.log(error);

      setErrorMessage(error.msg);
      return false
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {errorMessage && <p className="text-red-500 py-3 my-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 py-3 my-2">{successMessage}</p>}
        {emailSent === false && (
          <form onSubmit={handleReset}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
                placeholder="Enter your email"
                // required
              />
            </div>
            <button
              type="submit"
              className={`w-full p-2 my-1 text-white bg-black rounded hover:bg-gray-600`}
            >
              Send Reset Link
            </button>
          </form>
        )}
        {emailSent === true && <h2 className="text-2xl font-bold mb-4 text-cyan-700">{successMessage}</h2>}
      </div>
    </div>
  );
};

export default ResetPassword;