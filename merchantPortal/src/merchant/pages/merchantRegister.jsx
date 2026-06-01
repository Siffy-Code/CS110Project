import React from "react";

import {
    useState,
} from "react";

import {
    useNavigate,
    Link,
} from "react-router-dom";

import { api }
from "../api";

import {
    useAuth,
} from "../AuthContext.jsx";

import "../styles/merchant.css";

export default function MerchantRegister() {

    const navigate =
        useNavigate();

    const { login } =
        useAuth();

    const [
        form,
        setForm,
    ] = useState({

        name: "",
        email: "",
        password: "",
    });

    const [
        error,
        setError,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            const res =
                await api.register(

                    form.name,

                    form.email,

                    form.password
                );

            login(
                res.token,
                res.user
            );

            navigate("/");

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);
        }
    }

    return (

        <div className="auth-page">

            <form
                className="auth-card"
                onSubmit={
                    handleSubmit
                }
            >

                <h1 className="page-header">
                    Merchant Registration
                </h1>

                <p className="subtext">

                    Create a merchant
                    account to manage
                    listings and orders.

                </p>

                {error && (

                    <div className="form-error">
                        {error}
                    </div>

                )}

                <div className="form-group">

                    <label>
                        Name
                    </label>

                    <input
                        className="text-input"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name:
                                    e.target.value,
                            })
                        }
                    />

                </div>

                <div className="form-group">

                    <label>
                        Email
                    </label>

                    <input
                        className="text-input"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email:
                                    e.target.value,
                            })
                        }
                    />

                </div>

                <div className="form-group">

                    <label>
                        Password
                    </label>

                    <input
                        className="text-input"
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password:
                                    e.target.value,
                            })
                        }
                    />

                </div>

                <button
                    className="primary-button"
                    disabled={loading}
                    type="submit"
                >

                    {
                        loading
                            ? "Creating..."
                            : "Create Merchant Account"
                    }

                </button>

                <div
                    className="subtext"
                    style={{
                        marginTop:
                            "20px",
                    }}
                >

                    Already have an account?

                    {" "}

                    <Link to="/login">

                        Sign In

                    </Link>

                </div>

            </form>

        </div>
    );
}