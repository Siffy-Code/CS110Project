import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/admin.css";

export default function AdminLayout() {
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
                    <div className="admin-brand-title">CS110 Admin</div>
                    <div className="admin-brand-sub">Marketplace ops</div>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/" end className="admin-nav-link">
                        Dashboard
                    </NavLink>
                    <NavLink to="/users" className="admin-nav-link">
                        Users
                    </NavLink>
                    <NavLink to="/merchants" className="admin-nav-link">
                        Merchants
                    </NavLink>
                    <NavLink to="/listings" className="admin-nav-link">
                        Listings
                    </NavLink>
                    <NavLink to="/categories" className="admin-nav-link">
                        Categories
                    </NavLink>
                    <NavLink to="/logs" className="admin-nav-link">
                        Audit log
                    </NavLink>
                </nav>

                <div className="admin-user-card">
                    <div className="admin-user-name">{user?.name}</div>
                    <div className="admin-user-email">{user?.email}</div>
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
