/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import React from 'react'

const ListItems = ({ token }) => {
  const [list, setList] = useState([]);

  // Fetch the list of items from the backend
  const fetchList = async () => {
    try {
      console.log(token)
      //getting products from the backend 
      const response = await axios.get("http://localhost:4000/api/v1/get-Items", {
        headers: {
          "Auth": token, // Correct format for token
        },
      });

      console.log(response.data);

      if (response.data.success) {
        setList(response.data.data); // Assuming the food data is in `response.data.data`
        toast.success(response.data.message);
      } else {
        toast.error(response.data.errormessage || "Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    fetchList(); // Call fetchList on component mount
  }, []);

  // Delete function
  async function Delete(e, itemId) {
    e.preventDefault(); // Prevent default behavior (if it's a form submission)
    console.log("Item ID:", itemId); // Log the itemId for debugging

    // Optimistic UI update: Remove the item from the list immediately
    setList(list.filter(item => item._id !== itemId));

    try {
      const response = await axios.post(
        //deleting the product  based on id
        "http://localhost:4000/api/v1/deleteItem",
        { id: itemId },
        {
          headers: {
            "Auth": token, // Correct format for token
          },
        }
      );
      console.log(response.data); // Log the response for debugging

      // Handle success (e.g., keep the item removed)
      if (response.data.success) {
        toast.success("Item successfully deleted!");
      } else {
        // If deletion fails, revert the optimistic update (by adding the item back to the list)
        fetchList();
        toast.error("Error deleting item: " + response.data.message);
      }
    } catch (error) {
      console.error("Error during delete:", error);
      // Revert the optimistic update if the delete operation failed
      fetchList();
      toast.error("Error during delete operation.");
    }
  }

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 w-3/4 mx-auto">
      <table className="w-full table-auto text-sm text-left">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th className="py-2 px-4 text-left font-semibold">Image</th>
            <th className="py-2 px-4 text-left font-semibold">Name</th>
            <th className="py-2 px-4 text-left font-semibold">Description</th>
            <th className="py-2 px-4 text-left font-semibold">Price</th>
            <th className="py-2 px-4 text-left font-semibold">Category</th>
            <th className="py-2 px-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* checking the length and  displaying the items  */}
          {list.length > 0 ? (
            list.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50 transition duration-200 ease-in-out">
                <td className="py-4 px-4">
                  {/* Display image dynamically */}
                  <img
                    src={`http://localhost:4000/images/${item.imgSrc}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                </td>
                <td className="py-4 px-4 text-gray-800 font-semibold">
                  {item.title}
                </td>
                <td className="py-4 px-4 text-gray-600">{item.description}</td>
                <td className="py-4 px-4 text-gray-800 font-bold">
                  {item.price} /rs
                </td>
                <td className="py-4 px-4 text-gray-600">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {item.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                    onClick={(e) => Delete(e, item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 px-4 text-center text-gray-600">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListItems;
