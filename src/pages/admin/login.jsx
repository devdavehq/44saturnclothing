// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from "../../../Images/assets";
import { get, post, put, del } from '../../api'
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');




    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            let formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)
            const res = await post('/login', formData);
            const { data, error, isLoading } = res;
    
            // console.log(res);
            
            if (data) {
                if (data.message === 'Login successful') {
                    localStorage.setItem('success', data.message)
                    //  console.log(res, localStorage.getItem('success'));
                    return navigate('/admin/dashboard/');
                    return console.log(res);
                    
                }
            }
    
            if (error) {
                return setError(error.error);
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('An error occurred during login.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <img
                    src={assets.logo}
                    alt="Logo"
                    className="p-4 text-xl font-semibold w-[100px] ml-28 -mb-3 rounded-full shadow-md object-cover object-center"
                />
                {error && (
                    <p className="text-red-700 p-5 ">{error}</p>
                )}
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Username
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`mt-1 block w-full p-2 border rounded `}
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-2 text-white rounded bg-black ${email.trim() === '' || password.trim() === '' ? 'cursor-not-allowed bg-slate-300' : 'bg-black'}`}
                    // Updated condition
                    >
                        Sign In
                    </button>
                    <p className="mt-4 text-sm text-center">
                        <a
                            href='/admin/reset-password'
                            className="text-blue-500 hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;



// how will the  header and token be set incase i want to set diff token or headers per request in just one file also must it be local storage to retrieve token isnt there flaws wuth it pleaxe fix and address issues