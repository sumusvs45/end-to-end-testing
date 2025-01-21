/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Create the context outside the component
const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Store token in state
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // New state to store the total price
  const [totalQuantity, setTotalQuantity] = useState(0); // New state to store the total quantity

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const resp = await axios.get(
        "http://localhost:4000/api/v1/products/all",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.data.success) {
        setProducts(resp.data.products);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError(err.message); // Set error message if there's a network or server issue
    } finally {
      setLoading(false); // Set loading to false once the request is completed (success or failure)
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Run once on component mount

  // Fetch cart data whenever token is available or changes
  const fetchCart = async () => {
    try {
      console.log("Token:", token); // Log the token to ensure it's correct
      const res = await axios.get("http://localhost:4000/api/v1/usercart", {
        headers: {
          auth: token, // Send the token in the headers
        },
      });

      console.log("API Response:", res.data);

      if (res.data.success) {
        const cartItems = Object.values(res.data.cartData);
        console.log("Cart Items:", cartItems);
        setCart(cartItems); // Set the cart data directly
        calculateTotal(cartItems); // Calculate the total price and quantity
      } else {
        console.log("Error fetching cart data:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error.message);
    }
  };

  useEffect(() => {
  
      fetchCart();
    
  }, []); // Depend on token, so it fetches cart whenever the token changes

  // Add item to cart
  const addTocart = async (productId, title, price, description, qty, imgSrc) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/cart",
        { productId, title, price, description, qty, imgSrc },
        {
          headers: {
            auth: token, // Send token for authentication
          },
        }
      );

      if (res.data.success) {
        // Update the cart state immediately if the cart is updated on the backend
        const updatedCart = Object.entries(res.data.cartData)
        console.log("up",updatedCart) // Assuming the backend returns the updated cart data
        if (updatedCart.length === 0) {
          console.log("Cart is empty after adding item");
        } else {
          setCart(updatedCart); // Update cart state
          calculateTotal(updatedCart); // Recalculate totals
          console.log("Cart updated:", updatedCart);
        }
        setCart(updatedCart); // Update cart state
        calculateTotal(updatedCart); // Recalculate totals
      } else {
        setError("Failed to add item to cart");
      }
    } catch (err) {
      console.error("Error adding item to cart:", err.message);
      setError("Failed to add item to cart: " + err.message);
    }
  };

  // Calculate total price and total quantity
  const calculateTotal = (cartItems) => {
    let total = 0;
    let quantity = 0;

    cartItems.forEach((item) => {
      if (item.price && item.qty) {
        total += item.price * item.qty; // Accumulate total price
        quantity += item.qty; // Accumulate total quantity
      }
    });

    setTotalPrice(total);
    setTotalQuantity(quantity);

    console.log("Total Price:", total);
    console.log("Total Quantity:", quantity);
  };

  // Update quantity in the cart
  const updateQuantity = async (productId, qty) => {
    if (qty <= 0) return; // Prevent updating to a quantity less than 1

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/updateCart", // URL for updating cart
        { productId, qty },
        {
          headers: {
            "Content-Type": "application/json",
            auth: token, // Send the token for authorization
          },
        }
      );

      if (res.data.success) {
        const updatedCart = cart.map((item) =>
          item.productId === productId ? { ...item, qty } : item
        );
        setCart(updatedCart); // Update state to reflect changes
        calculateTotal(updatedCart); // Recalculate total
        console.log("Quantity updated:", res.data);
      } else {
        console.log("Error updating quantity:", res.data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error.message);
    }
  };

  // Decrease quantity and remove item if quantity is 1
  const decreaseQuantity = async (productId, qty) => {
    if (qty <= 1) {
      removeCartItem(productId); // If the quantity is 1 or less, remove the item from the cart
      return;
    }

    try {
      const newQty = qty - 1;
      const res = await axios.post(
        "http://localhost:4000/api/v1/decreaseQuantity", // URL for decreasing cart item quantity
        { productId, qty: newQty },
        {
          headers: { auth: token },
        }
      );

      if (res.data.success) {
        const updatedCart = cart.map((item) =>
          item.productId === productId ? { ...item, qty: newQty } : item
        );
        setCart(updatedCart);
        calculateTotal(updatedCart); // Recalculate totals
      } else {
        console.log("Failed to decrease quantity:", res.data.message);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error.message);
    }
  };

  // Remove item from the cart
  const removeCartItem = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/removeCart",
        { productId },
        {
          headers: { auth: token }, // Send the token for authentication
        }
      );

      if (res.data.success) {
        const updatedCart = cart.filter((item) => item.productId !== productId);
        setCart(updatedCart); // Update cart state
        calculateTotal(updatedCart); // Recalculate totals
        console.log("Item removed from cart");
      } else {
        console.log("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        error,
        addTocart,
        token,
        setToken,
        cart,
        setCart,
        updateQuantity,
        decreaseQuantity,
        fetchCart,
        removeCartItem,
        calculateTotal,
        totalPrice,
        totalQuantity,
        setTotalPrice,
        setTotalQuantity

       
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export { ShopContext }; // Export the context so it can be used elsewhere
export default ShopContextProvider