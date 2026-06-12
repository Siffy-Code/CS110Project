import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "../styles/customer.css";

export default function CustomerRegister() {
    const { user, register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user && user.role === "customer") {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            await register(name.trim(), email.trim(), password);
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

                <h1 className="page-header">Create Account</h1>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        className="text-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        className="text-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
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
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm">Confirm Password</label>
                    <input
                        id="confirm"
                        className="text-input"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                    />
                </div>

                {error && <div className="form-error">{error}</div>}

                <button
                    type="submit"
                    className="primary-button login-submit"
                    disabled={submitting}
                >
                    {submitting ? "Creating account..." : "Register"}
                </button>

                <div className="subtext" style={{ marginTop: "20px" }}>
                    Already have an account?{" "}
                    <Link to="/login">Log in here</Link>
                </div>

            </form>
        </div>
    );
}
