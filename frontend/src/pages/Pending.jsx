import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Pending = () => {
    const [sellOrders, setSellOrders] = useState([]);

    useEffect(() => {
        const fetchSellOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/sell`, { withCredentials: true });
                console.log(response.data);
                setSellOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchSellOrders();
    }, []);

    return (
        <div className="min-h-screen bg-[#f1f0e8] py-10 pt-24">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-[#89a8b2] mb-8">Pending Sell Orders</h1>
                <ul className="space-y-4">
                    {sellOrders.map((order) => (
                        <li className="flex justify-between items-center bg-[#e5e1da] p-6 rounded-lg shadow-md transition duration-300" key={order._id}>
                            <Link to={`/deliver/${order.orderID}`} className="flex justify-between items-center w-full">
                                <div>
                                    <h3 className="text-xl font-semibold text-[#89a8b2]">{order.title}</h3>
                                    <p className="text-[#b3c8cf]">Price: ₹{order.price}</p>
                                    <p className="text-[#89a8b2]">Status: {order.status}</p>
                                    <p className="text-[#b3c8cf]">Buyer: {order.buyerName}</p>
                                </div>
                                <button
                                    className="bg-[#89a8b2] text-white py-2 px-4 rounded-lg hover:bg-[#b3c8cf] transition duration-300"
                                >
                                    Deliver Item
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Pending;
