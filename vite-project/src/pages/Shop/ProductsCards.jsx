/* eslint-disable react/prop-types */

import { Link } from "react-router-dom"
import Ratings from "./Ratings";
import { useContext } from "react";
import { shopContext } from "../../ShopContextProvider";


const ProductsCards = ({ products }) => {
   const {addToCart}=useContext(shopContext)
 
  return (
    <div className="grid grid-cols-1sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {
        products.map((product, index) => (
          <div className="product__card" key={product._id || index}>
          <div className="relative">
          <Link to={`/shop/${product.id}`}>
              <img 
                src={product.image} 
                alt="product-img" 
                className="max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300" 
              />
            </Link>
            <div >
             <button className="hover:block absolute bottom-3 right-3 " onClick={() => addToCart(product.id)}>
    <i className="ri-shopping-cart-2-line text-black  bg-primary p-1.5 hover:bg-green-300  transition-transform duration-75 "></i>
</button>

            </div>
            {/* productDescription */}
            <div className="div">
                <h4>{product.name}</h4>
                <p>{product.price}<s>{product?product.oldPrice:null}</s></p>
                <p><Ratings rating={product.rating}/></p>

            </div>
          </div>
          </div>
        ))
      }
    </div>
  )
}

export default ProductsCards;
