import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        location: '',
        password: '',
        captcha:'',
    });

    const handleCaptcha = (token) => {
        console.log('reCAPTCHA Token:', token);
        setFormData({
            ...formData,
            captcha: token
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[a-zA-Z0-9._%+-@]+iiit\.ac\.in$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid IIIT email address.');
            return;
        }
        if (!formData.captcha) {
            alert('Please complete the CAPTCHA');
            return;
        }

        console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
        try {
            // console.log('Form data:', formData);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`,formData);
            console.log(response.data);
            window.location.href = '/login';
        } catch (error) {
            console.error('There was an error signing up:', error);
            alert(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F0E8] flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
                <h2 className="text-2xl font-bold text-[#89A8B2] mb-4 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstname" className="block text-sm font-medium text-[#B3C8CF]">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E5E1DA] bg-[#F1F0E8]"
                            placeholder="Enter your first name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastname" className="block text-sm font-medium text-[#B3C8CF]">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E5E1DA] bg-[#F1F0E8]"
                            placeholder="Enter your last name"
                            required
                        />
                    </div>
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
                        <label htmlFor="contact" className="block text-sm font-medium text-[#B3C8CF]">
                            Contact Number
                        </label>
                        <input
                            type="number"
                            id="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E5E1DA] bg-[#F1F0E8]"
                            placeholder="Enter your contact number"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-medium text-[#B3C8CF]">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E5E1DA] bg-[#F1F0E8]"
                            placeholder="Enter your hostel location"
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
                    <div className="mb-4">
                        <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-[#89A8B2] text-white py-2 rounded-md hover:bg-[#B3C8CF] transition"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-[#B3C8CF]">
                    Already a user?{' '}
                    <a href="/login" className="text-[#405e68] hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
