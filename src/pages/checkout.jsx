import React, { useEffect, useState } from 'react';
import NavBar from '../components/LandingPage/NavBar';
import PaymentForm from '../components/payment';

const CheckoutPage = () => {
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        // Retrieve cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
        setCart(storedCart);
        
        // Calculate total amount
        const calculatedTotal = storedCart.reduce((total, item) => 
            total + (item.amount * item.quantity), 0);
        setTotalAmount(calculatedTotal);
    }, []);

    // Function to remove an item from the cart
    const removeFromCart = (productId, size) => {
        const updatedCart = cart.filter(item => 
            !(item.product_id === productId && item.size === size)
        );
        setCart(updatedCart);
        localStorage.setItem('cartMultiple', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        // Recalculate total amount
        const newTotal = updatedCart.reduce((total, item) => 
            total + (item.amount * item.quantity), 0);
        setTotalAmount(newTotal);
    };

    return (
        <>
            <NavBar />
            <div>
                <h2>Checkout</h2>
                <PaymentForm 
                    products={cart} 
                    totalAmount={totalAmount} 
                    removeFromCart={removeFromCart} 
                />
            </div>
        </>
    );
};

export default CheckoutPage;