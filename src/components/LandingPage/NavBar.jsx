import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, X, Minus, Plus, ChevronDown } from "lucide-react";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    const [currency, setCurrency] = useState("NGN");
    const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
    const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartMultiple')) || []);

    // Ref for the cart drawer
    const cartRef = useRef(null);

    // Listen for cart updates
    useEffect(() => {
        const handleCartUpdate = () => {
            const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
            setCartItems(storedCart);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        handleCartUpdate(); // Initial load
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

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
        return total + item.amount * item.quantity;
    }, 0);

    // Updated quantity handler
    const updateQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) => {
            let updatedItems;
            
            // If quantity is less than 1, remove the item
            if (newQuantity < 1) {
                updatedItems = prevItems.filter(item => item.product_id !== productId);
            } else {
                // Otherwise update the quantity
                updatedItems = prevItems.map(item =>
                    item.product_id === productId 
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }

            // Update localStorage and dispatch event
            localStorage.setItem('cartMultiple', JSON.stringify(updatedItems));
            window.dispatchEvent(new Event('cartUpdated'));
            
            return updatedItems;
        });
    };

    // Cart item JSX with updated quantity controls
    const renderCartItem = (item) => (
        <div key={item.product_id} className="flex items-center space-x-4 border-b dark:border-gray-700 pb-2">
            <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 object-cover rounded"
            />
            <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p>
                    {currency} {item.amount.toLocaleString()} x {item.quantity}
                </p>
                <p className="text-sm text-gray-500">Size: {item.size.toUpperCase()}</p>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    className="p-1 border rounded hover:bg-gray-100" 
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
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
                onClick={() => updateQuantity(item.product_id, 0)} // Set quantity to 0 to remove
                aria-label="Remove item"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );

    // Update the checkout handler
    const handleCheckout = () => {
        const itemsWithFinalAmount = cartItems.map(item => ({
            ...item,
            finalAmount: item.amount * item.quantity
        }));
        localStorage.setItem('cartMultiple', JSON.stringify(itemsWithFinalAmount));
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
                    <Link to="/" className="md:hidden xl:hidden lg:hidden text-2xl font-serif italic">
                        44saturn
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 md:space-x-4">
                        {/* Currency */}
                        <div className="relative">
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
                        <div className="mt-4 space-y-4 p-4 overflow-y-scroll">
                            {cartItems.length > 0 ? (
                                cartItems.map(renderCartItem)
                            ) : (
                                <>
                                    <div>
                                        <p className="text-center w-full text-2xl font-extrabold">Your cart is empty.</p>
                                        <button
                                            className="text-center w-full md:w-48 text-sm font-bold bg-black py-4 px-12 text-white rounded shadow hover:bg-gray-800 transition duration-300 ease-in-out transform hover:translate-y-1 ml-[70px] mt-4"
                                            onClick={() => navigate('/shop')}
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        {cartItems.length > 0 && (
                            <div className="border-t dark:border-gray-700 pt-2 ">
                                <div className="flex justify-between items-center py-4">
                                    <span className="font-semibold">Total:</span>
                                    <span>
                                        {currency} {totalPrice.toLocaleString()}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="text-center px-1 w-48 text-sm font-bold bg-black py-3 text-white rounded shadow hover:bg-gray-800 transition duration-300 ease-in-out"
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