import { Link, useParams } from "react-router-dom";
import Ratings from "./Ratings";
import { useState, useEffect, useContext } from "react";
import productData from "../../data/product.json";
import { shopContext } from "../../ShopContextProvider";


const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const {addToCart}=useContext(shopContext)

  // Correctly destructure addToCart from useSho

  // Fetch product details based on id
  useEffect(() => {
    const selectedProduct = productData.find((product) => product.id.toString() === id);
    console.log(selectedProduct);
    if (selectedProduct) {
      setProduct(selectedProduct);
    }
  }, [id]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header captlize">Product Details</h2>
        <div>
          <span>
            <Link to="/">Home</Link>
          </span>
          <i className="ri-arrow-right-s-line"></i>
        </div>
      </section>

      <section className="section__container mt-8">
        <div className="flex flex-col items-center md:flex-row gap-8">
          <div>
            <img
              src={product.image}
              className="rounded w-full h-auto"
              alt={product.name}
            />
          </div>
          <div className="dmd:w-1/2 w-full">
            <h3 className="text-2xl font-semibold mb-4">{product.name}</h3>
            <p className="text-xl text-primary mb-4">${product.price}</p>
            <p>{product.description}</p>
            <div>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Color:</strong> {product.color}vite-project/src/assets/banner.png
              </p>
              <Ratings rating="4" />
            </div>
            <button
              className="mt-6 bg-primary text-white p-2 rounded-md hover:bg-yellow-300"
             onClick={()=>addToCart(product.id)}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </section>

      {/* Cart Display */}
    </>
  );
};

export default ProductDetails;
