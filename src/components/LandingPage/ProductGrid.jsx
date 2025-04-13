import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { get, post } from '../../api';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [quan, setQuan] = useState({}); // Track quantity for each product
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cartMultiple')) || []); // Local cart state for instant updates

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

      setCart((prevCart) => {
        let updatedCart;
        if (existingItemIndex !== -1) {

          updatedCart = prevCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ).filter(item => item.quantity > 0);
        } else {

          updatedCart = [...prevCart, {
            product_id,
            size: size.toLowerCase(),
            quantity,
            image,
            amount: amount * quantity,
            name,
            stockQuan: stockQuan
          }];
        }
        localStorage.setItem('cartMultiple', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        return updatedCart;
      });

      // Send API request in the background
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
      setCart((prevCart) => {
        const revertedCart = prevCart.filter((item) => item.product_id !== product_id);
        localStorage.setItem('cartMultiple', JSON.stringify(revertedCart));
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
      {/* Changed grid classes to show 2 columns on mobile, 4 on larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {products.slice(0, 8).map((product) => (
          <div key={product.id} className="relative cursor-pointer group">
            <motion.div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {/* Made image height responsive */}
              <motion.img
                src={product.mainImage}
                alt={product.name}
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg sm:rounded-md"
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0.8 : 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* ... (keep all your existing product card content) */}
              
              <div className="mt-2 sm:mt-4 ml-2 sm:ml-4 relative">
                <a href={`/product/${product.name}`}>
                  <h3 className="text-[10px] sm:text-lg font-semibold">{product.name}</h3>
                </a>
                <p className="text-xs sm:text-base text-gray-600">
                  ₦{Math.max(...product.prices).toLocaleString()}
                </p>

                {/* Made cart button smaller on mobile */}
                <button
                  className={`p-1 rounded-sm absolute right-2 sm:right-4 top-4 ${
                    product.stock_quantity <= 0
                      ? 'opacity-50 cursor-not-allowed bg-gray-300'
                      : 'bg-black text-white cursor-pointer hover:bg-gray-800'
                  }`}
                  disabled={product.stock_quantity <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.stock_quantity > 0) {
                      const newQuantity = (quan[product.product_id] || 0) + 1;
                      setQuan((prev) => ({
                        ...prev,
                        [product.product_id]: newQuantity,
                      }));
                      addToCart(
                        product.product_id,
                        product.sizes[0],
                        1,
                        product.mainImage,
                        Math.max(...product.prices),
                        product.name, 
                        product.stock_quantity
                      );
                    }
                  }}
                  aria-disabled={product.stock_quantity <= 0}
                >
                  <ShoppingCart
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      product.stock_quantity <= 0 ? 'text-gray-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;