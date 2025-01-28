import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../components/CartContext';

const Item = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [buttonText, setButtonText] = useState('');
  const preItems = useCart();
  const cartItems = preItems.cartItems;
  const { addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/item/${id}`, { withCredentials: true });
        console.log(response.data);
        const fetched = response.data;
        setItem(fetched);
        if(fetched.stock === false && fetched){
          setButtonText('Out of Stock');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    const isInCart = cartItems.some(cartItem => cartItem._id === id);
    if (isInCart) {
      setButtonText('Added To Cart!');
    } else {
      setButtonText('Add To Cart');
    }


    fetchItem();
  }, []);

  const onAddCart = (item) => {
    if(buttonText === 'Out of Stock'){
      return;
    }
    if (buttonText === 'Added To Cart!') {
      removeFromCart(item);
      setButtonText('Add To Cart');
    }
    else {
      addToCart(item);
      setButtonText('Added To Cart!');
    }
  };

  if (!item) {
    return <p>Item Does Not Exist</p>;
  }

  return (
    <div className="min-h-screen bg-[#f1f0e8] flex justify-center items-center py-10">
      <div className="w-full max-w-3xl bg-[#e5e1da] p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-[#b3c8cf] mb-4">{item.title}</h2>
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-lg text-[#637b83] mb-2">Category: {item.category}</p>
        <p className="text-lg text-[#637b83] mb-2">Price: ₹{item.price}</p>
        <p className="text-lg text-[#637b83] mb-4">Seller: {item.sellerName}</p>
        <p className="text-lg text-[#637b83] mb-4">Seller Contact: {item.sellerPhone}</p>
        <p className="text-lg text-[#637b83] mb-4">Seller Location: {item.sellerLoc}</p>
        <p className="text-lg text-[#637b83] mb-4">{item.description}</p>
        <button
          onClick={()=>onAddCart(item)}
          className="w-full bg-[#b3c8cf] text-white py-2 px-4 rounded hover:bg-[#89a8b2] transition duration-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Item;
