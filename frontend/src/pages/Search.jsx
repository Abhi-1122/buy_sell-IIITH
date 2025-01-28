import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';

const Search = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [buttonText, setButtonText] = useState({});
  const { addToCart, removeFromCart, cartItems } = useCart();

  const categories = ['Electronics', 'Fashion', 'Home', 'Books','Food','Stationary','Sports','Health','Beauty','Others'];

  const onAddCart = (item) => {
    const buttonTxt = buttonText[item._id] || 'Add To Cart';
    if (buttonTxt === 'Added To Cart!') {
      removeFromCart(item);
      setButtonText((prev) => ({ ...prev, [item._id]: 'Add To Cart' }));
    } else {
      addToCart(item);
      setButtonText((prev) => ({ ...prev, [item._id]: 'Added To Cart!' }));
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/item`, { withCredentials: true });
        setItems(response.data);
        setFilteredItems(response.data);

        const newButtonText = {};
        cartItems.forEach((obj) => {
          newButtonText[obj._id] = 'Added To Cart!';
        });
        setButtonText(newButtonText);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    let updatedItems = items;

    if (searchTerm) {
      updatedItems = updatedItems.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategories.length > 0) {
      updatedItems = updatedItems.filter(item => selectedCategories.includes(item.category));
    }
    setFilteredItems(updatedItems);
  }, [searchTerm, selectedCategories, items]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f0e8] flex flex-col justify-center items-center py-10">
      <div className="w-full max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-[#b3c8cf] mb-6 text-center">Items for Sale</h2>

        <div className="mb-6 flex justify-between">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-full max-w-sm border border-[#b3c8cf] rounded-lg"
          />
        </div>

        <div className="flex">
          <div className="w-1/4 pr-4">
            <h3 className="text-lg font-bold text-[#637b83] mb-2">Categories</h3>
            {categories.map((category) => (
              <div key={category} className="mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              </div>
            ))}
          </div>

          <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-[#e5e1da] p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <Link to={`/item/${item._id}`}>
                  <div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-[#89a8b2]">{item.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#b3c8cf]">₹{item.price}</span>
                      <span className="text-sm text-[#89a8b2]">{item.category}</span>
                      <span className="text-sm text-[#89a8b2]">by {item.sellerName}</span>
                    </div>
                  </div>
                </Link>
                <button
                  id="button"
                  onClick={() => onAddCart(item)}
                  className="mt-4 w-full bg-[#b3c8cf] text-white py-2 px-4 rounded hover:bg-[#89a8b2]"
                >
                  {buttonText[item._id] || 'Add To Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
