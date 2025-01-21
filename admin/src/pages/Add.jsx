/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { assets } from "../assets/assets";
import { useState } from "react";
import axios from 'axios';
import React from "react";
import {toast} from 'react-toastify'
const Add= ({token}) => {
  const [imgSrc, setimgSrc] = useState(null); // Fixed state initialization
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: 'mobiles',
    qty:""

  });
  console.log("token",token)


  const handleInputChange = (e) => { //handle change logic
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => { //habdling submit function || handling the submited data
    e.preventDefault();
    
    const form = new FormData(); // Create a new FormData object
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price", Number(formData.price)); // Correctly access formData's price
    form.append("qty",formData.qty);
    form.append("category", formData.category); // Append the category correctly
    form.append("imgSrc", imgSrc); // Append the imgSrc

    try {
      //sending product data to the server
      const response = await axios.post("http://localhost:4000/api/v1/products/addProduct", form, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type is sent
          "Auth":token,
        },
      });

      if (response.data.success) {
        // Reset the form if successful
        setFormData({
          title: "",
          description: "",
          price: "",
          category: 'mobiles',
          qty:''
        });
        setimgSrc(null); // Clear the imgSrc state
        toast.success(response.data.message)
      } else {
        toast.error(response.data.errormessage)// Handle error more appropriately
      }
    } catch (error) {
        toast.error(error)
    }
  };

  return (
    <div className="flex justify-center align-center mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col mt-8">
        <div>
          <label htmlFor="imgSrc">
            <img
              src={imgSrc ? URL.createObjectURL(imgSrc) : assets.upload_area}// seeting the object url to image and condition rendering
              alt="Uploaded Preview"
              className="w-36"
            />
          </label>
          <input
            onChange={(e) => setimgSrc(e.target.files[0])}
            type="file"
            id="imgSrc"
            className="hidden"
          />
        </div>

        <div className="flex flex-col justify-start">
          <label htmlFor="name" className="text-left">Name</label>
          <input
            type="text"
            name="title"
            className="w-full mb-2 border-2"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col justify-start">
          <label htmlFor="description" className="text-left">Description</label>
          <textarea
            name="description"
            id="description"
            rows="2"
            cols="4"
            className="w-full mb-2 border-2"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col justify-start">
          <label htmlFor="price" className="text-left">Price</label>
          <input
            type="text"
            name="price"
            className="w-[50%] mb-2 border-2"
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col justify-start">
          <label htmlFor="price" className="text-left">Quantity</label>
          <input
            type="number"
            name="qty"
            className="w-[50%] mb-2 border-2"
            min={0}
            value={formData.qty}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col justify-start">
          <label htmlFor="category" className="text-left">Category</label>
          <select
            name="category" // Fixed name to match formData key
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mobiles">Mobiles</option>
            <option value="watches">watches</option>
            <option value="bags">bags</option>
            <option value="headset">headsets</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        <button type="submit" className="w-full mt-2 p-2 bg-blue-500 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Add;
