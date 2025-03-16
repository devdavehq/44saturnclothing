import React from 'react'
import { assets } from '../../Images/assets'

const LookImages = () => {
  return (
    <div className='flex flex-row items-center justify-around flex-wrap gap-4 w-full p-6 mt-8'>
        <img src={assets.background} alt="" className='w-72  h-72' style={{borderRadius: '10px',}} />
        <img src={assets.background} alt="" className='w-72  h-72' style={{borderRadius: '10px',}} />
        <img src={assets.background} alt="" className='w-72  h-72' style={{borderRadius: '10px',}} />
        <img src={assets.background} alt="" className='w-72  h-72' style={{borderRadius: '10px',}} />
        <img src={assets.background} alt="" className='w-72  h-72' style={{borderRadius: '10px',}} />
        <img src={assets.background} alt="" className='w-72  h-72' style={{borderRadius: '10px',}} />
        <img src={assets.background} alt="" className='w-72  h-72' style={{borderRadius: '10px',}} />
        <img src={assets.background} alt="" className='w-72  h-72' style={{borderRadius: '10px',}} />
    </div>
  )
}

export default LookImages