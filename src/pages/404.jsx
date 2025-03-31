import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProtectedRoute = () => {   
        return (
            <div className="h-screen flex items-center justify-center bg-purple-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Ooh, Sorry Pal Page Does not Exist ⚠😣</h1>
                    <p className="text-lg text-gray-600 mt-2">Back to the Home page</p>
                    <Link 
                        to="/" 
                        className="mt-6 inline-block text-lg font-semibold text-black border border-black px-6 py-2 rounded-lg transition duration-300 hover:bg-black hover:text-white"
                    >
                        Home
                    </Link>
                </div>
            </div>
        );
    

};

export default ProtectedRoute;
