/* eslint-disable react/prop-types */
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ContactUs = ({ token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result = await fetch('http://localhost:4000/v1/ecommerce/api/contact-us', {
        method: 'POST',
        body: JSON.stringify({ name, email, message }),
        headers: {
          "Content-Type": "application/json",
          "Auth": token,
        },
        mode: 'cors'
      });

      if (!result.ok) {
        throw new Error('Failed to send message to the backend');
      }

      result = await result.json();

      if (!result.success) {
        throw new Error(result.message || 'Unknown error');
      }

      localStorage.setItem("user", JSON.stringify(result));

      const payload = {
        name,
        email,
        message,
        access_key: "50363ece-319e-43dd-82d3-a3f9f120730d",
      };

      const res = await fetch("http://localhost:4000/v1/ecommerce/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      if (!res.ok) {
        console.error("API Response Error", res.statusText);
        Swal.fire({
          title: "Error!",
          text: `Failed to send message. (${res.statusText})`,
          icon: "error",
        });
        return;
      }

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Message sent successfully!",
          icon: "success",
        });
        setName("");
        setEmail("");
        setMessage("");
        navigate('/');
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to send your message.",
          icon: "error",
        });
      }

    } catch (error) {
      console.error("Network or Fetch Error:", error);
      Swal.fire({
        title: "Error!",
        text: `An error occurred: ${error.message}`,
        icon: "error",
      });
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Contact Us</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              name="name"
              pattern="[A-Za-z\s]+"
              title="Special characters are not allowed"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Message</label>
            <textarea
              name="message"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
