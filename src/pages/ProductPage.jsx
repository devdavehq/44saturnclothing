import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from '../components/LandingPage/NavBar';
import { get, post } from '../api';

const ProductPage = () => {
    const [selectedSize, setSelectedSize] = useState("SM");
    const [mainProduct, setMainProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quan, setQuan] = useState({}); // Track quantity for each product
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cartMultiple')) || []);
    const navigate = useNavigate();

    const { productName } = useParams();

    // Add this useEffect to listen for cart updates
    const cartInitializedRef = useRef(false);

    // Ref for the cart drawer

    // Initialize cart items only once
    useEffect(() => {
        if (!cartInitializedRef.current) {
            const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
            setCart(storedCart);
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
                setCart(storedCart);
            }, 0);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    // Add to cart function
    const addToCart = async (product_id, size, quantity, image, amount, name) => {
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
                    name 
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

            let formData = new FormData();
            formData.append('product_id', product_id);
            formData.append('size', size.toLowerCase());
            formData.append('quantity', quantity);
            formData.append('image', image);
            formData.append('amount', amount * quantity);

            await post('/cart/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Fetch product details
    useEffect(() => {
        const fetchData = async () => {
            if (!productName) {
                setError("Product name is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const encodedName = encodeURIComponent(productName);
                const productResponse = await get(`/get_product_by_name?name=${encodedName}`);

                if (productResponse.data.msg) {
                    const product = productResponse.data.msg;
                    const imageUrls = JSON.parse(product.image_url || '[]');
                    product.images = imageUrls;
                    setMainProduct(product);
                    setSelectedImage(product.images[0]);

                    if (product.category) {
                        try {
                            const relatedResponse = await get(`/get_related_products?category=${encodeURIComponent(product.category)}`);
                            if (relatedResponse.data) {
                                setRelatedProducts(relatedResponse.data.data);
                            }
                        } catch (relatedError) {
                            console.error("Error fetching related products:", relatedError);
                        }
                    }
                } else if (productResponse.error) {
                    setError(productResponse.error);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productName]);

    if (error) return (
        <div className="h-screen flex items-center justify-center bg-purple-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Error: {error}</h1>
                <p className="text-lg text-gray-600 mt-2">Back to the shop page</p>
                <a
                    href="/shop"
                    className="mt-6 inline-block text-lg font-semibold text-black border border-black px-6 py-2 rounded-lg transition duration-300 hover:bg-black hover:text-white"
                >
                    Shop
                </a>
            </div>
        </div>
    );

    if (!mainProduct) return <div>Product not found</div>;

    // Parse the price_size string into an object
    const parsedPriceSize = JSON.parse(mainProduct.price_size || '[]');
    const parsedSizes = parsedPriceSize.map(item => item.size);

    return (
        <>
            <NavBar />
            <div className="max-w-6xl mx-auto p-6 mt-[100px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Side Product Images */}
                    <div className="space-y-4">
                        <motion.div className="h-[500px] overflow-hidden rounded-lg">
                            <img
                                src={`${import.meta.env.VITE_SERVER_URL}/${selectedImage}`}
                                alt={mainProduct.name}
                                className="w-full h-full object-cover object-center"
                            />
                        </motion.div>
                        {/* Thumbnail Images */}
                        <div className="flex space-x-2 overflow-x-auto">
                            {mainProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                                    alt={`${mainProduct.name} view ${index + 1}`}
                                    className="h-20 w-20 object-cover cursor-pointer rounded-md"
                                    onClick={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <div className="mb-6">
                            <motion.div className="h-[300px] overflow-hidden rounded-lg object-cover object-center">
                                <img
                                    src={`${import.meta.env.VITE_SERVER_URL}/${mainProduct.hoverImage}`}
                                    alt={mainProduct.name}
                                    className="w-full h-full object-cover object-center"
                                />
                            </motion.div>
                        </div>

                        <h1 className="text-2xl font-bold">{mainProduct.name}</h1>
                        <p className="text-xl text-gray-500 my-2">
                            {parsedPriceSize.find(p => p.size === selectedSize.toLowerCase())?.price ||
                                parsedPriceSize[0]?.price || '0'} NGN
                        </p>
                        <div className="flex space-x-2 my-4">
                            {parsedSizes.map((size) => (
                                <button
                                    key={size}
                                    className={`px-4 py-2 border ${selectedSize.toLowerCase() === size ? "bg-black text-white" : "bg-white text-black"
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <p className="text-gray-600 my-4">{mainProduct.description}</p>
                        <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-600"
                            onClick={() => {
                                const newQuantity = (quan[mainProduct.product_id] || 0) + 1;
                                setQuan((prev) => ({
                                    ...prev,
                                    [mainProduct.product_id]: newQuantity,
                                }));
                                addToCart(mainProduct.product_id, selectedSize.toLowerCase(), 1, `${import.meta.env.VITE_SERVER_URL}/${mainProduct.hoverImage}`, parsedPriceSize.find(p => p.size === selectedSize.toLowerCase())?.price, mainProduct.name);
                            }}
                        >
                            Add to Cart
                        </button>
                        <button className="w-full mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-300"
                            onClick={() => {
                                addToCart(mainProduct.product_id, selectedSize.toLowerCase(), 1, `${import.meta.env.VITE_SERVER_URL}/${mainProduct.hoverImage}`, parsedPriceSize.find(p => p.size === selectedSize.toLowerCase())?.price, mainProduct.name);
                                navigate(`/product/checkout/${mainProduct.product_id}`);
                            }}
                        >
                            Buy It Now
                        </button>
                    </div>
                </div>

                {/* Related Products */}
                {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold mt-12">Related Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            {relatedProducts.map((product) => (
                                <div key={product.product_id} className="border rounded-lg overflow-hidden shadow-lg">
                                    <img
                                        src={`${import.meta.env.VITE_SERVER_URL}/${product.hoverImage}`}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold">{product.name}</h3>
                                        <p className="text-gray-500">
                                            {JSON.parse(product.price_size)[0]?.price || '0'} NGN
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProductPage;