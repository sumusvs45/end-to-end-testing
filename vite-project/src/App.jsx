
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Account from './pages/Account'
import Home from './pages/Home'
import Cart from './pages/Cart'
import ProductDetails from './components/ProductDetails'
import { useContext} from 'react'
import { ShopContext } from './context/shopContext'
import OrderSummary from '../src/components/OrderSummary'
import PlaceOrder from './pages/PlaceOrder'
import Feedback from '../src/pages/Feedback'
import ContactUs from '../src/pages/ContactUs'
import { ToastContainer} from 'react-toastify';

// import Feedback from './pages/Feedback'

function App() {
  const {token,setToken}=useContext(ShopContext)   

  return (
    <>
    <Navbar token={token} setToken={setToken}/>  {/* navbar and added token to it  */}
    <ToastContainer/>  {/* toast notification */}
    <Routes>
       {/* Homepage Route or url*/}
      <Route path="/" element={<Home/>}/>
       {/* Specific product  Route or url */}

      <Route path="/products/:id" element={<ProductDetails token={token}/>}/>
        {/* cart  Route or url */}
      <Route path="/cart" element={<Cart token={token}/>}/>
        {/* register login   Route or url */}
      <Route path="/user" element={<Account token={token} setToken={setToken}/>}/>
        {/* checkoutpage or order Summary  Route or url */}
      <Route path="/checkout" element={<OrderSummary token={token}/>}/>
        {/* user orders page  Route or url */}
      <Route path="/orders" element={<PlaceOrder token={token}/>}/>
            {/* Feedback form   Route  or url*/}
      <Route path="/feedback" element={<Feedback token={token}/>}/>
         {/* Contact-us page Route or url */}/
      <Route path="/contact-us" element={<ContactUs token={token}/>}/>
    

     
    </Routes>
   
   
    </>
  )
}

export default App
