import React from "react";

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
                    <NavLink
                        to="/"
                        className="admin-brand-title"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            cursor: "pointer",
                        }}
                    >
                    </NavLink>
                    <NavLink
                        to="/"
                        className="primary-button"
                        style={{
                            display: "block",
                            marginTop: "10px",
                            textAlign: "center",
                        }}
                    >
                        Merchant Portal Dashboard
                    </NavLink>    
                    <div className="admin-brand-sub">
                        {"Store Title: "+merchant?.storeName || "Marketplace Merchant"}
                    </div>
                </div>
                <a
                    href="http://localhost:5174"
                    className="admin-nav-link"
                >

                    Customer View

                </a>
               
                <div className="admin-user-card">

                    <div className="admin-user-name">
                        {"User Name: "+user?.name}
                    </div>

                    <div className="admin-user-email">
                        {"Registered Email: "+user?.email}
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