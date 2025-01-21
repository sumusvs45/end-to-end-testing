/* eslint-disable react/prop-types */
import { useState } from "react";
import "../App.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ContactUs = ({ token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate=useNavigate('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Post data to your own backend API
    try {
      let result = await fetch('http://localhost:4000/v1/ecommerce/api/contact-us', {
        method: 'POST',
        body: JSON.stringify({ name, email, message }),
        headers: {
          "Content-Type": "application/json",
          "Auth": token,
        },
        mode:'cors'
      });

      // Check if the response is not ok
      if (!result.ok) {
        throw new Error('Failed to send message to the backend');
      }

      // Parse the result (ensure it's valid JSON)
      result = await result.json();

      if (!result.success) {
        throw new Error(result.message || 'Unknown error');
      }

      localStorage.setItem("user", JSON.stringify(result));

      // Web3Forms API payload
      const payload = {
        name,
        email,
        message,
        access_key: "50363ece-319e-43dd-82d3-a3f9f120730d",
      };

      // Send data to Web3Forms API
      const res = await fetch("http://localhost:4000/v1/ecommerce/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode:'cors'
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
        navigate('/')
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
    <section className="Contact">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Contact Form</h2>
        <div className="input-box">
          <label>Full Name</label>
          <input
            type="text"
            className="field"
            placeholder="Enter your name"
            name="name"
            pattern="[A-Z a-z \s @]+"
            title="specai charters are not allowed"
            required
            value={name}
           
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-box">
          <label>Email Address</label>
          <input
            type="email"
            className="field"
            placeholder="Enter your Email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-box">
          <label>Your Message</label>
          <textarea
            name="message"
            className="field mes"
            placeholder="Enter your message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button className="contact-button" type="submit">Send Message</button>
      </form>
    </section>
  );
};

export default ContactUs;
