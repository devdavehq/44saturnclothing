import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { get, post, put, del } from "../../api"; // Adjust the import path as necessary
import Swal from "sweetalert2";

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
    animation: fadeIn 0.9s ease-in-out;
  }
`;

const Products = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productdata, setProductdata] = useState([]);
  const hasFetchedData = useRef(false); // Ref to track if data has been fetched

  useEffect(() => {
    let intervalId;

    const fetchProducts = async () => {
        const response = await get("/products"); // Fetch products from the API

        if (response.data && response.data.msg) {
            let count = 0;

            const transformedData = response.data.msg.map((item) => {
                let imgUrl = "";
                let sizes = [];
                let prices = [];

                // ✅ Parse image_url (Cloudinary URLs are already complete)
                const imageArray = JSON.parse(item.image_url);
                if (Array.isArray(imageArray)) {
                    imgUrl = `${import.meta.env.VITE_SERVER_URL}/${imageArray[0]}`; // Use the first image URL directly
                } else {
                    console.error("image_url is not a valid array:", item.image_url);
                }

                // ✅ Parse price_size
                const priceArray = JSON.parse(item.price_size);
                if (Array.isArray(priceArray)) {
                    sizes = priceArray.map((ps) => ps.size);
                    prices = priceArray.map((ps) => ps.price);
                } else {
                    // console.error("price_size is not a valid array:", item.price_size);
                    return false
                }

                return {
                    count: ++count,
                    ...item, // Spread the original item
                    imgUrl, // Use the Cloudinary URL directly
                    sizes, // Add the sizes array
                    prices, // Add the prices array
                };
            });

            setProductdata(transformedData); // Set the transformed data to state
            // console.log("Transformed data:", transformedData);
        } else {
            // console.log("No product data received.", response.error);
            return false

        }
    };

    fetchProducts(); // Fetch data immediately on mount

    intervalId = setInterval(fetchProducts, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
}, []);

  const data = useMemo(() => productdata, [productdata]);

  const toggleSlider = () => setIsSliderOpen(!isSliderOpen);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsSliderOpen(true);
  };

  const handleDelete = async ({ product_id }) => {
    try {
      // const formData = new FormData();
      // formData.append('product_id', product_id)
        const response = await post(`/delete-product`, {product_id});
        if (response.data) {
            setProductdata((prevData) => prevData.filter((product) => product.product_id !== product_id));
            Swal.fire({
                title: "Success!",
                text: response.data.msg,
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "black",
            });
        } else if (response.error) {
            Swal.fire({
                title: "Error!",
                text: response.error.msg,
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "black",
            });
        }
    } catch (error) {
        console.error("Request failed:", error);
        Swal.fire({
            title: "Error!",
            text: "Request failed. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "black",
        });
    }
};

  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "count", size: 100 },
      { header: "Name", accessorKey: "name" },
      { header: "Price", accessorKey: "prices" },
      { header: "Stock", accessorKey: "stock_quantity" },
      { header: "Size", accessorKey: "sizes" },
      { header: "Category", accessorKey: "category" },
      {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => {
          const desc = row.original.description || "";
          const maxLength = 50; // set your desired max length here
          return desc.length > maxLength
            ? desc.slice(0, maxLength) + "..."
            : desc;
        },
      },
      {
        header: "Image",
        accessorKey: "imgUrl",
        cell: ({ row }) => (
          
          <div className="flex space-x-2">
            <img
              src={row.original.imgUrl} // Use the imgUrl from the row data
              alt={row.original.name}   // Use the name from the row data as the alt text
              className="w-10 h-10"    // Optional: Add styling for the image
            />
            
          </div>
        ),
      },  
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(row.original)}
              aria-label="Edit"
            >
              <FaEdit />
            </button>
            <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row.original)}>
              <FaTrash />
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
    state: { globalFilter, sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="p-4 md:p-8 w-full relative fade-in">
        <div className="mb-4 md:mb-8 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Products</h1>
          <button
            onClick={() => { setCurrentProduct(null); toggleSlider(); }}
            className="bg-black text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-gray-700 flex items-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full px-2 py-1 md:px-4 md:py-2 pl-8 md:pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products..."
          />
          <FaSearch className="absolute left-2 top-2 md:left-3 md:top-3 text-gray-400" />
        </div>

        {/* Responsive Table */}
        <div className="responsive-table mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
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
                      <td key={cell.id} className="px-4 py-2 md:px-6 md:py-4 text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex gap-2">
            <button
              className="px-2 py-1 md:px-3 md:py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="px-2 py-1 md:px-3 md:py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="px-2 py-1 md:px-3 md:py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="px-2 py-1 md:px-3 md:py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
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

        {/* Slider */}
        {isSliderOpen && <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleSlider}></div>}
        <div className={`fixed top-0 right-0 h-full w-full md:w-[35%] bg-white shadow-lg transform ${isSliderOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out p-4 md:p-6`}>
          <button onClick={toggleSlider} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
          <h2 className="text-xl font-bold mb-4">{currentProduct ? "Edit Product" : "Add Product"}</h2>
          <AddProduct onClose={toggleSlider} currentProduct={currentProduct} />
        </div>
      </div>
    </>
  );
};



const AddProduct = ({ onClose, currentProduct }) => {
  const [pid, setPid] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [hoverImage, setHoverImage] = useState('');
  const [stockQuantity, setStockQuantity] = useState("");
  const [priceSizes, setPriceSizes] = useState([]);
  const [err, setErr] = useState("");

  // Re-initialize state when currentProduct changes
  useEffect(() => {
    if (currentProduct) {
      setPid(currentProduct.product_id || "");
      setCategory(currentProduct.category || "");
      setName(currentProduct.name || "");
      setDescription(currentProduct.description || "");
      setStockQuantity(currentProduct.stock_quantity || "");
      try {
        setPriceSizes(currentProduct.price_size ? JSON.parse(currentProduct.price_size) : []);
      } catch (error) {
        console.error("Error parsing price_size:", error);
        setPriceSizes([]);
      }
    } else {
      // Reset state if no currentProduct (e.g., when adding a new product)
      setPid("");
      setCategory("");
      setName("");
      setDescription("");
      setStockQuantity("");
      setPriceSizes([]);
    }
  }, [currentProduct]);

  const addSize = () => setPriceSizes([...priceSizes, { size: "", price: "" }]);

  const updateSize = (index, key, value) => {
    const updatedSizes = [...priceSizes];
    updatedSizes[index][key] = value;
    setPriceSizes(updatedSizes);
  };

  const removeSize = (index) => setPriceSizes(priceSizes.filter((_, i) => i !== index));

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setImageUrl(filesArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("priceSize", JSON.stringify(priceSizes));
    formData.append("stockQuantity", stockQuantity);

    // Append each image file to FormData
    imageUrl.forEach((file) => {
        formData.append("images[]", file); // Use "images[]" for array format in PHP
    });
    formData.append("hoverImage", hoverImage);
    
    try {
        let response;
        if (pid === '') {
            response = await post("/product", formData);
        } else {
            formData.append("productId", pid); // Ensure productId is appended
            response = await post('/update-product', formData); // Ensure URL includes productId
        }

        if (response.data) {
            Swal.fire({
                title: "Success!",
                text: pid === '' ? "Product Uploaded Successfully" : "Product Updated Successfully",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "black",
            });
        } else if (response.error) {
            // console.log("Error:", response.error.msg);
            return Swal.fire({
                title: "Error!",
                text: response.error.msg || "Something went wrong",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "black",
            });
        }
    } catch (error) {
        console.error("Request failed:", error);
        Swal.fire({
            title: "Error!",
            text: "Request failed. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "black",
        });
    }

    onClose();
};

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">       
      </div>
      <div className="flex-1 overflow-y-auto pb-10">
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {err && <p className="text-red-700">{err}</p>}
          <div>
            <input
              type="text"
              value={pid}
              className="w-full p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
              placeholder="productid..."
              hidden
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
              placeholder="Category..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
              placeholder="Name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
              placeholder="Description..."
            ></textarea>
          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700">Images: Max 6</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
              multiple
              name="images"
              onClick={(e) => e.target.files?.length > 6 && alert("Max 6 images")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hover Image</label>
            <input
              type="file"
              onChange={(e) => setHoverImage(e.target.files[0])}
              className="w-full p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
              name="hoverImage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Quantity:</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
            />
          </div>

          {priceSizes.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Size"
                value={item.size}
                onChange={(e) => updateSize(index, "size", e.target.value)}
                className="w-1/3 p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => updateSize(index, "price", e.target.value)}
                className="w-1/4 p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
              />
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSize}
            className="text-blue-500 hover:text-blue-700 text-lg mt-4" // Added mt-4 for margin-top
          >
            add size +
          </button>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700"
            >
              {currentProduct ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;