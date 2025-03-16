import { assets } from '../../../Images/assets'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard } from 'lucide-react'
import { get, post } from '../../api';

const ProductCard = () => {
  const [products, setProducts] = useState([]); // Initialize with an empty array
  const [isHovered, setIsHovered] = useState(false); // State for hover effect
  const [quan, setQuan] = useState(1); // Initialize with 1 or any default value

  const addToCart = async (product_id, size, quantity) => {
    try {
      console.log('Adding to cart:', { product_id, size, quantity }); // Debugging
      let formData = new FormData();
      formData.append('product_id', product_id);
      formData.append('size', size.toLowerCase());
      formData.append('quantity', quantity);
  
      const data = await post('/cart/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Cart response:', data); // Debugging
  
      // Update cart items state
      // if (data.cart && Array.isArray(data.cart)) {
        // setProducts((items) => [...items, ...data.cart]); // Append cart items
        localStorage.setItem('cart', JSON.stringify(data.cart))
        console.log(localStorage.getItem('cart'));
        
      // } else {
      //   console.error('Invalid cart data:', data.cart);
      // }
  
      return data.cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return [];
    }
  };

  // Fetch products
  useEffect(() => {
    let isMounted = true; // Track if the component is mounted
    let isFetching = false; // Track if an API call is in progress
  
    const fetchRecentOrders = async () => {
      if (isFetching) return; // Skip if an API call is already in progress
      isFetching = true;
  
      try {
        const res = await get("/display_products");
        if (res.error) throw new Error(res.error);
  
        // console.log("API Response:", res); // Debugging: Log the entire response
  
        if (res.data && isMounted) {
          const data = res.data.msg.map(item => {
            // console.log("Processing Item:", item); // Debugging: Log each item
  
            // Check if `image_url` exists and is valid
            let mainImage = item.image_url ? `${import.meta.env.VITE_SERVER_URL}/${JSON.parse(item.image_url)[0]}` : '';
  
            // Check if `price_size` exists and is valid
            let sizes = [];
            let prices = [];
            const priceArray = JSON.parse(item.price_size);
            if (Array.isArray(priceArray)) {
              sizes = priceArray.map((ps) => ps.size);
              prices = priceArray.map((ps) => ps.price);
            } else {
              console.error("price_size is not a valid array:", item.price_size);
            }
  
            return {
              ...item,
              mainImage,
              sizes,
              prices,
            };
          });
  
          // console.log("Processed Data:", data); // Debugging: Log the processed data
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching user products:", error);
      } finally {
        isFetching = false; // Reset the flag after the API call is complete
      }
    };
  
    fetchRecentOrders();
    const intervalId = setInterval(fetchRecentOrders, 10000); // Poll every 10 seconds
  
    return () => {
      isMounted = false; // Mark the component as unmounted
      clearInterval(intervalId); // Clear the interval
    };
  }, []);

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="relative cursor-pointer group">
            <motion.div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img
                src={product.mainImage}
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-lg sm:rounded-md"
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0.8 : 1 }}
                transition={{ duration: 0.3 }}
              />
              {product.stock_quantity <= 0 && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm">
                  Sold out
                </div>
              )}
              <div className="mt-4 ml-4 relative">
                <a href={`/product/${product.name}`}><h3 className="text-lg font-semibold">{product.name}</h3></a>
                {/* Display the highest price */}
                <p className="text-gray-600">
                  ₦{Math.max(...product.prices).toLocaleString()}
                </p>
                <ShoppingCart className='bg-black text-white p-1 rounded-sm absolute right-4 top-4'
                  onClick={() => {
                    const newQuantity = quan + 1; // Increment the quantity
                    setQuan(newQuantity); // Update the state
                    addToCart(product.product_id, product.sizes[0], newQuantity); // Pass the updated quantity
                  }}
                />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;