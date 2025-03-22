import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaCheckCircle, FaTimes, FaTrash, FaCheck, FaClock } from "react-icons/fa";
import { get, post } from "../../api"; // Adjust the import path as necessary
import Swal from "sweetalert2"; // Import SweetAlert2 for notifications

// Add CSS for fade-in animation
const fadeInStyle = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .fade-in {
    animation: fadeIn 1s ease-in-out;
  }
`;

const ValidateOrders = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [productdata, setProductdata] = useState([]); // Initialize state for orders

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await get("/orders_verified"); // Fetch orders from the API
      if (response.data) {
        setProductdata(response.data.msg);
      }
    };

    fetchOrders(); // Call the fetch function
    const intervalId = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const data = useMemo(() => productdata, [productdata]);

  const handleVerifyOrder = async (orderId) => {
    try {
      const response = await get(`/approve_notverified?orderid=${orderId}`);
      console.log(response);
      
      if (response.data.msg) {
        // Update the local state to reflect the change
        
        setProductdata((prevData) =>
          prevData.map((order) =>
            order.order_id === orderId ? { ...order, adminverified: "verified" } : order
          )
        );
        // Show SweetAlert notification
        Swal.fire({
          icon: "success",
          title: "Order Approved",
          text: "The order has been successfully verified.",
        });
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to verify the order.",
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await get(`/delete_notverified?orderid=${orderId}`);
      // console.log(response);
      
      if (response.data.msg === "Order disapproved successfully") {
        // Update the local state to reflect the change
        setProductdata((prevData) => prevData.filter((order) => order.order_id !== orderId));
        // Show SweetAlert notification
        Swal.fire({
          icon: "success",
          title: "Order Deleted",
          text: "The order has been successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the order.",
      });
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "";
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        size: 50,
      },
      {
        header: "Name",
        accessorKey: "bankname", // Add a name column
        size: 150,
      },
      {
        header: "Customer Email",
        accessorKey: "email",
        size: 250,
      },
      {
        header: "Total Amount",
        accessorKey: "total_amount",
        size: 100,
      },
      {
        header: "Order Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <div className={`inline-block px-2 py-1 rounded ${getStatusStyle(row.original.status)}`}>
            {row.original.status === "delivered" && <FaCheckCircle className="inline mr-1" />
            }
            {row.original.status === "failed" && <FaTimes className="inline mr-1" />}
            {row.original.status === "pending" && <FaClock className="inline mr-1" />}
            {row.original.status}
          </div>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleVerifyOrder(row.original.order_id)}
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
            >
              {/* <FaCheck /> */}
              Approve
            </button>
            <button
              onClick={() => handleDeleteOrder(row.original.order_id)}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600"
            >
              {/* <FaTrash /> */}
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <style>{fadeInStyle}</style> {/* Inject the fade-in CSS */}
      <div className="p-8 w-full fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Item Summary</h1>
          <div className="relative">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search orders..."
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <FaSortUp className="ml-2" />
                            ) : (
                              <FaSortDown className="ml-2" />
                            )
                          ) : (
                            header.column.getCanSort() && <FaSort className="ml-2" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
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
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </button>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </button>
            </div>
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValidateOrders;