import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { get, post } from '../../api';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [quan, setQuan] = useState({}); // Track quantity for each product
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cartMultiple')) || []); // Local cart state for instant updates

  // Add this useEffect to listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      const storedCart = JSON.parse(localStorage.getItem('cartMultiple')) || [];
      setCart(storedCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Add to cart function
  const addToCart = async (product_id, size, quantity, image, amount, name) => {
    try {
      // Check if item with same product_id and size exists
      const existingItemIndex = cart.findIndex(
        item => item.product_id === product_id && item.size === size.toLowerCase()
      );

      setCart((prevCart) => {
        let updatedCart;
        if (existingItemIndex !== -1) {
          // Update existing item
          updatedCart = prevCart.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          updatedCart = [...prevCart, { 
            product_id, 
            size: size.toLowerCase(), 
            quantity, 
            image, 
            amount,
            name 
          }];
        }
        localStorage.setItem('cartMultiple', JSON.stringify(updatedCart));
        // Dispatch custom event to notify NavBar
        window.dispatchEvent(new Event('cartUpdated'));
        return updatedCart;
      });

      // Send API request in the background
      let formData = new FormData();
      formData.append('product_id', product_id);
      formData.append('size', size.toLowerCase());
      formData.append('quantity', quantity);
      formData.append('image', image);
      formData.append('amount', amount);

      await post('/cart/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      // Revert local state if the API call fails
      setCart((prevCart) => {
        const revertedCart = prevCart.filter((item) => item.product_id !== product_id);
        localStorage.setItem('cartMultiple', JSON.stringify(revertedCart));
        // Dispatch custom event even on error
        window.dispatchEvent(new Event('cartUpdated'));
        return revertedCart;
      });
    }
  };

  // Fetch products
  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const fetchRecentOrders = async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const res = await get('/display_products');
        if (res.error) throw new Error(res.error);

        if (res.data && isMounted) {
          const data = res.data.msg.map((item) => {
            let mainImage = item.image_url
              ? `${import.meta.env.VITE_SERVER_URL}/${JSON.parse(item.image_url)[0]}`
              : '';

            let sizes = [];
            let prices = [];
            const priceArray = JSON.parse(item.price_size);
            if (Array.isArray(priceArray)) {
              sizes = priceArray.map((ps) => ps.size);
              prices = priceArray.map((ps) => ps.price);
            } else {
              console.error('price_size is not a valid array:', item.price_size);
            }

            return {
              ...item,
              mainImage,
              sizes,
              prices,
            };
          });

          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching user products:', error);
      } finally {
        isFetching = false;
      }
    };

    fetchRecentOrders(); // Fetch products on component mount
    const intervalId = setInterval(fetchRecentOrders, 5500); // Poll every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
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
                <a href={`/product/${product.name}`}>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                </a>
                <p className="text-gray-600">
                  ₦{Math.max(...product.prices).toLocaleString()}
                </p>
                <ShoppingCart
                  className="bg-black text-white p-1 rounded-sm absolute right-4 top-4 cursor-pointer"
                  onClick={() => {
                    const newQuantity = (quan[product.product_id] || 0) + 1;
                    setQuan((prev) => ({
                      ...prev,
                      [product.product_id]: newQuantity,
                    }));
                    addToCart(product.product_id, product.sizes[0], 1, product.mainImage, Math.max(...product.prices), product.name);
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