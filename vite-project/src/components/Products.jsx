
import { useContext, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { Link } from "react-router-dom";

const Products = () => {
  const { products, addTocart } = useContext(ShopContext); // Destructure addToCart

  const [search, setSearch] = useState(""); // Local state for search query
  const [selectedCategory, setSelectedCategory] = useState(""); // Local state for selected category

  const categories = ["All", "mobiles", "bags", "watches", "Sports"]; // Example categories

  // Handle the search input change
  const handleSearchChange = (e) => { 
    setSearch(e.target.value);
  };

  // Handle the category dropdown change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter products based on search and selected category
  const filteredProducts = products.filter((item) => {
    // Filter by category
    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;
    // Filter by search query
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          {/* Search Input */}
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="px-4 py-2 border border-gray-300 rounded-lg w-1/2"
          />
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            {/* mapping the category */}
            {categories.map((category) => (
              <option key={category} value={category === "All" ? "" : category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Filtered Products */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow"
          >
            <div className="py-4">
              <Link to={`/products/${item._id}`}>
                <img
                  src={
                    item.imgSrc
                      ? `http://localhost:4000/images/${item.imgSrc}`
                      : `${item.imgSrc}`
                  }
                  alt={item.title}
                  className="w-full h-[180px] object-cover"
                />
              </Link>
            </div>

            <div className="p-4">
              <h3 className="text-2xl font-semibold text-gray-800">{item.title}</h3>
              <h4 >{item.description}</h4>
              <p className="text-lg  text-green-600 mt-2">{item.price}/Rs</p>
              <button
                className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() =>
                  addTocart(
                    item._id,
                    item.title,
                    item.price,
                    item.description,
                    item.qty,
                    item.imgSrc
                  ) // Pass a function to handle the click
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
