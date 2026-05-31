import React from "react";
import { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/merchant.css";

export default function MerchantFinances() {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadData();

    }, []);

    async function loadData() {

        try {

            const res =
                await api.merchantOrders();

            setOrders(
                res.orders || []
            );

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);
        }
    }

    const totalEarnings =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(
                    order.priceAtPurchase || 0
                ),
            0
        );

    if (loading) {

        return (

            <div className="page-container">

                <h1 className="page-header">
                    Finances
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
                Finances
            </h1>

            <p className="subtext">

                View transaction
                history and
                earnings.

            </p>

            {error && (

                <div className="form-error">
                    {error}
                </div>

            )}

            <div className="dashboard-grid">

                <div className="dashboard-card">

                    <h2>
                        Current Balance
                    </h2>

                    <h1>
                        $0.00
                    </h1>

                </div>

                <div className="dashboard-card">

                    <h2>
                        Total Earnings
                    </h2>

                    <h1>

                        $
                        {totalEarnings.toFixed(
                            2
                        )}

                    </h1>

                </div>

            </div>

            <h2
                className="section-header"
                style={{
                    marginTop: "30px",
                }}
            >
                Transaction History
            </h2>

            <div className="data-list">

                {orders.map(
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

                                    Status:
                                    {" "}
                                    {
                                        order.status
                                    }

                                </div>

                                <div className="data-row-subtext">

                                    {new Date(
                                        order.createdAt
                                    ).toLocaleString()}

                                </div>

                            </div>

                            <div
                                style={{
                                    fontSize:
                                        "22px",
                                    fontWeight:
                                        "bold",
                                }}
                            >

                                $
                                {
                                    Number(
                                        order.priceAtPurchase
                                    ).toFixed(
                                        2
                                    )
                                }

                            </div>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}