import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import ListItems from './pages/ListItems';
import Orders from './pages/Orders';
import Account from './pages/Login';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import React from 'react'; // React import is fine here, especially if using React hooks

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <>
      {/* navbar passing the token */}
      <Navbar token={token} setToken={setToken} /> 
      <ToastContainer />
      <hr />
      <div className="flex">
        {/* sidebar */}
        <Sidebar /> 
        <Routes>
            {/* adding the items route page or url  */}
          <Route path="/add" element={<Add token={token} />} />
           {/* list items route page or url */}

          <Route path="/list" element={<ListItems token={token} />} />
           {/* orders page route or url  */}
          <Route path="/orders" element={<Orders token={token} />} />
          {/* user login  & sign up route or  url  */}
          <Route path="/user" element={<Account token={token} setToken={setToken} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
