import { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the email value to check if it's correctly updated
    console.log("Email:", email);

    if (!email) {
      toast.error("Please enter user id");
      return;
    }

    try {
      // Log the request payload before sending it
      console.log("Sending request with email:", email);

      const response = await axios.post("http://localhost:3000/auth/forgotpassword", { email });

      // Log the response to check if it's coming through correctly
      console.log("Response:", response);

      if (response.data.status) {
        setTimeout(() => {
          toast.success('Check your email for reset password link');
          navigate("/login"); 
        }, 1000)
        
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      // Log the error for debugging
      console.log("Error:", err);
      toast.error('User not registered');
    }
  };

  return (
    <div className="sign-up-container">
      {/* Ensure ToastContainer is rendered here */}
      <ToastContainer />
      
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
