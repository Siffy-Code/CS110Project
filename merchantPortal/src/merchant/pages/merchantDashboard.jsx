import { Link } from "react-router-dom";

import { useAuth } from "../AuthContext.jsx";

import "../styles/merchant.css";

export default function MerchantDashboard() {

    const { user, merchant } = useAuth();

    return (

        <div className="page-container">

            <h1 className="page-header">
                Merchant Dashboard
            </h1>

            <p className="subtext">

                Welcome back,

                {" "}

                <strong>
                    {user?.name || "Merchant"}
                </strong>

                {merchant?.storeName
                    ? ` • ${merchant.storeName}`
                    : ""}

            </p>

            <div className="dashboard-grid">

                <DashboardCard
                    title="Listings"
                    description="
                    Create, edit, and manage your marketplace listings.
                    "
                    button="Open"
                    link="/listings"
                />

                <DashboardCard
                    title="Orders"
                    description="
                    View customer purchases and order status.
                    "
                    button="Open"
                    link="/orders"
                />

                <DashboardCard
                    title="Finances"
                    description="
                    Review earnings, payouts, and transaction history.
                    "
                    button="Open"
                    link="/finances"
                />

                <DashboardCard
                    title="Messages"
                    description="
                    Read and respond to marketplace messages.
                    "
                    button="Open"
                    link="/messages"
                />

                <DashboardCard
                    title="Profile"
                    description="
                    Update your merchant information and branding.
                    "
                    button="Open"
                    link="/profile"
                />

            </div>

        </div>
    );
}

function DashboardCard({
    title,
    description,
    button,
    link,
}) {

    return (

        <div className="dashboard-card">

            <h2>
                {title}
            </h2>

            <p className="subtext">

                {description}

            </p>

            <Link to={link}>

                <button className="primary-button dashboard-button">

                    {button}

                </button>

            </Link>

        </div>

    );
}