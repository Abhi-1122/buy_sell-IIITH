import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Posted = () => {
  const [postedItems, setPostedItems] = useState([]);

  useEffect(() => {
    const fetchPostedItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/item/posted`, { withCredentials: true });
        setPostedItems(response.data);
      } catch (error) {
        console.error('Error fetching posted items:', error);
      }
    };

    fetchPostedItems();
  }, []);

  const handleRemovePost = async (itemId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/item/${itemId}`, { withCredentials: true });
      setPostedItems((prevItems) => prevItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error removing post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f0e8] flex flex-col items-center py-10 pt-24">
      <h2 className="text-3xl font-bold text-[#89a8b2] mb-6">Posted Items that have no Orders</h2>
      {postedItems.length > 0 ? (
        <ul className="w-full max-w-4xl space-y-4">
          {postedItems.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-[#e5e1da] p-4 rounded-lg shadow-md"
            >
              <div>
                <h3 className="text-xl font-semibold text-[#b3c8cf]">{item.title}</h3>
                <p className="text-[#89a8b2]">Price: ₹{item.price}</p>
                <p className="text-[#b3c8cf]">Category: {item.category}</p>
                <p className="text-[#b3c8cf]">Description: {item.description}</p>

              </div>
              <button
                onClick={() => handleRemovePost(item._id)}
                className="bg-[#e23d3d] text-white py-2 px-4 rounded hover:bg-[#e94242b6] transition duration-300"
              >
                Remove Post
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[#b3c8cf] text-lg">No items to show</p>
      )}
    </div>
  );
};

export default Posted;
