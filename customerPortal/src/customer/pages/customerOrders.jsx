import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import "../styles/customer.css";

export default function CustomerOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const res = await api.customerOrders();
            setOrders(res.orders || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="page-container">
                <h1 className="page-header">My Orders</h1>
                <p className="subtext">Loading...</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <h1 className="page-header">My Orders</h1>

            {error && <div className="form-error">{error}</div>}

            {!error && orders.length === 0 && (
                <p className="subtext">No orders yet.</p>
            )}

            <div className="data-list">
                {orders.map((order) => (
                    <div key={order._id} className="data-row">

                        <div className="data-row-left">
                            <span className="data-row-title">
                                {order.listing?.title || "Order"}
                            </span>
                            <span className="data-row-subtext">
                                {order.merchant?.storeName || "—"} ·{" "}
                                {order.createdAt ? order.createdAt.slice(0, 10) : "—"}
                            </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <span>${(order.priceAtPurchase || 0).toFixed(2)}</span>
                            <span className="status-tag">{order.status}</span>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
