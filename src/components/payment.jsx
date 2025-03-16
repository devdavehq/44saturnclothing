import React, { useState } from 'react';
import { FaGoogle, FaLock } from 'react-icons/fa';
import axios from 'axios';

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

        try {
            // Send order details to the backend to create an order and initialize payment
            const response = await axios.post('http://localhost:3000/create-order', {
                customer_name: 'John Doe', // Replace with actual customer name
                email: email,
                phone: '1234567890', // Replace with actual phone number
                shipping_address: shippingAddress,
                total_amount: amount // Amount in kobo
            });

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
                <form onSubmit={handleSubmit} className='w-[70%] ml-[100px]'>
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
                    <FaLock className="mr-2" /> Pay ₦{(amount / 100).toFixed(2)} {/* Display amount in Naira */}
                    </button>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    {success && <div className="mt-4 text-green-500">{success}</div>}
                </form>
            </div>

            {/* Order Summary */}
            <div className="md:w-1/2 p-6 bg-gray-100 border-l">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <div className="mt-4 w-[60%]">
                    <div className="flex items-center justify-between py-2 border-b pb-5">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                        <span>{product.name} ({product.size})</span>
                        <span>{(product.price / 100).toFixed(2)}</span> {/* Display price in dollars */}
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span>Subtotal</span>
                        <span>{(product.price / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span>Shipping</span>
                        <span>Enter shipping address</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                        <span>Total</span>
                        <span>{(amount / 100).toFixed(2)}</span> {/* Display total in dollars */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;