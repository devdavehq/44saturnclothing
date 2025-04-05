import React, { useState, useEffect, useCallback, useRef } from "react";
import NavBar from '../components/LandingPage/NavBar';
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { ShoppingCart } from 'lucide-react';
import { get, post } from '../api';

const ShopPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({}); // { product_id: quantity }
    const [cart, setCart] = useState([]);
    const cartInitializedRef = useRef(false);

    const navigate = useNavigate();

    // Memoized function to process product data
    const processProductData = useCallback((item) => {
        const mainImage = item.image_url ? `${import.meta.env.VITE_SERVER_URL}/${JSON.parse(item.image_url)[0]}` : '';
        const hoverImage = item.hoverImage ? `${import.meta.env.VITE_SERVER_URL}/${item.hoverImage}` : '';

        let sizes = [];
        let prices = [];
        try {
            const priceArray = JSON.parse(item.price_size);
            if (Array.isArray(priceArray)) {
                sizes = priceArray.map((ps) => ps.size);
                prices = priceArray.map((ps) => ps.price);
            }
        } catch (error) {
            console.error("Error parsing price_size:", error);
        }

        return {
            ...item,
            mainImage,
            hoverImage,
            sizes,
            prices,
        };
    }, []);

    // Initialize cart only once
    useEffect(() => {
        if (!cartInitializedRef.current) {
            const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
            setCart(storedCart);
            cartInitializedRef.current = true;
        }
    }, []);

    // Cart update listener with setTimeout to break circular dependency
    useEffect(() => {
        const handleCartUpdate = () => {
            // Use setTimeout to defer the state update to the next tick
            setTimeout(() => {
                const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
                setCart(storedCart);
            }, 0);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // Optimized product fetching
    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                const res = await get("/display_products");
                if (!isMounted) return;

                if (res.error) throw new Error(res.error);

                if (res.data) {
                    // Process products in batches for better performance
                    const batchSize = 10;

                    for (let i = 0; i < res.data.msg.length; i += batchSize) {
                        const batch = res.data.msg.slice(i, i + batchSize);
                        const processedBatch = batch.map(processProductData);

                        if (isMounted) {
                            setProducts(prev => [...prev, ...processedBatch]);
                            if (i === 0) setLoading(false); // Show first batch immediately
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                if (isMounted) setLoading(false);
            }
        };

        setLoading(true);
        setProducts([]); // Reset products before fetching
        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [processProductData]);

    // Add to cart function
    const addToCart = async (product_id, size, quantity, image, amount, name, stockQuan) => {
        try {
            const existingItemIndex = cart.findIndex(
                item => item.product_id === product_id && item.size === size.toLowerCase()
            );

            const updatedCart = [...cart];

            if (existingItemIndex !== -1) {
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + quantity
                };
            } else {
                updatedCart.push({
                    product_id,
                    size: size.toLowerCase(),
                    quantity,
                    image,
                    amount: amount * quantity,
                    name,
                    stockQuan: stockQuan
                });
            }

            // Update localStorage first
            localStorage.setItem('cartMultiple', JSON.stringify(updatedCart));

            // Then update state
            setCart(updatedCart);

            // Dispatch event after state is updated
            setTimeout(() => {
                window.dispatchEvent(new Event('cartUpdated'));
            }, 0);

            // API call in background
            let formData = new FormData();
            formData.append('product_id', product_id);
            formData.append('size', size.toLowerCase());
            formData.append('quantity', quantity);
            formData.append('image', image);
            formData.append('amount', amount * quantity);

            await post('/cart/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Filter products based on search term and filter
    const filteredItems = products.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === "all") return matchesSearch;
        if (filter === "sold out") return matchesSearch && item.stock_quantity <= 0;
        if (filter === "recent") {
            // Assuming items have a created_at field in the database
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const itemDate = new Date(item.created_at);
            return matchesSearch && itemDate >= oneMonthAgo;
        }
        return matchesSearch;
    });
    // Function to get the largest price from the prices array
    const getLargestPrice = (prices) => {
        if (!prices || prices.length === 0) return "N/A";
        const maxPrice = Math.max(...prices);
        return `₦${maxPrice.toLocaleString()}`; // Format as Naira
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col mt-16 p-6">
                <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto justify-start md:justify-end">
                        <FaFilter className="text-gray-700 mr-2" />
                        <select
                            className="w-full md:w-auto px-3 py-2 border rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-0"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="recent">Recent</option>
                            <option value="sold out">Sold Out</option>
                        </select>
                    </div>
                </div>

                <p className="text-gray-600 mb-4">Showing {filteredItems.length} products</p>

                {loading ? (
                    <div className="flex justify-center items-center w-full min-h-[50vh]">
                        <motion.div
                            className="w-12 h-12 border-[5px] border-gray-300 border-t-black border-l-transparent rounded-full shadow-md"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        ></motion.div>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.product_id}
                                className="border rounded-lg shadow-md p-4 bg-white flex flex-col relative overflow-hidden pb-7 hover:shadow-lg transition-shadow duration-300"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.2, delay: item.id * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Improved image container with proper sizing */}
                                <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100 md:h-80"> {/* Increased height for better image display */}
                                    {item.stock_quantity <= 0 && (
                                        <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md z-10">Sold Out</div>
                                    )}
                                    <motion.img
                                        src={item.mainImage}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-lg"
                                        style={{ position: 'absolute' }}
                                        initial={{ opacity: 1 }}
                                        whileHover={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.img
                                        src={item.hoverImage}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-lg"
                                        style={{ position: 'absolute' }}
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                {/* Product info with proper linking */}
                                <div className="mt-4 flex flex-col items-start relative">
                                    <Link
                                        to={`/product/${encodeURIComponent(item.name)}`}
                                        className="font-semibold text-black hover:underline w-full truncate"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="text-gray-500">{getLargestPrice(item.prices)}</p>
                                    <button
                                        className={`p-1 rounded-sm absolute right-4 top-4 ${item.stock_quantity <= 0
                                            ? 'opacity-50 cursor-not-allowed bg-gray-300'
                                            : 'bg-black text-white cursor-pointer hover:bg-gray-800'
                                            }`}>
                                        <ShoppingCart
                                            className={`h-5 w-5 ${item.stock_quantity <= 0 ? 'text-gray-500' : 'text-white'}`}
                                            onClick={() => {
                                                const newQuantity = (quantities[item.product_id] || 0) + 1;
                                                setQuantities(prev => ({
                                                    ...prev,
                                                    [item.product_id]: newQuantity,
                                                }));
                                                // Ensure size is lowercase when adding to cart
                                                addToCart(
                                                    item.product_id,
                                                    item.sizes[0].toLowerCase(),
                                                    1,
                                                    item.mainImage,
                                                    Math.max(...item.prices),
                                                    item.name,
                                                    item.stock_quantity
                                                );
                                            }}
                                        />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default ShopPage;