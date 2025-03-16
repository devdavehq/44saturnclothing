import React, { useState, useEffect } from "react";
import NavBar from '../components/LandingPage/NavBar'
import { motion } from "framer-motion";
import { assets } from "../../Images/assets";
import { Link, useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

const ShopPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm, filter]);

    const items = [
        { id: 1, name: "Blue Striped Shirt", price: "$16,000", image: assets.background, hoverImage: assets.altImage1, status: "available" },
        { id: 2, name: "Classic White Tee", price: "$10,500", image: assets.background, hoverImage: assets.altImage2, status: "available" },
        { id: 3, name: "Black Hoodie", price: "$25,000", image: assets.background, hoverImage: assets.altImage3, status: "sold out" },
        { id: 4, name: "Denim Jacket", price: "$30,000", image: assets.background, hoverImage: assets.altImage4, status: "available" },
        { id: 5, name: "Cargo Pants", price: "$22,500", image: assets.background, hoverImage: assets.altImage5, status: "sold out" },
        { id: 6, name: "Flannel Shirt", price: "$18,000", image: assets.background, hoverImage: assets.altImage6, status: "available" },
        { id: 7, name: "Graphic Tee", price: "$12,000", image: assets.background, hoverImage: assets.altImage7, status: "recent" },
        { id: 8, name: "Sneakers", price: "$40,000", image: assets.background, hoverImage: assets.altImage8, status: "recent" },
    ];

    const filteredItems = items.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === "all" || item.status === filter)
    );

    return (
      <>
      <NavBar/>
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
                            key={item.id}
                            className="border rounded-lg shadow-md p-4 bg-white flex flex-col relative overflow-hidden"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.2, delay: item.id * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="relative w-full">
                                {item.status === "sold out" && (
                                    <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md">Sold Out</div>
                                )}
                                <motion.img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-auto object-cover rounded-lg"
                                    initial={{ opacity: 1 }}
                                    whileHover={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.img
                                    src={item.hoverImage}
                                    alt={item.name}
                                    className="w-full h-auto object-cover rounded-lg absolute top-0 left-0"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <div className="mt-4 flex flex-col items-start">
                                <Link
                                    to={`/product/${item.name}`}
                                    className="font-semibold text-black hover:underline"
                                >
                                    {item.name}
                                </Link>
                                <p className="text-gray-500">{item.price}</p>
                                <button
                                    className="mt-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                                    
                                >
                                    Add to Cart
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
