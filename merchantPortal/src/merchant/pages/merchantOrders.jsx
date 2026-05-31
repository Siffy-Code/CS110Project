import React from "react";
import { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/merchant.css";

export default function MerchantOrders() {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activeTab, setActiveTab] =
        useState("open");

    const [newOrder, setNewOrder] =
    useState({
        customerName: "",
        customerEmail: "",
        priceAtPurchase: "",
        listingId: "",
        status: "pending",
    });

    const [listings, setListings] =
        useState([]);

    useEffect(() => {

        loadOrders();

    }, []);

    async function loadOrders() {

        try {

            const res =
                await api.merchantOrders();

            setOrders(
                res.orders || []
            );
            const listingsRes =
                await api.listListings();

            setListings(
                listingsRes.listings || []
            );

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);
        }
    }
    async function createManualOrder() {

        try {

            const res =
                await api.createManualOrder(
                    newOrder
                );

            setOrders((prev) => [
                res.order,
                ...prev,
            ]);

            setNewOrder({
                customerName: "",
                customerEmail: "",
                listingId: "",
                priceAtPurchase: "",
                status: "pending",
            });

        } catch (err) {

            setError(
                err.message
            );
        }
    }
    async function updateStatus(
    id,
    status
) {

    try {

        await api.updateOrderStatus(
            id,
            status
        );

        setOrders((prev) =>
            prev.map((order) => {

                if (
                    order._id !== id
                ) {
                    return order;
                }

                return {
                    ...order,
                    status,
                };
            })
        );

    } catch (err) {

        setError(
            err.message
        );
    }
}

    const filteredOrders =
        orders.filter((order) => {

            if (
                activeTab ===
                "completed"
            ) {

                return (
                    order.status ===
                    "completed"
                );
            }

            return (
                order.status !==
                "completed"
            );
        });

    if (loading) {

        return (

            <div className="page-container">

                <h1 className="page-header">
                    Orders
                </h1>

                <p className="subtext">
                    Loading...
                </p>

            </div>

        );
    }

    return (

        <div className="page-container">

            <h1 className="page-header">
                Orders
            </h1>

            <p className="subtext">

                Manage customer
                purchases and
                order fulfillment.

            </p>
            <div className="two-column-layout">
                <div className="right-panel">
            {error && (

                <div className="form-error">
                    {error}
                </div>

            )}

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom:
                        "20px",
                }}
            >

                <button
                    className={
                        activeTab ===
                        "open"
                            ? "primary-button"
                            : "secondary-button"
                    }
                    onClick={() =>
                        setActiveTab(
                            "open"
                        )
                    }
                >

                    Open Orders

                </button>

                <button
                    className={
                        activeTab ===
                        "completed"
                            ? "primary-button"
                            : "secondary-button"
                    }
                    onClick={() =>
                        setActiveTab(
                            "completed"
                        )
                    }
                >

                    Completed Orders

                </button>

            </div>

            <div className="data-list">

                {filteredOrders
                    .length ===
                0 ? (

                    <div className="info-box">

                        <p className="subtext">

                            No orders in
                            this category.

                        </p>

                    </div>

                ) : (

                    filteredOrders.map(
                        (order) => (

                            <div
                                key={
                                    order._id
                                }
                                className="data-row"
                            >

                                <div className="data-row-left">

                                    <div className="data-row-title">

                                        {
                                            order
                                                .listing
                                                ?.title
                                        }

                                    </div>

                                    <div className="data-row-subtext">

                                        Customer:
                                        {" "}
                                        {
                                            order
                                                .customer
                                                ?.name
                                        }

                                    </div>

                                    <div className="data-row-subtext">

                                        Email:
                                        {" "}
                                        {
                                            order
                                                .customer
                                                ?.email
                                        }

                                    </div>

                                    <div className="data-row-subtext">

                                        Price:
                                        {" "}
                                        $
                                        {
                                            order.priceAtPurchase
                                        }

                                    </div>

                                    <div className="data-row-subtext">

                                        Status:
                                        {" "}
                                        {
                                            order.status
                                        }

                                    </div>

                                    <div className="data-row-subtext">

                                        Date:
                                        {" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}

                                    </div>

                                </div>

                                {order.status !==
                                    "completed" ? (

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            updateStatus(
                                                order._id,
                                                "completed"
                                            )
                                        }
                                    >

                                        Mark Complete

                                    </button>

                                ) : (

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            updateStatus(
                                                order._id,
                                                "pending"
                                            )
                                        }
                                    >

                                        Reopen Order

                                    </button>

                                )}

                            </div>

                        )
                    )

                )}
            </div>
            </div>
            <div className="left-panel">
            <div className="info-box">

                <h2 className="section-header">
                    Manual Order Entry
                </h2>

                <div className="form-group">

                    <label>
                        Customer Name
                    </label>

                    <input
                        className="text-input"
                        value={
                            newOrder.customerName
                        }
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                customerName:
                                    e.target.value,
                            })
                        }
                    />

                </div>

                <div className="form-group">

                    <label>
                        Customer Email
                    </label>

                    <input
                        className="text-input"
                        value={
                            newOrder.customerEmail
                        }
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                customerEmail:
                                    e.target.value,
                            })
                        }
                    />

                </div>

                <div className="form-group">

                    <label>
                        Listing
                    </label>

                    <select
                        className="dropdown-input"
                        value={
                            newOrder.listingId
                        }
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                listingId:
                                    e.target.value,
                            })
                        }
                    >

                        <option value="">
                            Select Listing
                        </option>

                        {listings.map(
                            (listing) => (

                                <option
                                    key={
                                        listing._id
                                    }
                                    value={
                                        listing._id
                                    }
                                >

                                    {
                                        listing.title
                                    }

                                </option>

                            )
                        )}

                    </select>

                </div>
             <div className="form-group">

                <label>
                    Price
                </label>

                <input
                    className="text-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                        newOrder.priceAtPurchase
                    }
                    onChange={(e) =>
                        setNewOrder({
                            ...newOrder,
                            priceAtPurchase:
                                e.target.value,
                        })
                    }
                />

            </div>           
                <div className="form-group">

                    <label>
                        Initial Status
                    </label>

                    <select
                        className="dropdown-input"
                        value={
                            newOrder.status
                        }
                        onChange={(e) =>
                            setNewOrder({
                                ...newOrder,
                                status:
                                    e.target.value,
                            })
                        }
                    >

                        <option value="pending">
                            Pending
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                    </select>

                </div>

                <button
                    className="primary-button"
                    onClick={
                        createManualOrder
                    }
                >

                    Create Order

                </button>

            </div>
            </div>
            
           </div>     
        </div>
    );
}