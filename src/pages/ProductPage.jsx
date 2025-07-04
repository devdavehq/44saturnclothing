import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from '../components/LandingPage/NavBar';
import { get, post } from '../api';

const ProductPage = () => {

    const [selectedSize, setSelectedSize] = useState("");
    const [mainProduct, setMainProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sizeerror, setSizeError] = useState(null);

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

    const addToCart = async (product_id, size, quantity, image, amount, name, stockQuan) => {
        try {
            const existingItemIndex = cart.findIndex(
                item => item.product_id === product_id && item.size === size.toLowerCase()
            );

            setSizeError('')
            if (size === '') {
                return setSizeError('Please select size')
            }
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
    const parsedSizes = parsedPriceSize.map(item => item.size.toString().toLowerCase());

    return (
        <>
            <NavBar />
            <div className="max-w-6xl mx-auto p-4 md:p-6 mt-[80px] md:mt-[100px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {/* Side Product Images */}
                    <div className="space-y-3 md:space-y-4">
                        <motion.div className="h-[400px] md:h-[500px] overflow-hidden rounded-lg">
                            <img
                                src={`${import.meta.env.VITE_SERVER_URL}/${selectedImage}`}
                                alt={mainProduct.name}
                                className="w-full h-full object-contain object-center" // Changed to object-contain
                                loading="lazy"
                                decoding="async"
                            />
                        </motion.div>
                        {/* Thumbnail Images - Horizontal scroll on mobile */}
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {mainProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                                    alt={`${mainProduct.name} view ${index + 1}`}

                                    className="h-16 w-16 md:h-20 md:w-20 object-cover cursor-pointer rounded-md"
                                    onClick={() => setSelectedImage(image)}
                                    loading="lazy"
                                    decoding="async"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="md:sticky md:top-[100px] md:self-start">
                        <div className="mb-4 md:mb-6">
                            <motion.div className="h-[400px] md:h-[500px] overflow-hidden rounded-lg flex items-center justify-center bg-gray-50">
                                <img
                                    src={`${import.meta.env.VITE_SERVER_URL}/${mainProduct.hoverImage}`}
                                    alt={mainProduct.name}
                                    className="max-w-full max-h-full object-contain"  // Changed to object-contain
                                />
                            </motion.div>
                        </div>

                        <h1 className="text-xl md:text-2xl font-bold">{mainProduct.name}</h1>
                        <p className="text-lg md:text-xl text-gray-500 my-2">
                            {parsedPriceSize.find(p => p.size === selectedSize.toLowerCase())?.price ||
                                parsedPriceSize[0]?.price || '0'} NGN
                        </p>

                        {/* Size Selector - Wrap on mobile */}
                        {sizeerror && (
                            <p className="text-red-500">{sizeerror}</p>
                        )}
                        <div className="flex flex-wrap gap-2 my-3 md:my-4">
                            {parsedSizes.map((size) => (
                                <button
                                    key={size}
                                    className={`px-3 py-1 md:px-4 md:py-2 border text-sm md:text-base ${selectedSize.toLowerCase() === size.toLowerCase()
                                            ? "bg-black text-white"
                                            : "bg-white text-black"
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size.toUpperCase()} {/* Display as uppercase while storing lowercase */}
                                </button>
                            ))}
                        </div>


                        <p className="text-gray-600 my-3 md:my-4 text-sm md:text-base">
                            {mainProduct.description}
                        </p>

                        {/* Buttons - Stack on mobile */}
                        <div className="space-y-2">
                            <button
                                className={`w-full py-2 px-4 rounded text-sm md:text-base ${mainProduct.stock_quantity <= 0
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-600 cursor-pointer'
                                    }`}
                                onClick={() => {
                                    if (mainProduct.stock_quantity > 0) {
                                        const newQuantity = (quan[mainProduct.product_id] || 0) + 1;
                                        setQuan((prev) => ({
                                            ...prev,
                                            [mainProduct.product_id]: newQuantity,
                                        }));
                                        addToCart(
                                            mainProduct.product_id,
                                            selectedSize.toLowerCase(), // Force lowercase
                                            1,
                                            `${import.meta.env.VITE_SERVER_URL}/${mainProduct.hoverImage}`,
                                            parsedPriceSize.find(p => p.size.toLowerCase() === selectedSize.toLowerCase())?.price,
                                            mainProduct.name,
                                            mainProduct.stock_quantity
                                        );
                                    }
                                }}
                                disabled={mainProduct.stock_quantity <= 0}
                                aria-disabled={mainProduct.stock_quantity <= 0}
                            >
                                {mainProduct.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            <button
                                className={`w-full mt-2 py-2 px-4 rounded text-sm md:text-base ${mainProduct.stock_quantity <= 0
                                    ? 'bg-gray-300 text-gray-200 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-300 cursor-pointer'
                                    }`}
                                onClick={() => {
                                    if (mainProduct.stock_quantity > 0) {
                                        addToCart(
                                            mainProduct.product_id,
                                            selectedSize.toLowerCase(),
                                            1,
                                            `${import.meta.env.VITE_SERVER_URL}/${mainProduct.hoverImage}`,
                                            parsedPriceSize.find(p => p.size.toLowerCase() === selectedSize.toLowerCase())?.price,
                                            mainProduct.name, mainProduct.stock_quantity
                                        );
                                        if (selectedSize === '') {
                                            sizeerror('Please select a size');
                                        }
                                        location.href = `/product/checkout/${mainProduct.product_id}`
                                    }
                                }}
                                disabled={mainProduct.stock_quantity <= 0}
                                aria-disabled={mainProduct.stock_quantity <= 0}
                            >
                                {mainProduct.stock_quantity <= 0 ? 'Unavailable' : 'Buy It Now'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (

                    <div className="mt-8 md:mt-12">
                        <h2 className="text-lg md:text-xl font-bold">Related Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mt-3 md:mt-4">
                            {relatedProducts.map((product) => (
                                <div
                                    key={product.product_id}
                                    className="border rounded-lg overflow-hidden shadow-md md:shadow-lg cursor-pointer"
                                    onClick={() => navigate(`/product/${product.name}`)}
                                >
                                    <img
                                        src={`${import.meta.env.VITE_SERVER_URL}/${product.hoverImage}`}
                                        alt={product.name}
                                        className="w-full h-32 md:h-48 object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="p-2 md:p-4">
                                        <h3 className="text-sm md:text-lg font-semibold line-clamp-1">{product.name}</h3>
                                        <p className="text-gray-500 text-xs md:text-base">
                                            {JSON.parse(product.price_size)[0]?.price || '0'} NGN
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </div>
        </>
    );

};

export default ProductPage;