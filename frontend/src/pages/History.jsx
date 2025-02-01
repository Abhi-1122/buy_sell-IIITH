import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const History = () => {
    const [view, setView] = useState('buy'); // Main View (Buy/Sell)
    const [buyView, setBuyView] = useState('pending'); // Buy View (Pending/Closed)
    const [buyOrders, setBuyOrders] = useState([]);
    const [sellOrders, setSellOrders] = useState([]);

    useEffect(() => {
        const fetchSellOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/closed`, { withCredentials: true });
                console.log("Sell Orders:", response.data);
                setSellOrders(response.data);
            } catch (error) {
                console.error('Error fetching sell orders:', error);
            }
        };

        const fetchBuyOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/buy`, { withCredentials: true });
                console.log("Buy Orders:", response.data);
                setBuyOrders(response.data);
            } catch (error) {
                console.error('Error fetching buy orders:', error);
            }
        };

        fetchSellOrders();
        fetchBuyOrders();
    }, []);

    async function giveOTP(orderId, title) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/otp`, { orderId }, { withCredentials: true });
            console.log(response);
            alert(`OTP to buy ${title}: ${response.data.otp}`);
        } catch (error) {
            console.error('Error generating OTP:', error);
            alert('Failed to generate OTP');
        }
    }

    const filteredBuyOrders = buyOrders.filter(order => order.status === buyView);

    return (
        <div className="min-h-screen bg-[#f1f0e8] flex flex-col items-center py-10 pt-24">
            <div className="w-full max-w-4xl px-4">
                <div className="flex justify-center space-x-6 mb-6">
                    <button
                        onClick={() => setView('buy')}
                        className={`py-2 px-6 rounded-lg transition duration-300 ${
                            view === 'buy' ? 'bg-[#89a8b2] text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                    >
                        Buy Orders
                    </button>
                    <button
                        onClick={() => setView('sell')}
                        className={`py-2 px-6 rounded-lg transition duration-300 ${
                            view === 'sell' ? 'bg-[#89a8b2] text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                    >
                        Sell Orders
                    </button>
                </div>
                
                {view === 'buy' && (
                    <div className="flex justify-center space-x-6 mb-4">
                        <button
                            onClick={() => setBuyView('pending')}
                            className={`py-2 px-6 rounded-lg transition duration-300 ${
                                buyView === 'pending' ? 'bg-[#89a8b2] text-white' : 'bg-gray-300 text-gray-700'
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setBuyView('closed')}
                            className={`py-2 px-6 rounded-lg transition duration-300 ${
                                buyView === 'closed' ? 'bg-[#89a8b2] text-white' : 'bg-gray-300 text-gray-700'
                            }`}
                        >
                            Closed
                        </button>
                    </div>
                )}

                <div>
                    <h2 className="text-3xl font-bold text-[#b3c8cf] mb-4">
                        {view === 'buy' ? (buyView === 'pending' ? 'Pending Buy Orders' : 'Closed Buy Orders') : 'Sell Orders'}
                    </h2>
                    <ul className="space-y-4">
                        {(view === 'buy' ? filteredBuyOrders : sellOrders).map((order) => (
                            <li className="flex justify-between items-center bg-[#e5e1da] p-4 rounded-lg shadow-md" key={order._id}>
                                <Link to={`/item/${order._id}`} className="flex-1">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#89a8b2]">{order.title}</h3>
                                        <p className="text-[#b3c8cf]">Price: ₹{order.price}</p>
                                        <p className="text-[#89a8b2]">Status: {order.status}</p>
                                        {view === 'sell' && <p className="text-[#89a8b2]">Buyer: {order.buyerName}</p>}
                                    </div>
                                </Link>
                                {order.status === 'pending' && view === 'buy' && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            giveOTP(order.orderID, order.title);
                                        }}
                                        className="bg-[#89a8b2] text-white py-1 px-3 rounded-lg hover:bg-[#b3c8cf] transition duration-300"
                                    >
                                        Generate OTP
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default History;
