// CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cart = localStorage.getItem('cart');
        if (cart) {
            // console.log("get", cart)
            setCartItems(JSON.parse(cart));
        }
    }, []);

    useEffect(() => {
        // console.log("set", cartItems)
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const addToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    const removeFromCart = (item) => {
        setCartItems((prevItems) => prevItems.filter((prevItem) => prevItem._id !== item._id));
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
