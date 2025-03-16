import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../Images/assets";

const products = [
  { id: 1, name: "Product 1", image: assets.background, price: "$20" },
  { id: 2, name: "Product 2", image: assets.background, price: "$25" },
  { id: 3, name: "Product 3", image: assets.background, price: "$30" },
  { id: 4, name: "Product 4", image: assets.background, price: "$50" },
  { id: 5, name: "Product 5", image: assets.background, price: "$40" },
  { id: 6, name: "Product 7", image: assets.background, price: "$60" },
  { id: 7, name: "Product 8", image: assets.background, price: "$20" },
  { id: 8, name: "Product 9", image: assets.background, price: "$100" },
];

const ProductCatalog = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 mt-20">
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="bg-white p-4 rounded-2xl shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-xl" />
          <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.price}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductCatalog;
