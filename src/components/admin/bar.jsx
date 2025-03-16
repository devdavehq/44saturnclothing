import React, { useState } from 'react';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
// import { FaSunPlantWilt } from 'react-icons/fa6';

const TopBar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [country, setCountry] = useState('US');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can also add logic to apply dark mode styles to the body or a parent component
    document.body.classList.toggle('bg-gray-800', !darkMode);
    document.body.classList.toggle('bg-white', darkMode);
  };
  // let page = ''
  // if(location.pathname === '/dashboard/'){
  //     page = 'Dashboard'
  // }else if (location.pathname === '/dashboard/products'){
  //   page = 'Products'
  // }else if (location.pathname === '/dashboard/orders'){
  //   page = 'Orders'
  // }else if (location.pathname === '/dashboard/settings'){
  //   page = 'Settings'
  // }else {
  //   page = 'Dashboard'
  // }
    
  return (
    <div className={`flex items-center justify-end p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {/* <h1 className='text-3xl text-black font-bold'>{page}</h1> */}
      <div className="flex gap-5 place-items-center ">
      {/* <button className="px-4 py-[5px] text-white bg-red-500 rounded mr-7">Upgrade</button> */}
      <FaSun className={`p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
         />
      <div className="flex items-center">
        <FaUserCircle className="text-2xl mr-4"
         />
      </div>        
      {/* className={`w-[100%] h-72 border-2 border-dashed p-8 rounded-lg flex flex-col items-center justify-center transition-colors duration-200 ${isDragActive ? 'bg-gray-200' : 'bg-white'}`} */}
      {/* mb-2 text-8xl text-cyan-950 */}
      </div>
    </div>
  );
};

export default TopBar; 

