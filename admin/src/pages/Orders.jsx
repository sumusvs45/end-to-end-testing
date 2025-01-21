/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const backendUrl = "http://localhost:4000"; // Define your backend URL

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/v1/allOrders`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token, // Pass token here
        },
      });

      if (response.data.success) {
        const ordersData = response.data.orders;

        // Sort orders by date in descending order (most recent first)
        ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));

        const allOrders = ordersData.flatMap((order) =>
          order.items.map((item) => ({
            ...item,
            status: order.status,
            userId: order.userId,
            orderId: order.orderId,
            date: order.date,
            paymentId: order.paymentId,
            address: order.address, // Include address in the item to show with the order
          }))
        );

        setOrders(allOrders); // Set items
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("An error occurred while fetching orders:", error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders(); // Fetch orders on component mount
  }, [token]); // Re-run the effect when the token changes

  // Handle the status change and update both the local state and the backend
  const statusHandler = async (event, orderId) => {
    const updatedStatus = event.target.value;
    console.log("up", updatedStatus);

    // Update the local state first
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? { ...order, status: updatedStatus } // Update the status of the specific order
          : order
      )
    );

    try {
      // Send the updated status to the backend
      const response = await axios.post(
        `${backendUrl}/api/v1/order-status`,
        { orderId, status: updatedStatus },
        {
          headers: {
            Auth: token,
          },
        }
      );

      if (response.data.success) {
        // Optionally refresh orders after status change if needed
        // await fetchAllOrders();  // Uncomment this if you want to refresh orders from backend
      } else {
        console.log("Failed to update status.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold">Order Page</h3>
      {/* checking length and displaying the orders  */}
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="table-auto w-full text-left border-collapse mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">OrderId</th>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Items</th>
              <th className="px-4 py-2 border-b">Payment Id</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Address</th>{" "}
              {/* Added address column */}
            </tr>
          </thead>
          <tbody>
            {/* mapping the get data and displaying  */}
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b">
                {" "}
                {/* Use orderId as key */}
                <td className="px-4 py-2 text-slate-500">{order.orderId}</td>
                <td className="px-4 py-2">
                  <img
                    src={`http://localhost:4000/images/${order.imgSrc}`}
                    className="w-[240px]"
                    alt={order.name}
                  />
                </td>
                <td className="  px-4 py-2">
                  <label
                    htmlFor="orderStatus"
                    className="text-lg font-medium text-gray-700"
                  >
                    {order.title}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <label
                    htmlFor="orderStatus"
                    className="text-md font-medium text-gray-700"
                  >
                   {order.paymentId}
                  </label>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-4">
                    <select
                      onChange={(event) => statusHandler(event, order.orderId)} // Handle status change
                      value={order.status} // Bind the selected value to the status
                      className="p-2 font-semibold"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div>
                    {/* displaying the address based on condition  */}
                    {order.address ? (
                      <>
                        <h2 className="font-medium ">
                          <span className="font-medium text-md">userId: </span>
                          {order.userId}
                        </h2>
                        <strong>
                          {order.address.firstName} {order.address.lastName}
                        </strong>
                        <br />
                        {order.address.street}, {order.address.city},{" "}
                        {order.address.zipCode} Date:{order.date}
                        <p className="text-green-400 mt-2">
                          <span
                            className={`inline-block px-2 py-1.5 rounded-md text-white ${
                              order.status === "Delivered"
                                ? "bg-green-500"
                                : order.status === "Packing"
                                ? "bg-orange-500"
                                : order.status === "Shipping"
                                ? "bg-yellow-500"

                                : "bg-gray-500"
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>
                      </>
                    ) : (
                      <span>No address available</span>
                    )}
                  </div>
                </td>cd <span className="ai-picker"></span>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
