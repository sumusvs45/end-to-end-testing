 
import { useContext } from "react";
import { ShopContext } from "../context/shopContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const{cart,updateQuantity,decreaseQuantity,removeCartItem,totalPrice,totalQuantity}=useContext(ShopContext)
 console.log("cart",cart)
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {/* Display Total Quantity and Price */}
     

      {/* Conditionally render the cart items */}
      {cart.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">Product</th>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Map over the cart (now an array of items) */}
              {cart.map((item) => (
                <tr key={item.productId} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <img
                        src={item.imgSrc ? `http://localhost:4000/images/${item.imgSrc}` :`${item.imgSrc}`}
                        alt={item.title}
                        className="w-16 h-16 object-cover mr-4"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4">{item.title}</td>
                  <td className="py-2 px-4">₹{item.price}</td>
                  <td className="py-2 px-4 flex items-center justify-center">
                    <button
                      className="px-2 py-1 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 focus:outline-none"
                      onClick={() => decreaseQuantity(item.productId, item.qty)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.qty}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 focus:outline-none"
                      onClick={() => updateQuantity(item.productId, item.qty + 1)} // Increase by 1
                    >
                      +
                    </button>
                  </td>
                  <td className="py-2 px-4">₹{(item.price * item.qty).toFixed(0)}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => removeCartItem(item.productId)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/checkout">
          <div className="w-40  m-4 text-xl float-right text-white  bg-black px-3 py-2  rounded-e-md font-semibold"> Pay ₹{totalPrice.toFixed(0)}</div>
          </Link>
         

        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
