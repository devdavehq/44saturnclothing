import React, { useState, useEffect, useRef } from "react";
import {
  FaHome,
  FaBoxes,
  FaShoppingCart,
  FaCogs,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";
import { assets } from "../../../Images/assets";
import { get, post, put, del } from '../../api'
const Navbar = ({ setComponent }) => {
  const [activeItem, setActiveItem] = useState(location.pathname.split('/')[3]);
  const [isOpen, setIsOpen] = useState(false); // Sidebar visibility state
  const sidebarRef = useRef(null); // Reference for sidebar

  const handleItemClick = (component) => {
    setActiveItem(component);
    setComponent(component);
    // Removed setIsOpen(false) to prevent closing the nav on link click
  };

  const handleLogout = async () => {
    const { data, error, isLoading } = await get('/logout')
    // const  = res

     if(data === 'logged out successfully') {
      localStorage.setItem('success', data)
      location.href = "/admin/login"
      // return console.log(data); 

     }
     localStorage.setItem('success', error)
     location.href = "/admin/login"

     
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded"
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
      </button>

      {/* Backdrop when sidebar is open */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-black text-white transition-transform transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:w-64 z-50 h-screen overflow-hidden`}
      >
        <img
          src={assets.logo}
          alt="Logo"
          className="p-4 text-xl font-semibold w-[100px] ml-16 rounded-full"
        />
        <nav className="mt-6">
          <ul>
            <li
              className={`flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer ${
                activeItem === "" || location.pathname === '' || location.pathname === '/' ? "bg-gray-800 font-bold" : ""
              }`}
              onClick={() => handleItemClick("")}
            >
              <FaHome className="mr-3" /> Dashboard
            </li>
            <li
              className={`flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer ${
                activeItem === "products" || location.pathname === 'products' ? "bg-gray-800 font-bold" : ""
              }`}
              onClick={() => handleItemClick("products")}
            >
              <FaBoxes className="mr-3" /> Products
            </li>
            <li
              className={`flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer ${
                activeItem === "verify-orders" || location.pathname === 'verify-orders' ? "bg-gray-800 font-bold" : ""
              }`}
              onClick={() => handleItemClick("verify-orders")}
            >
              <AiFillCheckCircle className="mr-3" /> Verify Orders
            </li>
            <li
              className={`flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer ${
                activeItem === "orders" || location.pathname === 'orders' ? "bg-gray-800 font-bold" : ""
              }`}
              onClick={() => handleItemClick("orders")}
            >
              <FaShoppingCart className="mr-3" /> Orders
            </li>
            <li
              className={`flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer ${
                activeItem === "settings" || location.pathname === 'settings' ? "bg-gray-800 font-bold" : ""
              }`}
              onClick={() => handleItemClick("settings")}
            >
              <FaCogs className="mr-3" /> Settings
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[80%]">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
