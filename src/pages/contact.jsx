import React from 'react'
import { motion } from 'framer-motion'
import NavBar from '../components/LandingPage/NavBar'
// import { assets } from '../../Images/assets'
import Newsletter from "../components/LandingPage/Newsletter"
import { FaPinterest, FaInstagramSquare, FaTwitter , FaTiktok } from 'react-icons/fa';

const About = () => {
  return (
    <div>
      <NavBar />
      {/* <img src={assets.img} alt="no img here" /> */}
      {/* <img src={assets.background} alt="no img here" className='mt-[65px] bg-slate-600 h-96 object-cover object-center w-full' /> */}
      <div className="py-24 pb-32">
        <h1 className="md:text-center text-left md:px-0 px-4 text-3xl font-bold">Contact</h1>
        <div className='md:w-[50%] w-[80%] h-[1.3px] bg-slate-700 my-[20px] md:mx-auto mx-5' ></div>
        <p className="text-justify text-wrap md:w-[50%] w-[100%] md:px-0 px-4 text-lg font-semibold" style={{ margin: "30px auto", wordSpacing: 2}}>Contact us:
         </p>
         <p className="text-justify text-wrap md:w-[50%] w-[100%] md:px-0 px-4 text-lg " style={{ margin: "10px auto", wordSpacing: 2, marginTop: "-20px"}}>For general inquiries & sales &nbsp;&nbsp;<a href='mailto:44saturnclothing@gmail.com' className='bg-slate-300'>44saturnclothing@gmail.com</a>
         </p>
         <p className="text-justify text-wrap md:w-[50%] w-[100%] md:px-0 px-4 text-lg font-semibold" style={{ margin: "30px auto", wordSpacing: 2}}>Follow us:
         </p>
         {/* <p className="text-justify text-wrap w-[50%] text-lg " style={{ margin: "10px auto", wordSpacing: 2, marginTop: "-20px"}}>For general inquiries & sales &nbsp;&nbsp;<a href='mailto:support@44saturnclo.com' className='bg-slate-300'>support@44saturnclo.com</a>
         </p>   
                 */}
        <div className="flex gap-4 align-center align-middle md:w-[50%] w-[100%] md:px-0 px-4" style={{ margin: "-5px auto"}}>

          <p className="text-justify text-wrap  text-lg"><a href="https://pin.it/4wgjktYRK" className="flex gap-4"><FaPinterest className="text-black cursor-pointer text-xl"/></a>
          </p>
          <p className="text-justify text-wrap text-lg"><a href="https://www.instagram.com/44saturnclothing?igsh=ZDBuYmxpYjBtbmNl&utm_source=qr" className="flex gap-4"><FaInstagramSquare className="text-black cursor-pointer text-xl"/> </a>
          </p>
          <p className="text-justify text-wrap text-lg"><a href="https://www.tiktok.com/@44saturnclothing?_t=ZM-8uGv7PaZaDv&_r=1" className="flex gap-4"><FaTiktok className="text-black cursor-pointer text-xl"/></a>
          </p>
      </div>

     
      </div>
      <Newsletter/>
    </div>
  )
}

export default About