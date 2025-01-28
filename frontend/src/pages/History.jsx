import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const History = () => {
    const [view, setView] = useState('buy');
    const [buyOrders, setBuyOrders] = useState([]);
    const [sellOrders, setSellOrders] = useState([]);

    useEffect(() => {
        const fetchSellOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/closed`, { withCredentials: true });
                console.log("sell", response);
                setSellOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        const fetchBuyOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/buy`, { withCredentials: true });
                console.log("buy", response.data);
                setBuyOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchSellOrders();
        fetchBuyOrders();
    }, []);

    async function giveOTP(orderId,title) {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/otp`, { orderId }, { withCredentials: true });
        console.log(response);
        alert(`OTP to buy ${title}: ${response.data.otp}`);
    }

    return (
        <div className="min-h-screen bg-[#f1f0e8] flex flex-col items-center py-10 pt-24">
            <div className="w-full max-w-4xl px-4">
                {/* Button group for toggling between Buy and Sell */}
                <div className="flex justify-center space-x-6 mb-6">
                    <button
                        onClick={() => setView('buy')}
                        className="bg-[#89a8b2] text-white py-2 px-6 rounded-lg hover:bg-[#b3c8cf] transition duration-300"
                    >
                        Buy Orders
                    </button>
                    <button
                        onClick={() => setView('sell')}
                        className="bg-[#89a8b2] text-white py-2 px-6 rounded-lg hover:bg-[#b3c8cf] transition duration-300"
                    >
                        Sell Orders
                    </button>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-[#b3c8cf] mb-4">
                        {view === 'buy' ? 'Buy Orders' : 'Sell Orders'}
                    </h2>
                    <ul className="space-y-4">
                        {(view === 'buy' ? buyOrders : sellOrders).map((order) => (
                            <li className="flex justify-between items-center bg-[#e5e1da] p-4 rounded-lg shadow-md" key={order._id}>
                                <Link to={`/item/${order._id}`} className="flex-1">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#89a8b2]">{order.title}</h3>
                                        <p className="text-[#b3c8cf]">Price: ₹{order.price}</p>
                                        <p className="text-[#89a8b2]">Status: {order.status}</p>
                                        {view === 'sell' && <p className="text-[#89a8b2]">Buyer: {order.buyerName}</p>}
                                    </div>
                                </Link>
                                {order.status==='pending' && <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        giveOTP(order.orderID,order.title);
                                    }}
                                    className="bg-[#89a8b2] text-white py-1 px-3 rounded-lg hover:bg-[#b3c8cf] transition duration-300"
                                >
                                    Generate OTP
                                </button>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default History;
