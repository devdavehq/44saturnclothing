import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '../components/LandingPage/NavBar'
import { assets } from '../../Images/assets'
import Newsletter from "../components/LandingPage/Newsletter"
import { get } from '../api'

const About = () => {

  const [img, setImg] = useState('')


  useEffect(() => {
    const fetchHero = async () => {
      const res = await get('/get_hero'); // Fetch orders from the API
      if (res.data) {
        // console.log(res.data.msg);
        setImg(`${import.meta.env.VITE_SERVER_URL}/${res.data.msg[0].aboutimg}`)
        // Set the fetched data to state
      }
    };

    fetchHero(); // Call the fetch function
    const intervalId = setInterval(fetchHero, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <NavBar />
      {/* <img src={`{${img || assets.img}}`} alt="no img here" /> */}
      <img
        src={img || assets.background}
        alt="no img here"
        className="mt-[65px] bg-slate-600 h-96 object-cover object-center w-full"
      />      
      <div className="py-7">
        <h1 className="text-center text-4xl font-bold">About</h1>
        <div className='w-[50%] h-[1.3px] bg-slate-700' style={{ margin: "20px auto" }}></div>
        <p className="text-justify md:text-wrap md:w-[60%] w-full md:px-0 px-3 text-lg" style={{ margin: "30px auto", lineHeight: 2 }}>44SATURN is more than just a name—it’s a statement.
        </p>
        <p className="text-justify md:text-wrap md:w-[60%] w-full md:px-0 px-3 text-lg" style={{ margin: "30px auto", lineHeight: 2 }}>
          The number 44 represents stability, hard work, and a solid foundation, symbolizing the power of persistence and the journey toward greatness. It’s a number that embodies determination, success, and the pursuit of excellence.
        </p>
        <p className="text-justify md:text-wrap md:w-[60%] w-full md:px-0 px-3 text-lg" style={{ margin: "30px auto", lineHeight: 2 }}>
          Saturn, the planet of discipline, wisdom, and transformation, signifies growth, resilience, and the ability to overcome challenges.

          Together, 44Saturn represents strength, balance, and a commitment to a quality cut, unique prints ,consistency, sophistication, and progress. It’s about elevating everyday routines into powerful rituals.

          44Saturn is not just a brand; it a nod to our angelic number . Which is 444 , a solid foundation and endless protection.
          Every piece we create carries a good guild though whatever we are focusing on .</p>
        <p className="text-justify md:text-wrap md:w-[60%] w-full md:px-0 px-3 text-lg " style={{ margin: "30px auto", lineHeight: 2 }}>
          It’s about elevating everyday routines into powerful rituals.

          44Saturn is not just a brand; it a nod to our angelic number . Which is 444 , a solid foundation and endless protection.
          Every piece we create carries a good guild though whatever we are focusing on .</p>
      </div>
      <Newsletter />
    </div>
  )
}

export default About