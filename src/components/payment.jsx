import React, { useState } from 'react';
import { MdAccountBalance } from 'react-icons/md'; // Importing the bank icon from Material Design

import { ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { get, post, put, del } from '../api';
import Swal from 'sweetalert2';
import { FaCreditCard, FaMoneyCheckAlt } from 'react-icons/fa';

const PaymentForm = ({ products, totalAmount, removeFromCart }) => {
    const [error, setError] = useState(null);
    const [refError, setRefError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('paystack');
    const [showReferenceForm, setShowReferenceForm] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    const [bankName, setBankName] = useState(''); // New state for bank name
    const [loading, setLoading] = useState(false); // New state for loader

    const [showSummary, setShowSummary] = useState(false); // New state for mobile summary toggle

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            // Validate inputs
            if (products.length === 0) {
                throw new Error('Your cart is empty');
            }

            const trimmedEmail = email.trim();
            const trimmedPhone = phone.trim();
            const trimmedShippingAddress = shippingAddress.trim();

            if (!trimmedEmail || !trimmedPhone || !trimmedShippingAddress) {
                throw new Error('Please fill in all required fields');
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('email', trimmedEmail);
            formData.append('phone', trimmedPhone);
            formData.append('address', trimmedShippingAddress);
            formData.append('total_amount', totalAmount);
            formData.append('products', JSON.stringify(products));

            if (paymentMethod === 'bank' && bankName.trim()) {
                formData.append('bank_name', bankName.trim());
            }

            // Make API call
            const response = await post('/create-bank-order', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        //    return console.log(response);
            
            // Handle response
            if (!response || !response.data) {
                throw new Error('Empty response from server');
            }

            if (response.data && response.data.status === 'success') {
                const emailNotice = response.data.email_sent
                    ? 'Check your email for payment details.'
                    : 'If Email not sent - please contact support with your reference number.';
                console.log(response);
                
                setSuccess(`Order placed. ${emailNotice}`);

                if (response.data.ref) {
                    setShowReferenceForm(true);
                }

            } else if (response.data.status === 'error') {
                throw new Error(response.data.message);
            } else {
                throw new Error('Unexpected response format');
            }

        } catch (error) {
            setError(error.message || 'Error processing payment');
        } finally {
            setLoading(false);
        }
    };

    const handleReferenceSubmit = async (event) => {
        event.preventDefault();
        setRefError(null);
        setLoading(true);

        try {
            if (paymentMethod === 'bank' && !referenceId.trim()) {
                throw new Error('Please enter your reference ID');
            }

            const formData = new FormData();
            formData.append('reference_id', referenceId.trim());
            formData.append('totalAmount', totalAmount);

            const response = await post('/verify-reference', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // return console.log(response);
            
            if (response.data) {
                throw new Error(response.data?.msg || 'Payment verification failed');
            }

            // Success case
            Swal.fire({
                icon: 'success',
                title: 'Payment Verified',
                text: response.data.message,
            });

            // Clear cart
            products.forEach((product) => {
                removeFromCart(product.product_id, product.size);
            });
            localStorage.removeItem('cartMultiple');
            setShowReferenceForm(false);

        } catch (error) {
            setRefError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="flex flex-col md:flex-row mx-auto p-6 bg-white rounded-lg my-12">
            {/* mobile summary */}
            <div className="block md:hidden">
                <button
                    onClick={() => setShowSummary(!showSummary)}
                    className="w-full flex justify-between items-center p-4 bg-gray-100 border-t border-b"
                >
                    <span className="font-bold">Order Summary</span>
                    {showSummary ? <ChevronDown /> : <ChevronUp />}
                </button>
                {showSummary && (
                    <div className="p-4 bg-gray-100">
                        <div className="max-h-60 overflow-y-auto">
                            {products.map((product, index) => (
                                <div key={`${product.product_id}-${product.size}`} className="flex justify-between py-2 border-b">
                                    <span>{product.name} ({product.size})</span>
                                    <span>₦{product.amount} x {product.quantity}</span>
                                    <button
                                        onClick={() => removeFromCart(product.product_id, product.size)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between py-2 font-bold">
                            <span>Total</span>
                            <span>₦{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* Payment Form */}
            <div className="w-full md:w-1/2 p-6">
                <h1 className="text-[25px] font-bold mb-4 md:ml-[100px]">Checkout</h1>
                <form onSubmit={handleSubmit} className='w-full md:w-[70%] md:ml-[100px]'>
                    {error && <div className="mt-4 text-red-500 w-[70%]">{error}</div>}
                    {success && <div className="mt-4 text-green-500 w-[70%]">{success}</div>}
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Shipping Address</label>
                        <input
                            type="text"
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Payment Method</label>
                        <select
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"
                        >
                            <option value="paystack" disabled={false}>Pay with Paystack </option>
                            <option value="bank">Pay with Bank 💳</option>
                        </select>
                    </div>
                    {/* Bank Name Input Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Bank Name</label>
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"
                            placeholder="Enter your bank name"
                            disabled={paymentMethod !== 'bank'} // Disable if payment method is not "bank"
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
                </form>
            </div>



            {/* Order Summary */}
            <div className="hidden md:block md:w-1/2 p-6 bg-gray-100 border-l">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <div className="max-h-60 overflow-y-auto">
                    {products.map((product, index) => (
                        <div key={`${product.product_id}-${product.size}`} className="flex justify-between py-2 border-b">
                            <span>{product.name} ({product.size})</span>
                            <span>₦{product.amount} x {product.quantity}</span>
                            <button
                                onClick={() => removeFromCart(product.product_id, product.size)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between py-2 font-bold">
                    <span>Total</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* Reference ID Form Modal */}
            {showReferenceForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Verify Payment</h2>
                        {refError && <div className="mt-4 text-red-500 w-[70%]">{refError ? refError : ''}</div>}
                        <form onSubmit={handleReferenceSubmit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Reference ID
                                </label>
                                <input
                                    type="text"
                                    value={referenceId}
                                    onChange={(e) => setReferenceId(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter your Reference ID"
                                />
                            </div>
                            <div className="mb-6">
                                <p className="text-sm text-gray-600">
                                    Please ensure you have made the payment to the bank account swnt to your Email:
                                </p>
                                {/* <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <strong>Bank Name:</strong> GTB
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Account Number:</strong> 0617051564
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Account Name:</strong> Osabia Michael Ayomide
                                    </p>
                                </div> */}
                                <p className="mt-2 text-sm text-red-600">
                                    Note: Your payment will not be reflected if you do not pay to the account above.
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition duration-200"
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                ) : (
                                    'Verify Payment'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentForm;