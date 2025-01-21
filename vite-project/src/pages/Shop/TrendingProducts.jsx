/* eslint-disable no-unused-vars */
import { useState } from "react"
import ProductsCards from "./ProductsCards"
import products from '../../data/product.json'

const TrendingProducts = () => {
    const[visibleProducts,setVisibleProducts]=useState(8)
    const laodMoreProducts = ()=>
    {
        setVisibleProducts(prevcount=>prevcount+4)
    }
  return (
    <section className="section__container product__container">
        <h2 className="section__header">Trending Products</h2>
        <p className="section__subheader mb-12">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus assumenda architecto amet labore dignissimos ea nulla vel! Asperiores, expedita quo!</p>
        {/* products-cards */}
        <div className="mt-12">
        <ProductsCards products={products.slice(0,visibleProducts)}  />
        </div>
        <div className="product_btn">
            {
                visibleProducts<products.length&&(<button className="btn mt-4" onClick={laodMoreProducts}>Load More</button>)
            }

        </div>
       
    </section>
  )
}

export default TrendingProducts