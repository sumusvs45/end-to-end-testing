
import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"
import React from "react"
const Sidebar = () => {
  return (
    <>
     {/* displaying the links of add items,list items ,orders page  */}
    <div className="w-[18%] min-h-[100vh] border border-slate-600">
        <div className="flex flex-col py-10 ">
            <NavLink to="/add">
            <div className="flex align-center py-4 gap-3 border border-r-2 border-slate-700 cursor-pointer">
                <img src={assets.add_icon} alt="image"/>
                <p>Add items</p>
            </div>    

            </NavLink>
            <NavLink to="/list">
            <div className="flex align-center py-4 gap-3 border border-r-2 border-slate-700 cursor-pointer">
                <img src={assets.order_icon} alt="image"/>
                <p>list items</p>

            </div>

            </NavLink>
            <NavLink to="/orders">
            <div className="flex align-center py-4 gap-3 border border-r-2 border-slate-700 cursor-pointer">
                <img src={assets.order_icon} alt="image"/>
                <p>order items</p>

            </div>

            </NavLink>
            
          
        
        </div>
    </div>
    </>
  )
}

export default Sidebar