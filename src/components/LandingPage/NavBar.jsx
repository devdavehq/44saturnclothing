import React, { useState, useEffect, useRef } from "react";
import { Search, ShoppingBag, X, Minus, Plus, ChevronDown, ShoppingCart } from "lucide-react";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { get, post, del } from '../../api';

const NavBar = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("NGN");
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [cartActive, setCartActive] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Ref for the cart drawer
  const cartRef = useRef(null);

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

  // Fetch cart items from the backend
  const fetchCart = async () => {
    try {
      const { data, error } = await get('/cart');
      if (error) {
        throw new Error(error.message || 'Failed to fetch cart');
      }
      return data.cart || [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  };

  const updateCartItemQuantity = async (cart_id, quantity) => {
    try {
      let formData = new FormData()
      formData.append('cart_id', cart_id);
      formData.append('quantity', quantity);
      const { data, error } = await post('/cart/update', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
      if (error) {
        throw new Error(error.message || 'Failed to update cart');
      }
      return data.cart || [];
    } catch (error) {
      console.error('Error updating cart:', error);
      return [];
    }
  };

  const removeCartItem = async (cart_id) => {
    try {
      const { data, error } = await del('/cart/remove', { cart_id });
      if (error) {
        throw new Error(error.message || 'Failed to remove item from cart');
      }
      return data.cart || [];
    } catch (error) {
      console.error('Error removing from cart:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      const cartData = await fetchCart();
      setCartItems(cartData);
      setCartActive(cartData.length > 0);
    };

    fetchCartData();
    const intervalId = setInterval(fetchCartData, 5000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateCartItemQuantity = async (cart_id, delta) => {
    const item = cartItems.find((item) => item.cart_id === cart_id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        const updatedCart = await updateCartItemQuantity(cart_id, newQuantity);
        if (updatedCart && Array.isArray(updatedCart)) {
          setCartItems(updatedCart); // Update the state with the new cart data
        }
      } else {
        const updatedCart = await updateCartItemQuantity(cart_id, newQuantity);
        if (updatedCart && Array.isArray(updatedCart)) {
          setCartItems(updatedCart); // Update the state with the new cart data
        }
      }
    }
  };

  const handleRemoveCartItem = async (cart_id) => {
    const updatedCart = await removeCartItem(cart_id);
    if (updatedCart && Array.isArray(updatedCart)) {
      setCartItems(updatedCart); // Update the state with the new cart data
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    try {
      const prices = JSON.parse(item.price_size || '[]');
      const priceObj = prices.find((p) => p.size === item.size);
      const price = priceObj ? parseFloat(priceObj.price) : 0;
      return total + price * item.quantity;
    } catch (error) {
      console.error("Error calculating price for item:", item, error);
      return total;
    }
  }, 0);

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
              {cartActive && (
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
                cartItems.map((item) => {
                  let price = 0;
                  try {
                    const prices = JSON.parse(item.price_size || '[]');
                    const priceObj = prices.find((p) => p.size === item.size);
                    price = priceObj ? parseFloat(priceObj.price) : 0;
                  } catch (error) {
                    console.error("Error parsing price for item:", item, error);
                  }

                  return (
                    <div key={item.cart_id} className="flex items-center space-x-4 border-b dark:border-gray-700 pb-2">
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL}/${item.hoverImage}`} // Construct the full image URL
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p>
                          {currency} {price.toLocaleString()} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 border rounded" onClick={() => handleUpdateCartItemQuantity(item.cart_id, -1)}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <button className="p-1 border rounded" onClick={() => handleUpdateCartItemQuantity(item.cart_id, 1)}>
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button className="p-1 border rounded text-red-600" onClick={() => handleRemoveCartItem(item.cart_id)}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
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
                  to={`/product/checkout/${cartItems.map((item) => item.product_id).join(',')}`}
                  className="text-center px-20 md:w-48 text-sm font-bold bg-black py-3 text-white rounded shadow hover:bg-gray-800 transition duration-300 ease-in-out"
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