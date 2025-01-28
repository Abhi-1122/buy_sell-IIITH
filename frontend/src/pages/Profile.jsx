import React, { useState, useEffect } from 'react';
import { useCart } from '../components/CartContext';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    location: '',
    password: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const {clearCart} = useCart();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, { withCredentials: true });
        console.log('User data:', response.data);
        response.data.password = '';
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user`, user, { withCredentials: true });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('token');
    clearCart();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#f1f0e8] flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-[#e5e1da] p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#b3c8cf] mb-4">Profile</h1>
        {!isEditing ? (
          <div>
            <p className="text-[#2f3a3d]">First Name: {user.firstname}</p>
            <p className="text-[#2f3a3d]">Last Name: {user.lastname}</p>
            <p className="text-[#2f3a3d]">Email: {user.email}</p>
            <p className="text-[#2f3a3d]">Contact: {user.contact}</p>
            <p className="text-[#2f3a3d]">Location: {user.location}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-[#b3c8cf] text-white py-2 px-4 rounded hover:bg-[#89a8b2]"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-[#89a8b2]">First Name</label>
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              className="w-full p-2 border border-[#b3c8cf] rounded mb-4"
            />
            <label className="block text-[#89a8b2]">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              className="w-full p-2 border border-[#b3c8cf] rounded mb-4"
            />
            <label className="block text-[#89a8b2]">Email (Cannot be Edited)</label>
            <input
              type="email"
              name="email"
              value={user.email}
              className="w-full p-2 border border-[#b3c8cf] rounded mb-4"
              readOnly
            />
            <label className="block text-[#89a8b2]">Contact</label>
            <input
              type="text"
              name="contact"
              value={user.contact}
              onChange={handleChange}
              className="w-full p-2 border border-[#b3c8cf] rounded mb-4"
            />
            <label className="block text-[#89a8b2]">Location</label>
            <input
              type="text"
              name="location"
              value={user.location}
              onChange={handleChange}
              className="w-full p-2 border border-[#b3c8cf] rounded mb-4"
            />
            <label className="block text-[#89a8b2]">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full p-2 border border-[#b3c8cf] rounded mb-4"
            />
            <button
              type="submit"
              className="bg-[#b3c8cf] text-white py-2 px-4 rounded hover:bg-[#89a8b2]"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 bg-[#ec1e1e] text-white py-2 px-4 rounded hover:bg-[#ec1e1ec5] focus:outline-none focus:ring-2 focus:ring-[#89a8b2] focus:ring-opacity-50"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
