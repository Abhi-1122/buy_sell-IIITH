import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        const Message = { sender: 'bot', text: "Hi! How can I help you today?" }
        setMessages((prevMessages) => [...prevMessages, Message]);
    }, []);

    const handleSendMessage = async () => {
        const givenInput = userInput;
        setUserInput('');
        const newMessage = { sender: 'user', text: givenInput };
        setMessages([...messages, newMessage]);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                {
                    contents: [{
                        parts: [{ text: givenInput }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const botMessage = { sender: 'bot', text: response.data.candidates[0].content.parts[0].text };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#ffffff] p-6">
            <div className="w-full max-w-5xl bg-[#3258d3] rounded-lg shadow-lg p-8">
                <div className="h-96 overflow-y-scroll mb-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} my-4`}
                        >
                            <div
                                className={`p-4 max-w-xl rounded-lg text-black ${message.sender === 'user' ? 'bg-red-500' :
                                        message.sender === 'bot' ? 'bg-gray-300 text-black' : 'bg-green-500 text-white'
                                    }`}
                            >
                                <span>{message.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex mt-6">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress} // Trigger message send on Enter key press
                        className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white p-4 rounded-r-lg hover:bg-blue-700"
                    >
                        Send
                    </button>
                </div>
            </div>
            <div className="w-full bg-[#ffffff] text-center p-3 mt-4 rounded-b-lg">
                <span className="text-black font-bold">Powered by Gemini AI</span>
            </div>
        </div>
    );
};

export default Chat;
