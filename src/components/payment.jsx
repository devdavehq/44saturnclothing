import React, { useState } from 'react';
import { MdAccountBalance } from 'react-icons/md'; // Importing the bank icon from Material Designimport { ShoppingCart } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { get, post, put, del } from '../api';
import Swal from 'sweetalert2';

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (products.length === 0) {
            setError('Your cart is empty. Please add items to your cart before proceeding.');
            return;
        }

        // Trim input fields
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
        const trimmedShippingAddress = shippingAddress.trim();

        if (!trimmedEmail || !trimmedPhone || !trimmedShippingAddress) {
            setError('Please fill in all required fields.');
            return;
        }

        let formData = new FormData();
        formData.append('email', trimmedEmail);
        formData.append('phone', trimmedPhone);
        formData.append('address', trimmedShippingAddress);
        formData.append('total_amount', totalAmount);
        formData.append('products', JSON.stringify(products));

        // Log the form data to ensure it's correct
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await post('/create-bank-order', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const { msg, ref } = response.data;
            setSuccess(msg);
            // console.log(response.data);
            if (ref) {
                setShowReferenceForm(true)
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                setError('Error processing payment: ' + error.response.data.msg);
            } else if (error.message) {
                setError('Error processing payment: ' + error.message);
            } else {
                setError('Error processing payment: An unknown error occurred.');
            }
        }
    };

    const handleReferenceSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (paymentMethod === 'bank' && referenceId === '') {
            setRefError('Please enter your reference ID.');
            return;
        }

    
            try {
                let formData = new FormData();
                formData.append('reference_id', referenceId);
                formData.append('totalAmount', totalAmount);
                const response = await post('/verify-reference', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.msg) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Verified',
                        text: response.data.msg,
                    });
                }
                console.log(response);
                
                return setShowReferenceForm(false);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.msg || 'An error occurred while verifying the payment.',
                });
                console.log(error.msg);
            }
            
        
            
       
        // ORD2e2ada4f316f77d21f75809a8ee5749a117a7f0f
    };

    return (
        <div className="flex flex-row mx-auto p-6 bg-white rounded-lg my-12">
            {/* Payment Form */}
            <div className="md:w-1/2 p-6">
                <h1 className="text-[25px] font-bold mb-4 ml-[100px]">Checkout</h1>
                <form onSubmit={handleSubmit} className='w-[70%] ml-[100px]'>
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
                            <option value="paystack" disabled={true}>Pay with Paystack</option>
                            <option value="bank">Pay with Bank</option>
                        </select>
                    </div>
                    {paymentMethod === 'bank' && (
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={() => setShowReferenceForm(true)}
                                className="w-full bg-blue-500 text-white py-3 rounded-md flex items-center justify-center"
                            >
                                <MdAccountBalance className="mr-2" /> Enter Reference ID
                            </button>
                        </div>
                    )}
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
            <div className="md:w-1/2 p-6 bg-gray-100 border-l">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <div className="max-h-60 overflow-y-auto">
                    {products.map((product, index) => (
                        <div key={`${product.product_id}-${product.size}`} className="flex justify-between py-2 border-b">
                            <span>{product.name} ({product.size})</span>
                            <span>₦{product.amount.toLocaleString()} x {product.quantity}</span>
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
                                    Please ensure you have made the payment to the following bank account:
                                </p>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <strong>Bank Name:</strong> GTB
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Account Number:</strong> 0617051564
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Account Name:</strong> Osabia Michael Ayomide
                                    </p>
                                </div>
                                <p className="mt-2 text-sm text-red-600">
                                    Note: Your payment will not be reflected if you do not pay to the account above.
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition duration-200"
                            >
                                Verify Payment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentForm;