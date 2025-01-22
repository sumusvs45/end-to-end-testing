/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/shopContext";
import { toast } from "react-toastify";

function OrderSummary({ token }) {
  const { cart, totalPrice, setCart } = useContext(ShopContext);
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});

  const shippingFee = 40;
  const date = new Date().toISOString();

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
      valid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
      valid = false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) { //regrex onlyb allow alphabetsa & spaces
      newErrors.email = "Valid Email is required";
      valid = false;
    }
    if (!formData.street) {
      newErrors.street = "Street is required";
      valid = false;
    }
    if (!formData.city) {
      newErrors.city = "City is required";
      valid = false;
    }
    if (!formData.state) {
      newErrors.state = "State is required";
      valid = false;
    }
    if (!formData.zipcode || formData.zipcode.length !== 6) {
      newErrors.zipcode = "Zipcode must be exactly 6 digits";
      valid = false;
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
      valid = false;
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) { //regrex only allow digits
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

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
    //laoding the script already exist razor pay code
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // checking for validation 
    if (!validateForm()) {
      return;
    }

    const totalAmountWithShipping = totalPrice + shippingFee;
    const totalAmountInPaise = totalAmountWithShipping * 100; // Razorpay expects amount in paise

    try {
      const options = {
        amount: totalAmountInPaise,
        currency: 'INR',
        cartItems: cart
      };
     // passing the optiond to post  api
      const res = await axios.post("http://localhost:4000/api/v1/payment/createOrder", options);
      const data = res.data;

      const paymentObject = new window.Razorpay({
        key: "rzp_test_11krXBMmubInXJ", // Enter the Key ID generated from the Dashboard
        amount: totalAmountInPaise, // Razorpay expects amount in paise (multiply by 100)
        currency: "INR",
        name: "Sanjit Tech Solutions",
        description: "Test Transaction",
        order_id: data.order.id,
        cartItems: cart,
        ...data,
        handler: async function (response) { //getting response of above api and  allocation varaible to reqired feilds
          const options2 = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            amount: totalAmountWithShipping,
            cart,
            formData,
            date
          };
          // passing the option 2 the post and verifying the order
          const res = await axios.post(
            "http://localhost:4000/api/v1/payment/verifyOrder",
            options2,
            {
              headers: {
                "Content-Type": "application/json",
                "Auth": token
              }
            }
          );

          if (res?.data?.success) {
            alert("Payment successful, Order placed sucessfully");
            navigate('/feedback');
            setCart([]);
          } else {
            alert("Payment failed");
          }
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        notes: {
          address: formData.street + ", " + formData.city + ", " + formData.state + ", " + formData.zipcode,
        },
        theme: {
          color: "#61dafb",
        },
      });
      paymentObject.open();

    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  const totalAmountWithShipping = totalPrice + shippingFee;

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
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={onChangeHandler}
            value={formData.lastName}
            required
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
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
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
          {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
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
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="state"
            placeholder="State"
            onChange={onChangeHandler}
            value={formData.state}
            required
          />
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
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
          {errors.zipcode && <p className="text-red-500 text-sm">{errors.zipcode}</p>}
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="country"
            placeholder="Country"
            onChange={onChangeHandler}
            value={formData.country}
            required
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
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
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
        </div>
      </div>

      {/* Payment and Order Summary Section */}
      <div className="mt-8 w-full sm:max-w-[480px]">
        <div className="mt-10">
          <div className="flex justify-between">
            <p>Total Amount:</p>
            <p>{totalPrice}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Fee:</p>
            <p>{shippingFee}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Grand Total:</p>
            <p>{totalAmountWithShipping}/Rs</p>
          </div>

          {/* Payment Methods */}
          <div className="mt-3">
            <h2 className="text-left font-serif text-xl">Payment Methods</h2>
          </div>

          {/* Place Order Button */}
          <div className="mt-5 w-full flex justify-end">
            <button
              type="submit"
              className="bg-black p-1.5 px-2 text-white rounded-md hover:bg-green-400"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default OrderSummary;
