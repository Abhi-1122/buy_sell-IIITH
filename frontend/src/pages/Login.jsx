import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
        try {
            console.log('Form data:', formData);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, formData);
            console.log(response);
            document.cookie = `token=${response.data.token}; path=/;`;
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (error) {
            console.error('There was an error signing up:', error.response);
            alert('Invalid email or password');
        }
    };

    const handleCASLogin = () => {
        const serviceURL = `${import.meta.env.VITE_FRONTEND_URL}/auth/cas`;
        window.location.href = `https://login.iiit.ac.in/cas/login?service=${encodeURIComponent(serviceURL)}`;
    };

    return (
        <div className="min-h-screen bg-[#F1F0E8] flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
                <h2 className="text-2xl font-bold text-[#89A8B2] mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-[#B3C8CF]">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E5E1DA] bg-[#F1F0E8]"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-[#B3C8CF]">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E5E1DA] bg-[#F1F0E8]"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#89A8B2] text-white py-2 rounded-md hover:bg-[#B3C8CF] transition"
                    >
                        Login
                    </button>
                </form>
                <div className="my-4 text-center relative">
                    <div className="absolute left-0 right-0 h-[1px] bg-[#E5E1DA] top-1/2 transform -translate-y-1/2"></div>
                    <span className="bg-white px-2 text-sm text-[#B3C8CF]">OR</span>
                </div>
                <button
                    onClick={handleCASLogin}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Login using CAS
                </button>
                <p className="mt-4 text-center text-sm text-[#B3C8CF]">
                    New User?{' '}
                    <a href="/signup" className="text-[#405e68] hover:underline">
                        Signup
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;