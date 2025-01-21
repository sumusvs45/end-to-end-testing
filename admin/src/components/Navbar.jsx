/* eslint-disable react/prop-types */
import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react"


const Navbar = ({token,setToken}) => {
 const navigate=useNavigate('')

  const handleLogin = () => {
    // Logic to handle login (for example, open login form)
    navigate('/user');
  };

  const handleLogout = () => {
    // Logic to handle logout
    localStorage.removeItem('token');  // Remove token from localStorage
    setToken('');  // Clear the token state
    toast.success('You have logged out successfully');
    navigate('/');  // Redirect to the home page or any page
  };

  return (
    <div className="flex justify-between align-center py-[8px] px-[4%]">
      <img src={assets.logo} alt="logo" className="w-[80px]" />

      <div>
    {token ? (
      <button
        onClick={handleLogout}
        className="p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    ) : (
      <button
        onClick={handleLogin}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Login
      </button>
    )}
  </div>
    </div>
  )
}

export default Navbar;
