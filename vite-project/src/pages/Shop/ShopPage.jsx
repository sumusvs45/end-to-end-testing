/* eslint-disable react-hooks/exhaustive-deps */
 
import { useEffect, useState } from "react";
import productsData from '../../data/product.json';
import ProductsCards from "./ProductsCards";
import ShopFilter from "./ShopFilter";

const ShopPage = () => {
  const [products, setProducts] = useState(productsData);
  const [productsState, setProductsState] = useState({
    category: 'all',  // Default is 'all', meaning no specific category is selected
    color: 'all',     // Default is 'all', meaning no specific color product is selected
    priceRange: ''    // Default is empty string, no price filter is applied
  });

  const filters = {
    categories: ['all', 'accessories', 'dress', 'jewellery', 'cosmetics'],
    colors: ['all', 'black', 'red', 'gold', 'silver', 'blue', 'beige', 'green'],
    priceRange: [
      { label: 'under 500₹', min: 0, max: 500 },
      { label: '500₹-1000₹', min: 500, max: 1000 },
      { label: '1000₹ - 2000₹', min: 1000, max: 2000 },
      { label: 'above 2000₹', min: 2000, max: "infinity" }
    ]
  };

  const applyproductss = () => {
    let filterProducts = productsData;

    // Filter products by category
    if (productsState.category && productsState.category !== 'all') {
      filterProducts = filterProducts.filter(product => product.category === productsState.category);
    }

    // Filter products by color
    if (productsState.color && productsState.color !== 'all') {
      filterProducts = filterProducts.filter(product => product.color === productsState.color);
    }

    // Filter products by price range
    if (productsState.priceRange) {
      const [minPrice, maxPrice] = productsState.priceRange.split('-').map(Number);
      filterProducts = filterProducts.filter((product) =>
        product.price >= minPrice && (maxPrice === "infinity" ? product.price >= minPrice : product.price <= maxPrice)
      );
    }

    setProducts(filterProducts); // Set the filtered products
  };

  useEffect(() => {
    applyproductss();
  }, [productsState]);

  const clearproductss = () => {
    setProductsState({
      category: 'all',
      color: 'all',
      priceRange: ''
    });
  };

  return (
    <>
      <section className='section__container bg-primary-light'>
        <h2 className='section__header capitalize'>Shop Page</h2>
        <p className='section__subheader'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci, enim amet.</p>
      </section>

      <div className="section__container flex flex-col md:flex-row md:gap-12 gap-8">
        {/* Left-side Filters */}
        <div className="">
          <ShopFilter filters={filters} filterState={productsState} setFilterState={setProductsState} clearFilters={clearproductss}/>
        </div>

        <div className="div">
          <h3 className="text-xl font-medium">Products Available</h3>
          <ProductsCards products={products} />
        </div>
      </div>
    </>
  );
};

export default ShopPage;
