import { useEffect, useState } from 'react'
import products from '../../data/product.json'
import { useParams } from 'react-router-dom'
import ProductsCards from '../Shop/ProductsCards'

const CategoryPage = () => {
    const {categoryname}=useParams()
    const[filterProducts,setFilterProducts]=useState([])
  
    
    useEffect(()=>
    {
      const filtered=products.filter((product)=>product.category===categoryname.toLocaleLowerCase())
      setFilterProducts(filtered)
    },[categoryname])
  return (
    <>
    <section className='section__container bg-primary-light'>
        <h2 className='section__header captlize'>{categoryname}</h2>
        <p className='section__subheader'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci, enim amet.</p>

    </section>
    {/* // prodductscard */}
    <div className="section__container">
        
    <ProductsCards products={filterProducts}/>
    </div>
    </>
   
  )
}

export default CategoryPage