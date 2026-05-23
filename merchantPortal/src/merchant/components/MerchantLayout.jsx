import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/merchant.css";

export default function MerchantLayout() {
    const { user, merchant, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div className="admin-shell">

            <aside className="admin-sidebar">

                <div className="admin-brand">
                    <div className="admin-brand-title">
                        Merchant Portal
                    </div>

                    <div className="admin-brand-sub">
                        {merchant?.storeName || "Marketplace Merchant"}
                    </div>
                </div>

                <nav className="admin-nav">

                    <NavLink
                        to="/"
                        end
                        className="admin-nav-link"
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/listings"
                        className="admin-nav-link"
                    >
                        Listings
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className="admin-nav-link"
                    >
                        Orders
                    </NavLink>

                    <NavLink
                        to="/finances"
                        className="admin-nav-link"
                    >
                        Finances
                    </NavLink>

                    <NavLink
                        to="/messages"
                        className="admin-nav-link"
                    >
                        Messages
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className="admin-nav-link"
                    >
                        Profile
                    </NavLink>

                </nav>

                <div className="admin-user-card">

                    <div className="admin-user-name">
                        {user?.name}
                    </div>

                    <div className="admin-user-email">
                        {user?.email}
                    </div>

                    <button
                        className="secondary-button admin-logout-btn"
                        onClick={handleLogout}
                    >
                        Sign out
                    </button>

                </div>

            </aside>

            <main className="admin-main">
                <Outlet />
            </main>

        </div>
    );
}