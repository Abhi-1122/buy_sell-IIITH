import React from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useCart } from './CartContext';
import { useState,useEffect } from 'react';

const Navbar = () => {
  const items=useCart();
  // console.log(items.cartItems);
  const [itemsNumber, setItemsNumber] = useState(items.cartItems.length);
  useEffect(() => {
    setItemsNumber(items.cartItems.length);
  }, [items.cartItems]);
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-lg font-semibold">Buy/Sell @ IIITH</a>
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            <a href="/" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="/history" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Order History</a>
            <a href="/sell" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Sell Item</a>
            <a href="/posted" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Posted Items</a>
            <a href="/pending" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Deliver Items</a>
            <a href="/chat" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Support</a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <a href="/cart" className="p-2 rounded-full">
                <FaShoppingCart size={20} />
              </a>
              <span className="absolute top-5 right-0 text-xs bg-red-500 text-white rounded-full h-3 w-3 flex items-center justify-center">
                {itemsNumber}
              </span>
            </div>
            <a href="/profile" className="hover:bg-blue-700 p-2 rounded-full">
              <FaUserCircle size={20} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
