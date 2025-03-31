// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // For extracting token and navigation
import { post } from '../../api'; // Assuming you have an API utility

const ResetPasswordToken = () => {
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams(); // Extract token from the URL
  const navigate = useNavigate(); // For redirecting after success

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    let formData = new FormData();
    formData.append('newPassword', newPassword);
    formData.append('token', token);
    try {
      // Send the new password and token to the API
      const { data, error } = await post('/reset-password-token', {
        newPassword,
        token
      });
  
      console.log('API Response:', { data, error }); // Log the response
  
      if (data) {
        setSuccessMessage('Password reset successfully! Redirecting to login page...');
        setTimeout(() => {
          location.href = 'https://app.44saturnclothing.com/admin/login'; // Redirect to login page after 3 seconds
        }, 3000);
      }
  
      if (error) {
        setErrorMessage(error.msg || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('API Error:', err); // Log the error
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {errorMessage && <p className="text-red-500 py-2 my-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 py-2 my-2">{successMessage}</p>}
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
              placeholder="************"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-2 ${!errorMessage ? 'my-1' : 'my-7'} text-white bg-black rounded hover:bg-gray-600 disabled:bg-gray-400`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordToken;