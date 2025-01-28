import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Deliver = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/${id}`, { withCredentials: true });
        console.log(response.data);
        const fetched = response.data;
        setItem(fetched);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };


    fetchItem();
  }, []);

  if (!item) {
    return <p>Order Does Not Exist</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/otp/${id}`, { otp }, { withCredentials: true });
    console.log(response.data);
    alert(response.data.message);
    window.location.href= '/pending';
  }
        catch (error) {
      console.log(error);
    }
  };

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
        <p className="text-lg text-[#637b83] mb-4">Buyer: {item.buyerName}</p>
        <p className="text-lg text-[#637b83] mb-4">Buyer Contact: {item.buyerPhone}</p>
        <p className="text-lg text-[#637b83] mb-4">Buyer Location: {item.buyerLoc}</p>
        <p className="text-lg text-[#637b83] mb-4">{item.description}</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-lg text-[#192022] mb-2">Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            placeholder="Enter OTP"
          />
          <button
            type="submit"
            className="bg-[#89a8b2] text-white py-2 px-4 rounded-lg hover:bg-[#b3c8cf] transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Deliver;
