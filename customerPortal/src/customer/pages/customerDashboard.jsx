import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/customer.css";

export default function CustomerDashboard() {
    const { user } = useAuth();

    return (
        <div className="page-container">

            <h1 className="page-header">Customer Dashboard</h1>

            <p className="subtext">
                Welcome back, <strong>{user?.name || "Customer"}</strong>
            </p>

            <div className="dashboard-grid">

                <DashboardCard
                    title="Browse Listings"
                    description="Search and filter available compute services."
                    link="/browse"
                />

                <DashboardCard
                    title="My Orders"
                    description="View your purchase history and order status."
                    link="/orders"
                />

                <DashboardCard
                    title="Messages"
                    description="Read and send messages to merchants or support."
                    link="/messages"
                />

                <DashboardCard
                    title="Favorites"
                    description="View merchants you've saved for quick access."
                    link="/favorites"
                />

                <DashboardCard
                    title="Cart"
                    description="Review items and proceed to checkout."
                    link="/cart"
                />

            </div>

        </div>
    );
}

function DashboardCard({ title, description, link }) {
    return (
        <div className="dashboard-card">
            <h2>{title}</h2>
            <p className="subtext">{description}</p>
            <Link to={link}>
                <button className="primary-button dashboard-button">Open</button>
            </Link>
        </div>
    );
}
