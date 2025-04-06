import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

import { get } from '../../api'

const HeroSection = () => {
  const navigate = useNavigate()
  const [img, setImg] = useState('')


  useEffect(() => {
    const fetchHero = async () => {
      const res = await get('/get_hero'); // Fetch orders from the API
      if (res.data) {
        // console.log(res.data.msg);
        setImg(`${import.meta.env.VITE_SERVER_URL}/${res.data.msg[0].heroimg}`)
        // Set the fetched data to state
      }
    };

    fetchHero(); // Call the fetch function
    const intervalId = setInterval(fetchHero, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-h-[120vh] mt-10"> {/* Increased height */}
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundImage: `url(${img || '../../../Images/background.jpg'})`,
        backgroundSize: 'cover', // Keeps your original styling
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e293b',
        backgroundAttachment: 'fixed' // Keeps parallax effect
      }}
    >
      <div className="absolute inset-0 bg-black/30" />
    </div>
  
    <div className="relative h-full flex flex-col items-center justify-center text-white text-center py-[20vh]"> {/* Added vertical padding */}
      <h1 className="text-4xl tracking-[0.2em] mb-8">
        LATEST ARRIVALS
      </h1>
      <button
        onClick={() => navigate('/shop')}
        className="border border-white px-12 py-3 text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-colors">
        SHOP LATEST
      </button>
    </div>
  </div>
  );
};

export default HeroSection;

