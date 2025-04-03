import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, X, Minus, Plus, ChevronDown } from "lucide-react";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../../Images/assets";
<<<<<<< HEAD
=======
import Swal from 'sweetalert2';
import { get } from '../../api';

>>>>>>> 094bf57 (updated code and fixed issues)

const NavBar = () => {
    const navigate = useNavigate();
    const [currency, setCurrency] = useState("NGN");
    const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const cartInitializedRef = useRef(false);

    // Ref for the cart drawer
    const cartRef = useRef(null);

    // Initialize cart items only once
    useEffect(() => {
        if (!cartInitializedRef.current) {
            const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
            setCartItems(storedCart);
            cartInitializedRef.current = true;
        }
    }, []);

    // Listen for cart updates with a ref to prevent circular updates
    useEffect(() => {
        const handleCartUpdate = () => {
            // Use setTimeout to defer the state update to the next tick
            // This breaks the circular dependency during render
            setTimeout(() => {
                const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
                setCartItems(storedCart);
            }, 0);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

<<<<<<< HEAD
=======


    useEffect(() => {
        const checkStockInterval = setInterval(async () => {
          try {
            // 1. Get current cart from localStorage
            const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
            if (storedCart.length === 0) return;
      
            // 2. Fetch all products to get current stock
            const response = await get('/display_products');
            const products = response.data?.msg || [];
            
            // 3. Create stock lookup map (product_id -> stock_quantity)
            const stockMap = {};
            products.forEach(product => {
              stockMap[product.product_id] = product.stock_quantity;
            });
      
            // 4. Filter cart - remove items that either:
            //    - Don't exist in stockMap (product deleted) OR
            //    - Have stock_quantity <= 0
            const updatedCart = storedCart.filter(item => {
              // Check if product exists in stock data
              if (!(item.product_id in stockMap)) {
                return false; // Remove if product no longer exists
              }
              
              // Check if product is out of stock
              return stockMap[item.product_id] > 0;
            });
      
            // 5. Update if changes were made
            if (updatedCart.length !== storedCart.length) {
              localStorage.setItem('cartMultiple', JSON.stringify(updatedCart));
              window.dispatchEvent(new Event('cartUpdated'));
              
              Swal.fire({
                icon: 'info',
                title: 'Cart Updated',
                text: 'Some items were removed as they are no longer available',
                timer: 3000
              });
              location.href = '/'
            }
          } catch (error) {
            console.error('Error checking stock:', error);
          }
        }, 3000); // Check every 3 seconds
      
        return () => clearInterval(checkStockInterval);
      }, []);
// console.log(cartItems);

>>>>>>> 094bf57 (updated code and fixed issues)
    // Close cart when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        // Add event listener when the cart is open
        if (isCartOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCartOpen]);

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.amount * item.quantity);
    }, 0);

    

    // Update the quantity change handler
    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item =>
                item.product_id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            ).filter(item => item.quantity > 0); // Remove items with quantity < 1
    
            localStorage.setItem('cartMultiple', JSON.stringify(updatedItems));
            window.dispatchEvent(new Event('cartUpdated'));
            return updatedItems;
        });
    };

    // Update the remove item handler
    const removeItem = (productId, size) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item => 
                !(item.product_id === productId && item.size === size) // Remove item if both productId and size match
            );
            localStorage.setItem('cartMultiple', JSON.stringify(updatedItems));
            window.dispatchEvent(new Event('cartUpdated'));
            return updatedItems;
        });
    };

    // Handle checkout with total as separate value
    const handleCheckout = () => {
        // Store total amount in localStorage
        localStorage.setItem('cartMultiple', JSON.stringify(cartItems));
        
        // Navigate to checkout with product IDs
        navigate(`/product/checkout/${cartItems.map((item) => item.product_id).join(',')}`);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow w-full">
            <div className="container mx-auto px-4 ">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="hidden sm:block text-2xl font-serif italic">
                        44saturn
                    </Link>

                    {/* Navigation - Hidden on small screens */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {["/", "/shop", "/about", "/contact"].map((path) => (
                            <Link
                                key={path}
                                to={path}
                                className={`relative tracking-widest hover:text-gray-600 dark:hover:text-gray-300 ${
                                    location.pathname === path
                                        ? "text-lg after:content-[''] after:absolute after:left-1/2 after:bottom-[-4px] after:w-[70%] after:h-[3px] after:bg-black after:-translate-x-1/2"
                                        : "text-sm"
                                }`}
                            >
                                {path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 focus:outline-none" onClick={() => setIsShopDropdownOpen((prev) => !prev)}>
                        <FaBars className="h-6 w-6" />
                    </button>

                    {/* Mobile Logo */}
                    {/* <Link to="/" className="md:hidden xl:hidden lg:hidden text-2xl font-serif italic">
                        44saturn
                    </Link> */}
                    <Link to="/">
                    <img
                    src={assets.logo}
                    alt="Logo"
                    className="p-4 text-xl font-semibold w-[90px] rounded-full md:hidden xl:hidden lg:hidden"
                    />
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 md:space-x-4">
                        {/* Currency */}
                        <div className="relative md:block hidden">
                            <button onClick={() => setIsCurrencyMenuOpen((prev) => !prev)} className="text-sm tracking-widest flex items-center hover:text-gray-600 dark:hover:text-gray-300">
                                {currency} <ChevronDown className="h-4 w-4 ml-1" />
                            </button>
                            {isCurrencyMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute mt-2 bg-white dark:bg-gray-800 border shadow-lg rounded p-2"
                                >
                                    {["NGN"].map((curr) => (
                                        <button
                                            key={curr}
                                            className="block text-left w-full py-2 hover:text-gray-600"
                                            onClick={() => {
                                                setCurrency(curr);
                                                setIsCurrencyMenuOpen(false);
                                            }}
                                        >
                                            {curr}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Cart */}
                        <button className="p-2 relative" onClick={() => setIsCartOpen((prev) => !prev)}>
                            <ShoppingCart className="h-5 w-5 mt-1" />
                            {cartItems.length > 0 && ( // Only show red dot if cart is not empty
                                <div className="w-2 h-2 rounded-full bg-red-500 absolute right-1 top-3"></div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isShopDropdownOpen && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="absolute left-0 w-full md:hidden bg-white dark:bg-gray-800 shadow-md overflow-hidden"
                >
                    {["/", "/shop", "/about", "/contact"].map((path) => (
                        <Link
                            key={path}
                            to={path}
                            onClick={() => setIsShopDropdownOpen(false)} // Close dropdown on link click
                            className={`block py-2 px-4 relative transition-all duration-300 ease-in-out ${
                                location.pathname === path
                                    ? "text-lg after:transition-all after:duration-300 after:ease-in-out"
                                    : "text-sm after:bg-transparent after:transition-all after:duration-300 after:ease-in-out"
                            }`}
                        >
                            {path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}
                        </Link>
                    ))}
                </motion.div>
            )}

            {/* Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        ref={cartRef} // Attach ref to the cart drawer
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 w-[95%] md:w-[400px] h-full bg-white dark:bg-gray-800 shadow-lg z-50 p-4"
                    >
                        <div className="flex justify-between items-center border-b dark:border-gray-700 pb-7 p-5">
                            <h2 className="text-lg font-bold">Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="max-h-[60%] overflow-y-auto"> {/* Scrollable container for cart items */}
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={`${item.product_id}-${item.size}`} className="flex items-center space-x-4 border-b dark:border-gray-700 p-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-16 w-16 object-cover rounded"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p>
                                                {currency} {item.amount} x {item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-500">Size: {item.size.toUpperCase()}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                className="p-1 border rounded hover:bg-gray-100" 
                                                onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button 
                                                className="p-1 border rounded hover:bg-gray-100" 
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button 
                                            className="p-1 border rounded text-red-600 hover:bg-red-50" 
                                            onClick={() => removeItem(item.product_id, item.size)}
                                            aria-label="Remove item"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="md:w-full w-[80%] md:p-0 p-5 md:block flex flex-col justify-center align-middle ml-7 md:ml-0">
                                        <p className="text-center w-full text-2xl font-extrabold">Your cart is empty.</p>
                                        <button
                                            className="text-center w-full md:w-48  text-sm font-bold bg-black py-4 md:px-12 px-0 text-white rounded shadow hover:bg-gray-800 transition duration-300 ease-in-out transform hover:translate-y-1 md:ml-[70px] mt-4"
                                            onClick={() => navigate('/shop')}
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        {cartItems.length > 0 && (
                            <div className="border-t dark:border-gray-700 pt-2 mt-10">
                                <div className="flex justify-between items-center py-4">
                                    <span className="font-semibold">Total:</span>
                                    <span>
                                        {currency} {totalPrice.toLocaleString()}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="text-center  md:w-48 text-sm font-bold bg-black py-3 text-white rounded shadow hover:bg-gray-800 transition duration-300 ease-in-out"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default NavBar;