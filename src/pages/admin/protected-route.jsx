import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('success') === 'Login successful'
    );

    useEffect(() => {
        const checkAuth = () => {
            const item = localStorage.getItem('success');
            if (item === 'Login successful') {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        const interval = setInterval(checkAuth, 2000);

        return () => clearInterval(interval); // Clear the interval when the component unmounts
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="h-screen flex items-center justify-center bg-purple-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Ooh, Pal you need to be logged in 😉</h1>
                    <p className="text-lg text-gray-600 mt-2">Back to the login page</p>
                    <a 
                        href="/admin/login" 
                        className="mt-6 inline-block text-lg font-semibold text-black border border-black px-6 py-2 rounded-lg transition duration-300 hover:bg-black hover:text-white"
                    >
                        Login
                    </a>
                </div>
            </div>
        );
    }

    return children; // Render the protected component
};

export default ProtectedRoute;
