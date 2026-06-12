import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    function addToCart(listing) {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === listing._id);
            if (existing) {
                return prev.map((item) =>
                    item.id === listing._id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    id: listing._id,
                    title: listing.title,
                    merchant: listing.merchant?.storeName || "Unknown",
                    price: listing.price || 0,
                    unit: listing.priceUnit || "",
                    qty: 1,
                },
            ];
        });
    }

    function removeFromCart(id) {
        setCart((prev) => prev.filter((item) => item.id !== id));
    }

    function updateQty(id, delta) {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, qty: item.qty + delta }
                        : item
                )
                .filter((item) => item.qty > 0)
        );
    }

    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}