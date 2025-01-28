import React from 'react';
import { useCart } from '../components/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect,useState } from 'react';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [stockMap, setStockMap] = useState({});
  const [loading, setLoading] = useState(true);
  let totalPrice = 0;
  cartItems.forEach((item) => {
    totalPrice += item.price;
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart`, { items: cartItems }, { withCredentials: true });
        setStockMap(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const placeOrder = async () => {
    const allInStock = Object.values(stockMap).every(stock => stock);
    if (!allInStock) {
      alert('Some items are out of stock. Please remove them before placing the order.');
      return;
    }
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart/place-order`, { items: cartItems }, { withCredentials: true });
    alert('Order placed successfully!');
    clearCart();
    window.location.href = '/';
  };

  const handleRemoveClick = (e, item) => {
    e.stopPropagation();
    removeFromCart(item);
  };

  return (
    <div className="min-h-screen bg-[#f1f0e8] flex flex-col justify-center items-center py-10">
      <div className="w-full max-w-4xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#b3c8cf]">Your Cart</h2>
          <button
            onClick={clearCart}
            className="bg-[#be2e2e] text-white py-2 px-4 rounded hover:bg-[#d63f3f]"
          >
            Clear Cart
          </button>
        </div>
        {cartItems.length > 0 ? (
          <div>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                key={item._id}
                className="relative flex justify-between items-center bg-[#e5e1da] p-4 rounded-lg shadow-md"
              >
                <Link to={`/item/${item._id}`} className="flex-grow">
                  <div>
                    <h3 className="text-xl font-semibold text-[#89a8b2]">{item.title}</h3>
                    <p className="text-[#b3c8cf]">₹{item.price}</p>
                    <p className="text-[#89a8b2]">By {item.sellerName}</p>
                  </div>
                </Link>
                <button
                  onClick={(e) => handleRemoveClick(e, item)}
                  className="bg-[#b3c8cf] text-white py-2 px-4 rounded hover:bg-[#89a8b2]"
                >
                  Remove
                </button>
                {!loading && !stockMap[item._id] && (<div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  <span className="text-3xl px-2 text-[#e20000]">Out Of Stock!</span>
                </div>)}
              </li>
              
              ))}
            </ul>
            <div className="mt-6 text-right text-lg font-bold text-[#279fc7]">
              Total Price: ₹{totalPrice}
            </div>
            <button
              onClick={placeOrder}
              className="mt-4 w-full bg-[#b3c8cf] text-white py-2 px-4 rounded hover:bg-[#89a8b2]"
            >
              Place Order
            </button>
          </div>
        ) : (
          <p className="text-center text-[#89a8b2]">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
