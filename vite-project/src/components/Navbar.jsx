/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../../src/assets/logo.png'
import { useContext } from "react";
import { ShopContext } from "../context/shopContext";
import { useEffect } from "react";


const Navbar = ({token,setToken}) => {
  const {cart,setCart,fetchCart, setTotalPrice,setTotalQuantity}=useContext(ShopContext)

 const navigate=useNavigate('')
  const handleLogin = () => {
     // Logic to handle login (for example, open login form)
   
     fetchCart()
     navigate('/user')
     
   

   };
 
   const handleLogout = () => {// Logic to handle logout
     // Logic to handle logout
     localStorage.removeItem('token');  // Remove token from localStorage
     setToken('');  // Clear the token state
     setCart([]) // Redirect to the home page or any page
     setTotalPrice(0); // Reset total price
     setTotalQuantity(0); //set totalQuantity 0
     navigate('/'); //navigating to home page
    
     toast.success('You have logged out successfully');
   
   
    
     
   };

   useEffect(() => { // useffect hook render the page according to token dependencies.
    if (token) { // if token true fetch if not set cart to empty
      fetchCart(); // Fetch cart data if token exists
    } else {
      setCart([]);

     
      
    }
  }, [token]); 
 
  
  return (
    <>
      <header className="fixed-nav-bar w-nav bg-slate-300">
        <nav className="mx-auto px-4 flex  justify-between items-center">
          <ul className="nav__links flex gap-2">
            <li className="link">
              <Link to="/">Home</Link>
            </li>
            <li className="link">
              <Link to="/orders">orders</Link>
            </li>
            <li className="link">
              <Link to="/contact-us">Contact</Link>
            </li>
          </ul>
          {/* logo */}
          <div className="nav__logo">
            <Link to="/">
              <img src={logo} alt="logo" className="w-[110px]"/>
            </Link>
          </div>
          {/* icons */}
          <div className="nav__icons relative">
            <span>
              <Link to="/search">
                <i className="ri-search-line"></i>
              </Link>
            </span>
            <span>
              <Link to="/cart"> 
                <button className="hover:text-primary">
                  <i className="ri-shopping-cart-line"></i>
                  <sup className="text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center">
                    {/* items cart length */}
                  <p>Items in cart: {cart.length}</p> 

          
                  </sup>
                </button>
              </Link>
            </span>

            <span>
              {/* <Link to="/user">
                <i className="ri-user-line"></i>
              </Link> */}
                <div>
    {token ? (
      <button
        onClick={handleLogout} // when user click button then logout function trigger
        className="p-2 bg-primary text-white rounded"
      >
        Logout
      </button>
    ) : (
      <button
        onClick={handleLogin} //when user click button then login function trigger
        className="p-2 bg-primary text-white rounded"
      >
        Login
      </button>
    )}</div>
            </span>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
