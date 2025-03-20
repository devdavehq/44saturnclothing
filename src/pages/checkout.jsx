// src/PaymentForm.js
import React, { useEffect, useState } from 'react';
import NavBar from '../components/LandingPage/NavBar';
import PaymentForm from '../components/payment';


// import { get, post, put, del } from '../api'






const CheckoutPage = () => {
    // console.log(location.pathname.split('/')[3]);
    // let url = 

    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Retrieve cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
        setCart(storedCart);

        // Calculate total amount
       
    }, []);

    return (
        <>
            <NavBar />
            <div>
                <h2>Checkout</h2>
                <PaymentForm products={cart} />
            </div>
        </>
    );
};

export default CheckoutPage;




