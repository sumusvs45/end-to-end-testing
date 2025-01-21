import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/shopContext';

const ProductDetails = () => {
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);
  const { id } = useParams(); // Extract product ID from URL params
  const {addTocart}=useContext(ShopContext)

  // Fetch product details based on the ID from the URL
  const fetchProducts = async () => {
    try {
      //getting the product details based on id
      const resp = await axios.get(`http://localhost:4000/api/v1/products/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (resp.data.success) {
        console.log('single data', resp.data.singleProduct);
        setSingleProduct(resp.data.singleProduct); // Save the product data
      } else {
        setError('Failed to load product');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load product');
    } finally {
      setLoading(false); // Set loading to false once the request is completed
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]); // Re-fetch if the id changes

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display an error message
  }

  return (
    <div className="container mx-auto p-4">
      {singleProduct ? (
        <div className="flex singleProducts-center justify-between gap-8">
          {/* Left side: Product Image */}
          <div className="w-1/2">
            <img
              src={singleProduct.imgSrc ? `http://localhost:4000/images/${singleProduct.imgSrc}` :`${singleProduct.imgSrc}`}
              alt={singleProduct.title}
              className="w-full h-70 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right side: Product Info */}
          <div className="w-1/2">
            <h2 className="text-3xl font-bold mb-4">{singleProduct.title}</h2>
            <p className="text-lg text-gray-700 mb-4">{singleProduct.description}</p>
            <p className="text-xl font-semibold text-green-500 mb-4">Price: ${singleProduct.price}</p>
            <p className="text-md text-gray-600 mb-2">Category: {singleProduct.category}</p>
            <p className="text-md text-gray-600">Stock: {singleProduct.qty} available</p>
            {/* Add to Cart Button */}
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-tt700 transition-colors"
            onClick={()=>addTocart(singleProduct._id, singleProduct.title,  singleProduct.price, singleProduct.description,singleProduct.qty, singleProduct.imgSrc)}>
              Add to Cart
            </button>
          </div>
        </div>
      ) : (
        <div>No product found</div>
      )}
    </div>
  );
};

export default ProductDetails;
