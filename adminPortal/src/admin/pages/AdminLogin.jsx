import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/admin.css";

export default function AdminLogin() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("admin@cs110.test");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user && user.role === "admin") {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email.trim(), password);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-page">

            <form className="login-box" onSubmit={handleSubmit}>

                <h1 className="page-header">Admin sign in</h1>
                <p className="subtext">CS110 Marketplace operations.</p>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        className="text-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        className="text-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                {error ? <div className="form-error">{error}</div> : null}

                <button
                    type="submit"
                    className="primary-button login-submit"
                    disabled={submitting}
                >
                    {submitting ? "Signing in..." : "Sign in"}
                </button>

            </form>

        </div>
    );
}
