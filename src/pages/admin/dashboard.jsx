import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../components/admin/nav';
import Section from '../../components/admin/mid-section';
import Products from './products';
import Orders from './orders';
import Settings from './settings';
import { get } from '../../api';
import ProtectedRoute from './protected-route';
const Dashboard = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(`/admin/dashboard/${path}`);
    };


    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-white">
                {/* Sidebar */}
                <Navbar setComponent={handleNavigation}/>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <Routes>
                        <Route path="/" element={<Section />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
         </ProtectedRoute>
    );
};

export default Dashboard;