// src/PaymentForm.js
import React, { useEffect, useState } from 'react';
import NavBar from '../components/LandingPage/NavBar';
import PaymentForm from '../components/payment';


import { get, post, put, del } from '../api'






const CheckoutPage = () => {
    // console.log(location.pathname.split('/')[3]);
    // let url = 

    const [ids, setIds] = useState([...new Set(location.pathname.split('/')[3].split(','))])
    const [products, setProducts] = useState([])
    
    console.log(ids);

    useEffect(()=>{
        const fetchCart =  () => {
            ids.forEach(async id => {

            
                try {
                const { data, error } = await get(`/cart_checkout?ids=${id}`);
                if (error) {
                    throw new Error(error.msg || 'Failed to fetch cart');
                }
                console.log(data);
                // return true
                  return setProducts(data.msg) || [];
                } catch (error) {
                console.error('Error fetching cart:', error);
                return [];
                }
           })

        }

        fetchCart()
    }, [])
    
    
    const amount = 5000000; // Example amount in cents
    const email = 'user@example.com'; // Example email
    // const product = {
    //     name: 'Sample Product',
    //     size: 'M',
    //     price: 5000, // Example price in cents
    //     image: 'https://example.com/image.jpg', // Example image URL
    //     quantity: 3
    //     amount: 1000000
    // };

    return (
        <>
            <NavBar />
            <div>
                <h2>Checkout</h2>
                <PaymentForm amount={1000} product={products} />
            </div>
        </>
    );
};

export default CheckoutPage;




