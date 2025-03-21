// src/PaymentForm.js
import React, { useEffect, useState } from 'react';
import NavBar from '../components/LandingPage/NavBar';
import PaymentForm from '../components/payment';


// import { get, post, put, del } from '../api'






const CheckoutPage = () => {
    // console.log(location.pathname.split('/')[3]);
    // let url = 

    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        // Retrieve cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
        setCart(storedCart);
        
        // Get total amount from localStorage
       
            // Calculate total if not stored
            const calculatedTotal = storedCart.reduce((total, item) => 
                total + (item.amount * item.quantity), 0);
            setTotalAmount(calculatedTotal);
        
    }, []);

    return (
        <>
            <NavBar />
            <div>
                <h2>Checkout</h2>
                <PaymentForm products={cart} totalAmount={totalAmount} />
                <ul>
                    {cart.map((item, index) => (
                        <li key={`${item.product_id}-${item.size}-${index}`}>
                            {item.name} - {item.size} - {item.quantity}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default CheckoutPage;




