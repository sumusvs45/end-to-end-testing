/* eslint-disable react/prop-types */
import { shopContext } from "../../ShopContextProvider";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Product({token}) {
  const { productData,cartItems, totalAmount, shippingFee,setCartItems } = useContext(shopContext);
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phoneNumber: "",
  });
  const date=new Date().toISOString()
  

    
    
   

 

  // Handle form data changes
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Load external Razorpay script
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []); // Empty dependency array ensures this runs only once when the component mounts
 
  const orderItems = Object.keys(cartItems) // Iterate over the keys of cartItems
  .map(itemId => {
    const item = JSON.parse(JSON.stringify(productData.find(product => product.id === Number(itemId)))); 
    if (item && cartItems[itemId] > 0) { // Only push items with quantity > 0
      return { ...item, quantity: cartItems[itemId] };
    }
    return null; // Return null for items with 0 quantity
  })
  .filter(item => item !== null); // Filter out null items

console.log("od", orderItems);

  

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();
   

    const totalAmountWithShipping = totalAmount + shippingFee; // Calculate total amount including shipping
    console.log("1",totalAmountWithShipping)
    const totalAmountInPaise = totalAmountWithShipping*100; 
    console.log("2",totalAmountInPaise)// Convert to paise (Razorpay expects amount in paise)

    try {
      const options = {
        amount: totalAmountWithShipping*100,
        currency: 'INR',
        cartItems:orderItems
      
      };
      console.log("options", totalAmountWithShipping);
      const res = await axios.post("http://localhost:4000/api/zing/createOrder", options,
      );
      const data = res.data;
      console.log("order data:", res.data);

      const paymentObject = new window.Razorpay({
        key: "rzp_test_11krXBMmubInXJ", // Enter the Key ID generated from the Dashboard
        amount: totalAmountWithShipping*100, // Razorpay expects amount in paise (multiply by 100)
        currency: "INR",
        name: "Sanjit Tech Solutions",
        description: "Test Transaction",
        order_id: data.order.id,
        cartItems:orderItems,
        ...data,
        handler: async function (response) {
          console.log("Razorpay response:", response);  // Log response object for debugging
          console.log("opt2".totalAmountWithShipping);

          const options2 = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            amount: totalAmountWithShipping,
            orderItems,
            formData,
            date
          

          
          };

          const res = await axios.post("http://localhost:4000/api/zing/verifyOrder",options2,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${token}`
               
              },
            }
          );
          console.log("Verify Order Response:", res.data);  // Log the response from your verifyOrder API

          if (res?.data?.success) {
            alert("Payment successful");
            navigate('/feedback-form')
            setCartItems('')
          } else {
            alert("Payment failed---Test123");
          }

        },
        prefill: {
          name: formData.firstName + " " + formData.lastName, // Dynamically use form data
          email: formData.email,
          contact: formData.phoneNumber,
        },
        notes: {
          address: formData.street + ", " + formData.city + ", " + formData.state + ", " + formData.zipcode, // Dynamically use form data
        },
        theme: {
          color: "#61dafb", // Customize color if necessary
        },
      });
      paymentObject.open();

    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  const totalAmountWithShipping = totalAmount + shippingFee;

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-around gap-4 min-h-[80vh] p-4">
      {/* Delivery Information Section */}
      <div className="flex flex-col gap-4 mx-4 w-full pt-2 sm:max-w-[480px]">
        <h2 className="section__header text-xl sm:text-2xl">Delivery Information</h2>

        {/* Name Inputs */}
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

        {/* Other form fields for email, address, phone number */}
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

      {/* Payment and Order Summary Section */}
      <div className="mt-8 w-full sm:max-w-[480px]">
        <div className="mt-10">
          <div className="flex justify-between">
            <p>Total Amount:</p>
            <p>{totalAmount}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Fee:</p>
            <p>{shippingFee}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Grand Total:</p>
            <p>{totalAmountWithShipping}</p>
            
          </div>

          {/* Payment Methods */}
          <div className="mt-3">
            <h2 className="text-left font-serif text-xl">Payment Methods</h2>
          </div>

          {/* Place Order Button */}
          <div className="mt-5 w-full flex justify-end">
            <button
              type="submit"
              className="bg-primary p-1.5 px-2 text-white rounded-md hover:bg-green-400"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Product;
