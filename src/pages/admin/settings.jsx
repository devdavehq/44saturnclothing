import React, { useState } from "react";
import { FaPinterest, FaInstagramSquare, FaTwitter } from 'react-icons/fa';
import { get, post, put, del } from '../../api'
import Swal from 'sweetalert2';
import { FaTiktok } from "react-icons/fa";
import { assets } from "../../../Images/assets";

const fadeInStyle = `
  @keyframes fadeIn {
    from {
      opacity: 0;
     
    }
    to {
      opacity: 1;
    
    }
  }
  .fade-in {
    animation: fadeIn 0.9s ease-in-out;
  }
`;

const Settings = () => {
    const [activeTab, setActiveTab] = useState("personal");
    const [errors, setErrors] = useState("");
    const [file1, setFile1] = useState("");
    const [file2, setFile2] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleWebSubmit = async (e) => {
        e.preventDefault();
    
        if (!file1 || !file2) {
            return Swal.fire({
                title: 'Error!',
                text: 'Please upload both images.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
        }
    
        const formData = new FormData(); // Create a FormData object
        formData.append("heroImage", file1); // Use unique name for hero image
        formData.append("aboutImage", file2); // Use unique name for about image
    
        try {
            const res = await post("/website-details", formData);
    
            // console.log(res); // Log the response for debugging
    
            if (res.data.msg === "Website details updated successfully") {
                Swal.fire({
                    title: "Success!",
                    text: res.data.msg,
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "black"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Unable to update website details.",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "black"
            });
            console.error(error); // Log the error for debugging
        }
    };
    
    

    const handleAdminSubmit = async (e) => {
        e.preventDefault();

        if(!email || !password) return setErrors('Please fill in email or password')
        const res = await put('/admin-details', { email, password })

           const { data, error, isLoading } = res
            
        //    return console.log(res, { email, password });
        // $2y$10$K1M8huqg2yf.6e47.CPMeeYYBLznVHygmgwDxP9xybQsdcWSDv9P.
           
           if(data) {
            setErrors('')
            return Swal.fire({
                title: 'Success!',
                text: 'Details updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: 'black',
            })
            // console.log(data)
            
        }else{
            setErrors('')
            return Swal.fire({
                title: 'Error!',
                text: 'Unable to Update Details',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            })
            // console.log(error);
            
        }

            
    };
    return (
        <>          
        <style>{fadeInStyle}</style>  
        <h2 className="text-3xl font-bold mb-4 fade-in">Settings</h2>

            <div className="flex mb-4 border-b pb-2 fade-in">
                <button
                    className={`mr-4 font-semibold ${activeTab === "personal" ? "text-black font-bold" : "text-gray-500"}`}
                    onClick={() => setActiveTab("personal")}
                >
                    Personal
                </button>
                <button
                    className={`font-semibold ${activeTab === "website" ? "text-black font-bold" : "text-gray-500"}`}
                    onClick={() => setActiveTab("website")}
                >
                    Website
                </button>
            </div>

            {activeTab === "personal" && (
                <div className="flex flex-row gap-8 fade-in">
                   <ProfileCard/>
                  
                    <form className="space-y-4 w-[60%]" onSubmit={handleAdminSubmit}>
                    {errors && (
                        <p className="py-3 text-red-700">{errors}</p>
                   )}
                    
                    <h2 className="text-3xl font-bold mb-4 mt-5">Update details</h2>
                       
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            
                            className="w-[70%] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-transparent"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-[70%] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-transparent"
                        />
                        {/* <input
                            type="file"
                            className="w-[70%] p-2 border rounded-md focus:outline-none"
                        /> */}
                        <button
                            type="submit"
                            className="w-[70%] bg-black text-white py-2 rounded-md hover:bg-gray-700 transition"
                        >
                            Update Details
                        </button>
                    </form>
                </div>
            )}

            {activeTab === "website" && (
                <div className="flex flex-row gap-8 fade-in">
                <ProfileCard/>
                 <form className="space-y-4 w-[60%]" onSubmit={handleWebSubmit} encType="multipart/form-data">
                 <h2 className="text-3xl font-bold mb-4 mt-5">Website Settings</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">HomePage image</label>
                        <input
                            type="file"
                            className="w-[70%] p-2 border rounded-md focus:outline-none"
                            onChange={(e) => setFile1(e.target.files[0])}
                            name="heroImage"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">AboutSection image</label>
                        <input
                            type="file"
                            className="w-[70%] p-2 border rounded-md focus:outline-none"
                            onChange={(e) => setFile2(e.target.files[0])}
                            name="aboutImage"
                        />
                     </div>
                     <button
                         type="submit"
                         className="w-[70%] bg-black text-white py-2 rounded-md hover:bg-gray-700 transition"
                     >
                         Update Details
                     </button>
                 </form>
             </div>
            )}
        </>
    );
};



const ProfileCard = () => {
    return (
        <div className="flex flex-col items-center mb-4 bg-gray-100 p-4 rounded-lg shadow w-[40%]">
        {/* <div className="w-16  bg-gray-300 rounded-full mb-2"></div> */}
        <img
          src={assets.logo}
          alt="Logo"
          className="p-4 text-xl font-semibold w-[150px] h-[150px]  rounded-full"
        />
        <span className="text-gray-500">@com</span>
        <div className="flex gap-4 justify-center align-middle w-full mt-7">
           <a href="https://pin.it/4wgjktYRK" className="flex gap-4"><FaPinterest className="text-black cursor-pointer text-xl"/></a>
            <a href="https://www.instagram.com/44saturnclothing?igsh=ZDBuYmxpYjBtbmNl&utm_source=qr" className="flex gap-4"><FaInstagramSquare className="text-black cursor-pointer text-xl"/> </a>
            <a href="https://www.tiktok.com/@44saturnclothing?_t=ZM-8uGv7PaZaDv&_r=1" className="flex gap-4"><FaTiktok className="text-black cursor-pointer text-xl"/></a>
        </div>
    </div>
    )
}





export default Settings;

