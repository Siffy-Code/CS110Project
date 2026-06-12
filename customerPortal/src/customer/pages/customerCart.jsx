import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext.jsx";
import "../styles/customer.css";

export default function CustomerCart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQty } = useCart();

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <div className="page-container">

            <h1 className="page-header">Your Cart</h1>

            {cart.length === 0 && (
                <div>
                    <p className="subtext">Your cart is empty.</p>
                    <button
                        className="primary-button"
                        style={{ marginTop: "15px" }}
                        onClick={() => navigate("/browse")}
                    >
                        Browse Services
                    </button>
                </div>
            )}

            {cart.length > 0 && (
                <>
                    <div className="cart-list data-list">
                        {cart.map((item) => (
                            <div key={item.id} className="data-row cart-item">

                                <div className="data-row-left">
                                    <span style={{ fontSize: "18px" }}>{item.title}</span>
                                    <span className="subtext">{item.merchant}</span>
                                    <span className="subtext">
                                        ${item.price.toFixed(2)} {item.unit}
                                    </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <button
                                        className="secondary-button"
                                        style={{ padding: "4px 10px" }}
                                        onClick={() => updateQty(item.id, -1)}
                                    >
                                        −
                                    </button>
                                    <span>Qty: {item.qty}</span>
                                    <button
                                        className="secondary-button"
                                        style={{ padding: "4px 10px" }}
                                        onClick={() => updateQty(item.id, 1)}
                                    >
                                        +
                                    </button>
                                    <span style={{ minWidth: "60px", textAlign: "right" }}>
                                        ${(item.price * item.qty).toFixed(2)}
                                    </span>
                                    <button
                                        className="secondary-button"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="cart-total-box info-box" style={{ maxWidth: "400px", marginTop: "20px" }}>

                        <div className="cart-total-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <div className="cart-total-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <span>Fees</span>
                            <span>$0.00</span>
                        </div>

                        <hr style={{ borderColor: "#5a5a5a", margin: "12px 0" }} />

                        <div
                            className="cart-total-row"
                            style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "15px" }}
                        >
                            <span>Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>

                        <button
                            className="primary-button"
                            style={{ width: "100%" }}
                            onClick={() => alert("Payment processing is disabled for this demo.")}
                        >
                            Checkout
                        </button>

                    </div>
                </>
            )}

        </div>
    );
}