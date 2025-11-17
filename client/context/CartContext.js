// app/context/CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // cart items

  // ⭐ rename to addToCart
  const addToCart = (orderItem) => {
    setItems(prev => [...prev, orderItem]);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const clearCart = () => setItems([]);

  const updateItem = (id, newProps) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...newProps } : it));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,    // ⭐ export correct function
        removeItem,
        clearCart,
        updateItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
