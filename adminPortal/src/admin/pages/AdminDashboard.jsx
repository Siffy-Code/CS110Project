import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .stats()
            .then(setStats)
            .catch((err) => setError(err.message));
    }, []);

    return (
        <div className="page-container">

            <h1 className="page-header">Admin Dashboard</h1>

            {error ? <div className="form-error">{error}</div> : null}

            {!stats ? (
                <p className="subtext">Loading stats...</p>
            ) : (
                <div className="dashboard-grid">

                    <StatCard label="Users" value={stats.users} link="/users" />
                    <StatCard
                        label="Merchants"
                        value={stats.merchants}
                        link="/merchants"
                    />
                    <StatCard
                        label="Active listings"
                        value={stats.activeListings}
                        link="/listings"
                    />
                    <StatCard
                        label="Inactive listings"
                        value={stats.inactiveListings}
                        link="/listings"
                    />
                    <StatCard
                        label="Categories"
                        value={stats.categories}
                        link="/categories"
                    />
                    <StatCard label="Orders" value={stats.orders} />

                </div>
            )}

        </div>
    );
}

function StatCard({ label, value, link }) {
    const inner = (
        <>
            <div className="stat-value">{value}</div>
            <h2>{label}</h2>
        </>
    );

    if (link) {
        return (
            <Link to={link} className="dashboard-card stat-card">
                {inner}
            </Link>
        );
    }

    return <div className="dashboard-card stat-card">{inner}</div>;
}
