import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import NavBar from '../components/LandingPage/NavBar';
import PaymentForm from '../components/payment';

const CheckoutPage = () => {
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const { productId } = useParams(); // Extract productId from the URL

    useEffect(() => {
        // Retrieve cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
        setCart(storedCart);

        // Split the productId parameter into an array of IDs
        const productIds = productId.split(',');

        // Filter the cart to include only items with matching productIds
        const filteredCart = storedCart.filter(item => 
            productIds.includes(item.product_id)
        );

        // Calculate total amount for the filtered cart
        const calculatedTotal = filteredCart.reduce((total, item) => 
            total + (item.amount * item.quantity), 0);
        setTotalAmount(calculatedTotal);
    }, [productId]); // Re-run effect when productId changes

    // Function to remove an item from the cart
    const removeFromCart = (productId, size) => {
        const updatedCart = cart.filter(item => 
            !(item.product_id === productId && item.size === size)
        );
        setCart(updatedCart);
        localStorage.setItem('cartMultiple', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));

        // Split the productId parameter into an array of IDs
        const productIds = productId.split(',');

        // Recalculate total amount for the filtered cart
        const filteredCart = updatedCart.filter(item => 
            productIds.includes(item.product_id)
        );
        const newTotal = filteredCart.reduce((total, item) => 
            total + (item.amount * item.quantity), 0);
        setTotalAmount(newTotal);
    };

    return (
        <>
            <NavBar />
            <div>
                <h2>Checkout</h2>
                <PaymentForm 
                    products={cart.filter(item => productId.split(',').includes(item.product_id))} // Pass only the filtered cart
                    totalAmount={totalAmount} 
                    removeFromCart={removeFromCart} 
                />
            </div>
        </>
    );
};

export default CheckoutPage;