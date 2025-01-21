/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { shopContext } from "../../ShopContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OrderSummary = ({ token }) => {
  const { cartItems, productData, totalAmount, shippingFee } = useContext(shopContext);
  const [method, setMethod] = useState('COD'); // Default to 'COD' (Cash on Delivery)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phoneNumber: ''
  });

  const [formValid, setFormValid] = useState(true); // To track form validity
  const navigate = useNavigate(); // For programmatic navigation
  const [items, setItems] = useState([]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const amount = totalAmount + shippingFee;  // Total amount including shipping fee
    const currency = "INR";
    
    // Generate a unique receipt ID based on the total amount and current timestamp
    const receiptId = `RCP${amount}${new Date().getTime()}`;  // Concatenate amount with current timestamp
    
  
    try {
      // Create the order items from the cart
      const orderItems = Object.keys(cartItems).map(itemId => {
        const item = JSON.parse(JSON.stringify(productData.find(product => product.id === Number(itemId)))); 
        if (item) {
          return { ...item, quantity: cartItems[itemId] };
        }
        return null;
      }).filter(item => item !== null);

      // Prepare the order data
      const orderData = {
        address: formData,
        items: orderItems,
        amount: amount,
        paymentMethod: method, // Include selected payment method
        date: new Date().toISOString(), // Add date for the order
        receiptId: receiptId,  // Add generated receipt ID to the order data
      };

      const orders = [{
        id: receiptId,  // Use the generated receipt ID
        reciptAmount: amount,  // Corrected spelling
      }];

      // Call API to place the order
      const response = await fetch("http://localhost:4000/api/zing/place-order", {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency,
          receipt:receiptId,  // Reference the generated receipt ID
        }),
        headers: {
          "Content-Type": "application/json",
         
        },
      });
      const order = await response.json();
      console.log(order);

      // Open Razorpay for payment
      var options = {
        key: "rzp_test_ZRXSTie7xMe8Fa",  // Your Razorpay Key ID
        amount: amount*100 ,  // Convert the amount into paise
        currency: "INR",  // Currency
        name: "sanjit tech solution",  // Your business name
        description: "Test Transaction",  // Description
        image: "https://example.com/your_logo",  // Optional: Your business logo
        order_id:order._id ,// Order ID from the backend
        handler: async function(response) {
          const body = { ...response };
      
          try {
            // Validate payment on the backend
            const validateRes = await fetch("http://localhost:4000/api/zing/order/validate", {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            const jsonRes = await validateRes.json();
            console.log("recp:",jsonRes.data)
            if (jsonRes.msg === "Payment verified successfully") {
              window.location.href = "/payment-success"; // Redirect to success page
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment validation error:", error);
          }
        },
        prefill: {
          name: "Web Dev Matrix",  // Customer's name
          email: "webdevmatrix@example.com",  // Customer's email
          contact: "9000000000",  // Customer's phone number
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",  // Button color
        },
      };
      
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function(response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-around gap-4 min-h-[80vh]">
      <div className="flex flex-col gap-4 mx-4 w-full pt-2 sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl">
          <h2 className="section__header">Delivery Information</h2>
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={onChangeHandler}
            value={formData.firstName}
            required
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={onChangeHandler}
            value={formData.lastName}
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={onChangeHandler}
            value={formData.email}
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="street"
            placeholder="Street"
            onChange={onChangeHandler}
            value={formData.street}
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="city"
            placeholder="City"
            onChange={onChangeHandler}
            value={formData.city}
            required
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="state"
            placeholder="State"
            onChange={onChangeHandler}
            value={formData.state}
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            name="zipcode"
            placeholder="Zipcode"
            onChange={onChangeHandler}
            value={formData.zipcode}
            required
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="country"
            placeholder="Country"
            onChange={onChangeHandler}
            value={formData.country}
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            name="phoneNumber"
            placeholder="Phone number"
            onChange={onChangeHandler}
            value={formData.phoneNumber}
            required
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <div className="mt-10">
            <div className="flex justify-between">
              <p>Total Amount:</p>
              <p>{formatCurrency(totalAmount)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping Fee:</p>
              <p>{formatCurrency(shippingFee)}</p>
            </div>
            <div className="flex justify-between font-bold">
              <p>Grand Total:</p>
              <p>{formatCurrency(totalAmount + shippingFee)}</p>
            </div>

            <div className="mt-5 w-full">
              <button
                type="submit"
                className="bg-primary p-1.5 px-2 text-white rounded-md float-end hover:bg-green-400"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default OrderSummary;
