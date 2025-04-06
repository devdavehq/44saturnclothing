import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { FaCheckCircle, FaTimes, FaClock } from "react-icons/fa";
import { get } from "../../api";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [stocks, setStocks] = useState([]);

  // Update greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      const newGreeting =
        currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
      setGreeting(newGreeting);
    };
    updateGreeting();
  }, []);

  // Fetch metrics (total sales, orders, customers)
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await get("/metrics");
        if (res.error) throw new Error(res.error);
  
        // No .split() needed! Directly use numbers.
        setTotalSales(res.data.totalSales);  // Already a number
        setTotalOrders(res.data.totalOrders);
        setTotalCustomers(res.data.totalCustomers);
  
        // Optional: Format for display (e.g., add commas)
        // setTotalSales(res.data.totalSales.toLocaleString());
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };
  
    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch pending orders
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await get("/pending-orders");
        if (res.error) throw new Error(res.error);

        if (res.data) {
          setTableData(res.data.msg);
        }
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      }
    };

    fetchRecentOrders();
    const intervalId = setInterval(fetchRecentOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Fetch stock data
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await get("/stocks");
        if (res.error) throw new Error(res.error);

      //  return console.log(res.data.msg)
        
        // const stockArray = Array.isArray(res.data.msg) ? res.data.msg : [res.data.msg];
        const formattedStocks = res.data.msg.map((item, index) => ({
          image: `${import.meta.env.VITE_SERVER_URL}/${JSON.parse(item.image_url)[index]}`,
          ...item,
        }));

        // return console.log(formattedStocks)
        setStocks(formattedStocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
    const intervalId = setInterval(fetchStocks, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Get status style for order status
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  // Memoize table data and columns
  const data = useMemo(() => tableData, [tableData]);
  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        size: 50,
      },
      {
        header: "Customer Email",
        accessorKey: "email",
        size: 250,
      },
      {
        header: "Order Status",
        accessorKey: "payment_status",
        cell: ({ row }) => (
          <div className={`inline-block px-2 py-1 rounded ${getStatusStyle(row.original.status)}`}>
            {row.original.status === "pending" && <FaClock className="inline mr-1" />}
            {row.original.status}
          </div>
        ),
      },
    ],
    []
  );

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      className="p-6 bg-gray-100 min-h-[80vh] overflow-hidden mt-[-13.5px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.header
        className="flex items-center justify-between my-5 py-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-[20px] font-bold text-slate-700 mx-2 md:text-[30px]">{greeting}, 44SaturnClothings!</h1>
      </motion.header>

      {/* Metrics Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Sales", value: totalSales },
          { label: "Total Orders", value: totalOrders },
          { label: "Total Customers", value: totalCustomers },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="p-4 bg-white rounded shadow text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <h2 className="md:text-lg font-semibold text-[10px]">{stat.label}</h2>
            <p className="md:text-2xl font-bold text-[15px]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending Orders and Stocks Section */}
      <div className="flex flex-wrap -mx-2">
        <motion.div
          className="w-full md:w-7/12 px-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-xl font-bold mb-4">Pending Orders</h2>
          <div className="overflow-x-auto overflow-y-auto max-h-96 bg-white rounded shadow p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="w-full md:w-5/12 px-2 py-2 md:py-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-xl font-bold mb-4">Stocks</h2>
          <div className="flex flex-col gap-4">
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <div key={stock.id} className="p-4 bg-gray-100 rounded-lg shadow-md flex items-center gap-4">
                  <img src={stock.image} className="w-12 h-12 bg-gray-300 rounded object-cover object-center" alt={stock.name} />
                  <div>
                    <p className="font-semibold">{stock.name}</p>
                    <span className="text-sm text-gray-500">{stock.stock_quantity > 0 ? 'Available' : 'Sold out'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No stocks yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;