import { useState } from "react"
import productsData from '../../data/product.json'
import ProductsCards from "../Shop/ProductsCards"

const Search = () => {
    const[search,setSearch]=useState('')
    const [filter,setFilter]=useState(productsData)
    const handleSearch=()=>
    {
        const query=search.toLocaleLowerCase()
        const filtered=productsData.filter((product)=>product.name.toLocaleLowerCase().includes(query)||product.description.toLocaleLowerCase().includes(query))
        setFilter(filtered)
    }
  return (
    <>
     <section className='section__container bg-primary-light'>
        <h2 className='section__header captlize'>Search Products</h2>
        <p className='section__subheader'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci, enim amet.</p>

    </section>
    <div className="section__container">
        <div className="w-full flex flex-col md:flex-row items-center">
            <input type="text" placeholder="search for products" onChange={(e)=>setSearch(e.target.value)} className="search-bar w-full max-w-4xl p-2 border rounded"/>
            <button className="search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded" onClick={handleSearch}>Search</button>
        </div>
    </div>
    <ProductsCards products={filter}/>
    </>
  )
}

export default Search