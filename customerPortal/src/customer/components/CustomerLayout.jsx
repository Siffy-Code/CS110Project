import React from "react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/customer.css";

export default function CustomerLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div className="admin-shell">

            <aside className="admin-sidebar">

                <div className="admin-brand">
                    <NavLink
                        to="/"
                        className="primary-button"
                        style={{
                            display: "block",
                            marginTop: "10px",
                            textAlign: "center",
                            textDecoration: "none",
                        }}
                    >
                        Customer Portal
                    </NavLink>
                </div>

                <nav className="admin-nav">

                    <NavLink to="/" end className="admin-nav-link">
                        Dashboard
                    </NavLink>

                    <NavLink to="/browse" className="admin-nav-link">
                        Browse
                    </NavLink>

                    <NavLink to="/orders" className="admin-nav-link">
                        My Orders
                    </NavLink>

                    <NavLink to="/messages" className="admin-nav-link">
                        Messages
                    </NavLink>

                    <NavLink to="/favorites" className="admin-nav-link">
                        Favorites
                    </NavLink>

                    <NavLink to="/cart" className="admin-nav-link">
                        Cart
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
