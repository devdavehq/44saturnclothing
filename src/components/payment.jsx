import React, { useState } from 'react';
import { FaGoogle, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { get, post, put, del } from '../api'

const PaymentForm = ({ amount, product }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
    const [email, setEmail] = useState(''); // State for email
    const [phone, setPhone] = useState(''); // State for email


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);


        
        let formData = new FormData()
        formData.append('email', email)
        formData.append('phone', phone)
        formData.append('address', shippingAddress)
        // formData.append('', )
        try {
            // Send order details to the backend to create an order and initialize payment
            const response = await post('http://localhost:3000/create-order', formData);

            const { authorization_url } = response.data; // Get the authorization URL from the response
            window.location.href = authorization_url; // Redirect the user to Paystack for payment
        } catch (error) {
            setError('Error processing payment: ' + error.message);
        }
    };

    return (
        <div className="flex flex-row mx-auto p-6 bg-white rounded-lg my-12">
            {/* Payment Form */}
            <div className="md:w-1/2 p-6">
                <h1 className="text-[25px] font-bold mb-4 ml-[100px]">Checkout</h1>
                <a href='' className="w-[70%] bg-black text-white py-3 my-4 ml-[100px] rounded-md flex items-center justify-center">
                    <FaGoogle className="mr-2" /> Pay with Google Pay
                </a>
                <div className="text-center text-gray-500 my-4">or pay with card</div>
                <form onSubmit={handleSubmit} className='w-[70%] ml-[100px]' encType='multipart/form-data'>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state
                            className="w-full p-3 border-slate-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)} // Update email state
                            className="w-full p-3 border-slate-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Shipping Address</label>
                        <input
                            type="text"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="billing"
                            checked={billingSameAsShipping}
                            onChange={() => setBillingSameAsShipping(!billingSameAsShipping)}
                            className="mr-2"
                        />
                        <label htmlFor="billing" className="text-gray-700">Billing address same as shipping</label>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center">
                    <ShoppingCart className="mr-2" /> Pay ₦{(1000)} {/* Display amount in Naira */}
                    </button>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    {success && <div className="mt-4 text-green-500">{success}</div>}
                </form>
            </div>

            {/* Order Summary */}
            <div className="md:w-1/2 p-6 bg-gray-100 border-l">
                <h2 className="text-xl font-bold">Order Summary</h2>
               
            </div>
        </div>
    );
};

export default PaymentForm;

// {/* <div className="mt-4 w-[60%]">
// <div className="flex items-center justify-between py-2 border-b pb-5">
//     <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
//     <span>{product.name} ({product.size})</span>
//     <span>{(product.price)}</span> {/* Display price in dollars */}
// </div>
// <div className="flex justify-between py-2 border-b">
//     <span>Quantity</span>
//     <span>{(product.quantity)}</span>
// </div>
// <div className="flex justify-between py-2 border-b">
//     <span>Shipping</span>
//     <span>Enter shipping address</span>
// </div>
// <div className="flex justify-between py-2 font-bold">
//     <span>Total</span>
//     <span>{(product.amount)}</span> {/* Display total in dollars */}
// </div>
// </div> */}