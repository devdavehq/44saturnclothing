import React, { useState } from 'react';
import { FaGoogle, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { get, post, put, del } from '../api'

const PaymentForm = ({ products, totalAmount }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        // Check if there are products in the cart
        if (products.length === 0) {
            setError('Your cart is empty. Please add items to your cart before proceeding.');
            return;
        }

        let formData = new FormData();
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', shippingAddress);
        formData.append('total_amount', totalAmount); // Use totalAmount directly
        formData.append('products', JSON.stringify(products)); // Include cart details

        try {
            const response = await post('http://localhost:3000/create-order', formData);
            const { authorization_url } = response.data;
            window.location.href = authorization_url;
        } catch (error) {
            setError('Error processing payment: ' + error.message);
        }
    };

    return (
        <div className="flex flex-row mx-auto p-6 bg-white rounded-lg my-12">
            {/* Payment Form */}
            <div className="md:w-1/2 p-6">
                <h1 className="text-[25px] font-bold mb-4 ml-[100px]">Checkout</h1>
                {/* <a href='' className="w-[70%] bg-black text-white py-3 my-4 ml-[100px] rounded-md flex items-center justify-center">
                    <FaGoogle className="mr-2" /> Pay with Google Pay
                </a> */}
                {/* <div className="text-center text-gray-500 my-4">pay with card</div> */}
                <form onSubmit={handleSubmit} className='w-[70%] ml-[100px]' encType='multipart/form-data'>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                        <ShoppingCart className="mr-2" /> Pay ₦{totalAmount}
                    </button>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    {success && <div className="mt-4 text-green-500">{success}</div>}
                </form>
            </div>

            {/* Order Summary */}
            <div className="md:w-1/2 p-6 bg-gray-100 border-l overflow-y-scroll">
                <h2 className="text-xl font-bold">Order Summary</h2>
                {products.map((product, index) => (
                    <div key={`${product.product_id}-${product.size}`} className="flex justify-between py-2 border-b">
                        <span>{product.name} ({product.size})</span>
                        <span>₦{product.amount.toLocaleString()} x {product.quantity}</span>
                    </div>
                ))}
                <div className="flex justify-between py-2 font-bold">
                    <span>Total</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
