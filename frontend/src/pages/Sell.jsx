import React, { useState } from 'react';
import axios from 'axios';

const Sell = () => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        image: null,
        category: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObject = new FormData();
        formDataObject.append('title', formData.title);
        formDataObject.append('price', formData.price);
        formDataObject.append('description', formData.description);
        formDataObject.append('image', formData.image);
        formDataObject.append('category', formData.category);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/item/sell`,
                formDataObject,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log(response);
            alert('Item posted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error posting form data:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f0e8] flex justify-center items-center">
            <div className="w-full max-w-md bg-[#e5e1da] p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-[#b3c8cf] mb-4">Sell an Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[#89a8b2]">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border border-[#b3c8cf] rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#89a8b2]">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-2 border border-[#b3c8cf] rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#89a8b2]">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-[#b3c8cf] rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#89a8b2]">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border border-[#b3c8cf] rounded"
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home">Home</option>
                            <option value="Books">Books</option>
                            <option value="Food">Food</option>
                            <option value="Stationary">Stationary</option>
                            <option value="Sports">Sports</option>
                            <option value="Health">Health</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[#89a8b2]">Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full p-2 border border-[#b3c8cf] rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#b3c8cf] text-white py-2 px-4 rounded hover:bg-[#89a8b2]"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sell;
