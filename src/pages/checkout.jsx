// src/PaymentForm.js
import React, { useState } from 'react';
import NavBar from '../components/LandingPage/NavBar';
import PaymentForm from '../components/payment';

const CheckoutPage = () => {
    const amount = 5000; // Example amount in cents
    const email = 'user@example.com'; // Example email
    const product = {
        name: 'Sample Product',
        size: 'M',
        price: 5000, // Example price in cents
        image: 'https://example.com/image.jpg' // Example image URL
    };

    return (
        <>
            <NavBar />
            <div>
                <h2>Checkout</h2>
                <PaymentForm amount={amount} product={product} />
            </div>
        </>
    );
};

export default CheckoutPage;




