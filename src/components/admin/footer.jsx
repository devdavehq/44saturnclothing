import React, { useState } from "react";


const Footer = () => {
    const [profileBox, setProfileBox] = useState(false);



    return (

        <footer className="mt-6 h-[100%] w-[30%]">
            <div className="flex flex-col items-center bg-white rounded shadow p-4 h-[100%]">
              <h3 className="font-bold text-xl text-cyan-700">Plan details</h3>
              <div className="text-start mt-10 w-[100%] px-5 space-y-3">
                <p className="w-[100%] flex gap-2">Mailgun Plan: <span className="w-[50%] text-end">Free</span></p>
                <p className="w-[100%] flex gap-2">Email sent: <span className="w-[60%] text-end">5 of 3K</span></p>
                <p className="w-[100%] flex gap-2">Validations: <span className="w-[57%] text-end">0 of 0</span></p>
                <p className="w-[100%] flex gap-2">Log retention: <span className="w-[50%] text-end">1 day</span></p>
              </div>
            </div>
          
            {/* use later */}
            {/* {profileBox && (
      <div className="absolute top-full right-0 w-48 mt-2 bg-white shadow-md rounded">
        <ul>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
        </ul>
      </div>
    )} */}
        </footer>

    );
};

export default Footer;

          
