import React, { useState, useEffect, useRef } from 'react';
import { MdAccountBalance } from 'react-icons/md';
import { ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { get, post, put, del } from '../api';
import Swal from 'sweetalert2';
import { FaCreditCard, FaMoneyCheckAlt } from 'react-icons/fa';

const PaymentForm = ({ products, totalAmount, removeFromCart }) => {
    // State declarations
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
    const [bankName, setBankName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [currentFee, setCurrentFee] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Refs
    const selectWrapperRef = useRef(null);
    const searchInputRef = useRef(null);

    // Calculate total with delivery
    const totalWithDelivery = totalAmount + currentFee;

    // Delivery fees structure
    const deliveryFees = {
        akure: {
            fee: 1500,
            states: ['Akure'],
            description: "Within Akure metropolitan area"
        },
        local: {
            fee: 3000,
            states: ['Ondo', 'Owo', 'Ado-Ekiti', 'Ife', 'Ilesha'],
            description: "Nearby cities and towns"
        },
        far: {
            fee: 8000,
            states: ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Edo', 'Delta', 'Kwara', 'Kogi'],
            description: "States within 3-5 hours drive"
        },
        farthest: {
            fee: 10000,
            states: [
                'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
                'Benue', 'Borno', 'Cross River', 'Ebonyi', 'Ekiti', 'Enugu',
                'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
                'Katsina', 'Kebbi', 'Nasarawa', 'Niger', 'Plateau', 'Rivers',
                'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
            ],
            description: "Distant states requiring air or long-distance transport"
        }
    };

    // Combine all states for the dropdown
    const allStates = [
        ...deliveryFees.akure.states.map(state => ({ name: state, group: 'akure' })),
        ...deliveryFees.local.states.map(state => ({ name: state, group: 'local' })),
        ...deliveryFees.far.states.map(state => ({ name: state, group: 'far' })),
        ...deliveryFees.farthest.states.map(state => ({ name: state, group: 'farthest' }))
    ].sort((a, b) => a.name.localeCompare(b.name));

    // Handle location selection
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectWrapperRef.current && !selectWrapperRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isDropdownOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isDropdownOpen]);

    // Update current fee when location changes
    useEffect(() => {
        if (!selectedLocation) {
            setCurrentFee(0);
            return;
        }

        if (deliveryFees.akure.states.includes(selectedLocation)) {
            setCurrentFee(deliveryFees.akure.fee);
        } else if (deliveryFees.local.states.includes(selectedLocation)) {
            setCurrentFee(deliveryFees.local.fee);
        } else if (deliveryFees.far.states.includes(selectedLocation)) {
            setCurrentFee(deliveryFees.far.fee);
        } else if (deliveryFees.farthest.states.includes(selectedLocation)) {
            setCurrentFee(deliveryFees.farthest.fee);
        } else {
            setCurrentFee(3500); // Default fallback fee
        }
    }, [selectedLocation]);

    // Filter states for search
    const filteredStates = allStates.filter(state =>
        state.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
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
            formData.append('location', selectedLocation);
            formData.append('total_amount', totalAmount + currentFee);
            formData.append('products', JSON.stringify(products));

            if (paymentMethod === 'bank' && bankName.trim() === '') {
                return setError("Please fill in your bank name");
               
            }
             

            if(paymentMethod === 'bank' && bankName.trim() !== ''){
                formData.append('bank_name', bankName.trim());
                setError("");
                const response = await post('/create-bank-order', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                //    return console.log(response);
    
                // Handle response
                if (!response || !response.data) {
                    throw new Error("Server error could'nt complete payment");
                }
    
                if (response.data && response.data.status === 'success') {
                    const emailNotice = response.data.email_sent
                        ? 'Check your email for payment details.'
                        : 'If Email not sent - please contact support with your reference number.';
                    // console.log(response);
    
                    setSuccess(`Order placed. ${emailNotice}`);
    
                    if (response.data.ref) {
                        setShowReferenceForm(true);
                        setEmail('')
                        setShippingAddress('')
                        setPhone('')
                        setSelectedLocation('')
                        setPaymentMethod('')
                        setBankName('')
                    }
    
                } else if (response.data.status === 'error') {
                    throw new Error(response.data.message);
                } else {
                    throw new Error('Unexpected response format');
                }
            }else{
                const response = await post('/create-order', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // console.log(response.data.authorization_url);
                if (!response || !response.data) {
                    throw new Error("Server error could'nt complete payment");
                }
        
                // Redirect to Paystack payment page
                // console.log(response);
                
                if (response.data.authorization_url) {
                    window.location.href = response.data.authorization_url;
                    localStorage.removeItem('cartMultiple');
                }
                
            }
            
            // Make API call
           

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
        setError('')

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

            if (!response.data) {
                throw new Error('Payment verification failed');
            }

            setSuccess('')
            // Success case
            Swal.fire({
                icon: 'success',
                title: 'Payment Verified',
                text: response.data.msg,
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
            {/* Mobile summary */}
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
                            {products.map((product) => (
                                <div key={`${product.product_id}-${product.size}`} className="flex justify-between py-2 border-b">
                                    <span className='text-sm'>{product.name} ({product.size})</span>
                                    <span className='text-sm'>₦{product.amount} x {product.quantity}</span>
                                    <button
                                        onClick={() => removeFromCart(product.product_id, product.size)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Subtotal</span>
                            <span>₦{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Delivery Fee</span>
                            <span>{selectedLocation ? `₦${currentFee.toLocaleString()}` : 'Select location'}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold border-t">
                            <span>Total</span>
                            <span>₦{totalWithDelivery.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Form */}
            <div className="w-full md:w-1/2 p-6">
                <h1 className="text-[25px] font-bold mb-4 md:ml-[100px]">Checkout</h1>
                <form onSubmit={handleSubmit} className='w-full md:w-[70%] md:ml-[100px]'>
                    {/* Error/Success messages */}
                    {error && <div className="mt-4 text-red-500 w-[70%]">{error}</div>}
                    {success && <div className="mt-4 text-green-500 w-[70%]">{success}</div>}

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"

                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"

                        />
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Shipping Address</label>
                        <input
                            type="text"
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"

                        />
                    </div>

                    {/* Location Select */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Delivery Location</label>
                        <div className="relative" ref={selectWrapperRef}>
                            {/* Input/Selector Box */}
                            <div
                                className={`w-full p-3 border border-gray-300 rounded-md bg-white cursor-pointer flex justify-between items-center ${isDropdownOpen ? '' : 'hover:border-gray-400'
                                    }`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className={selectedLocation ? "text-gray-800" : "text-gray-500"}>
                                    {selectedLocation || "Select your location"}
                                </span>
                                <svg
                                    className={`fill-current h-4 w-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''
                                        }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
                                    {/* Search Input */}
                                    <div className="p-2 border-b border-gray-200">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search locations..."
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                        />
                                    </div>

                                    {/* Options List */}
                                    <div className="max-h-60 overflow-y-auto border-t border-gray-200">
                                        {/* Clear Selection Option */}
                                        <div
                                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                            onClick={() => handleLocationSelect('')}
                                        >
                                            <span className="text-gray-500">Select Location</span>
                                        </div>

                                        {/* Filtered Options */}
                                        {filteredStates.length > 0 ? (
                                            filteredStates.map((state) => (
                                                <div
                                                    key={state.name}
                                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                    onClick={() => handleLocationSelect(state.name)}
                                                >
                                                    {state.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-3 text-gray-500 text-center">No locations found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Delivery Fee Display */}
                        {selectedLocation && (
                            <p className="text-sm text-gray-600 mt-1">
                                Delivery to {selectedLocation}: ₦{currentFee.toLocaleString()}
                            </p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-3 border-slate-300 rounded-md"
                        >
                            <option value="paystack">Pay with Paystack</option>
                            <option value="bank">Pay with Bank 💳</option>
                        </select>
                    </div>

                    {/* Bank Name (conditionally shown) */}
                    {paymentMethod === 'bank' && (
                        <div className="mb-4">
                            <label className="block text-gray-700">Bank Name</label>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full p-3 border-slate-300 rounded-md"
                                placeholder="Enter your bank name"

                            />
                        </div>
                    )}

                    {/* Billing Address Checkbox */}
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2" />
                                Pay ₦{totalWithDelivery.toLocaleString()}
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Desktop Order Summary */}
            <div className="hidden md:block md:w-1/2 p-6 bg-gray-100 border-l">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <div className="max-h-60 overflow-y-auto">
                    {products.map((product) => (
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
                <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                    <span>Delivery Fee</span>
                    <span>{selectedLocation ? `₦${currentFee.toLocaleString()}` : 'Select location'}</span>
                </div>
                <div className="flex justify-between py-2 font-bold border-t">
                    <span>Total</span>
                    <span>₦{totalWithDelivery.toLocaleString()}</span>
                </div>
            </div>

            {/* Reference ID Modal */}
            {showReferenceForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center sm:top-0 top-24">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Verify Payment</h2>
                        {refError && <div className="mt-4 text-red-500">{refError}</div>}
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
                                    Please ensure you have made the payment to the bank account sent to your email.
                                </p>
                                <p className="mt-2 text-sm text-red-600">
                                    Note: Your payment will not be reflected if you do not pay to the correct account.
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition duration-200"
                                disabled={loading}
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