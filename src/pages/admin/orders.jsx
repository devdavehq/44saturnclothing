import React, { useState, useMemo, useEffect } from "react";
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaCheckCircle, FaTimesCircle, FaPaperPlane, FaTimes, FaExclamationCircle, FaClock } from 'react-icons/fa';
import { get } from '../../api'; // Adjust the import path as necessary




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

const Validate = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productdata, setProductdata] = useState([]); // Initialize state for orders


  useEffect(() => {
    const fetchOrders = async () => {
      const response = await get('/orders'); // Fetch orders from the API
      if (response.data) {
        console.log(response.data.msg);
        setProductdata(response.data.msg)
         // Set the fetched data to state
      }
    };

    fetchOrders(); // Call the fetch function
    const intervalId = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, []);


  // Sample data with additional fields
  const data = useMemo(() => productdata, [productdata]);

 

  const handleViewDetails = (data) => {
    setIsModalOpen(true);
    setSelectedOrder(data)
    console.log(data);
    
  };

  // created_at
  // : 
  // "2025-02-28T09:03:29.000Z"
  // email
  // : 
  // "bayo@mail.com"
  // id
  // : 
  // 2
  // order_id
  // : 
  // "vdtfwtyfdtyw767w7dbh"
  // payment_status
  // : 
  // "pending"
  // phone
  // : 
  // "88866677755"
  // shipping_address
  // : 
  // "wdbcbehwdbcd"
  // status
  // : 
  // "pending"
  // total_amount
  // : 
  // "1000.00"
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "Failed":
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
            {row.original.status === "delivered" && <FaCheckCircle className="inline mr-1" />}
            {row.original.status === "Failed" && <FaTimes className="inline mr-1" />}
            {row.original.status === "pending" && <FaClock className="inline mr-1" />}
            {row.original.status}
          </div>
        ),
      },
      {
        header: "View Details",
        id: "view",
        cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row.original)}
            className="bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-800"
          >
            View
          </button>
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
      <div className="p-8 w-full fade-in"> {/* Apply the fade-in class */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Item Summary</h1>
          <div className="relative">
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
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
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
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
                {'<<'}
              </button>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
            </div>
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-1/2 relative">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                <FaTimes />
              </button>
              <h2 className="text-xl font-bold mb-4">Customer & Order Details</h2>
              {selectedOrder && (
                <ul className="space-y-4">
                  <li className="flex justify-between"><strong>Customer Email:</strong> <span className="text-sm">{selectedOrder.email}</span></li>
                  <li className="flex justify-between"><strong>Phone Number:</strong> <span className="text-sm">{selectedOrder.phone}</span></li>
                  <li className="flex justify-between"><strong>Address:</strong> <span className="text-sm">{selectedOrder.shipping_address}</span></li>
                  <li className="flex justify-between"><strong>Product ID:</strong> <span className="text-sm">{selectedOrder.order_id}</span></li>
                  {/* <li className="flex justify-between"><strong>Product Name:</strong> <span>{selectedOrder.productName}</span></li> */}
                </ul>
              )}
              <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Validate;
