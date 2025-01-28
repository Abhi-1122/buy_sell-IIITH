import React, { useEffect } from 'react';
import axios from 'axios';

const CasHandler = () => {
    const handleCASTicket = async (ticket) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/cas`, {
                params: { ticket }
            });

            // Handle the response (e.g., redirect the user or set additional state)
            console.log('CAS Login Success:', response.data);
            document.cookie = `token=${response.data.token}; path=/;`;
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (error) {
            console.error('Error during CAS login:', error.response || error);
            alert('CAS Login Failed');
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const ticket = urlParams.get('ticket');

        if (ticket) {
            handleCASTicket(ticket);
        } else {
            console.error('No CAS ticket found in the URL');
            alert("ACCESS DENIED")
            window.location.href = '/login';
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F0E8]">
            <p className="text-center text-gray-600">Processing CAS Login...</p>
        </div>
    );
};

export default CasHandler;
