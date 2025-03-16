import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const product = {
  name: "Black Long Sleeve T-Shirt",
  price: "₦111,600.00",
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  images: [
    "/images/product1.jpg",
    "/images/product2.jpg",
    "/images/product3.jpg",
    "/images/product4.jpg",
  ],
};

const relatedProducts = [
  { id: 1, name: "White Hoodie", price: "₦85,000.00", image: "/images/related1.jpg" },
  { id: 2, name: "Graphic Tee", price: "₦45,000.00", image: "/images/related2.jpg" },
  { id: 3, name: "Denim Jacket", price: "₦120,000.00", image: "/images/related3.jpg" },
];

const Card = ({ children }) => (
  <div className="border rounded-lg overflow-hidden shadow-lg">
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

const ProductPage = () => {
  const [selectedSize, setSelectedSize] = useState("S");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <motion.div className="h-[500px] overflow-hidden" animate={{ y: [0, -600] }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}>
          {product.images.map((img, index) => (
            <img key={index} src={img} alt={product.name} className="w-full" />
          ))}
        </motion.div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-500 my-2">{product.price}</p>
          <div className="flex space-x-2 my-4">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`px-4 py-2 border ${selectedSize === size ? "bg-black text-white" : "bg-white text-black"}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <Button className="w-full bg-black text-white">Add to Cart</Button>
          <Button className="w-full mt-2 bg-gray-800 text-white">Buy It Now</Button>
        </div>
      </div>

      {/* Related Products */}
      <h2 className="text-xl font-bold mt-12">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {relatedProducts.map((product) => (
          <Card key={product.id}>
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <CardContent>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">{product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProductPage;