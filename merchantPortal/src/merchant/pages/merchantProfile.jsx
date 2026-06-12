import React from "react";

import { useEffect, useState } from "react";

import { useAuth } from "../AuthContext.jsx";
import { api } from "../api";

import "../styles/merchant.css";

export default function MerchantProfile() {

    const { user, merchant, setMerchant } = useAuth();

    const [form, setForm] = useState({
        storeName: "",
        description: "",
        contactEmail: "",
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");

    useEffect(() => {

        if (!merchant) {
            setLoading(false);
            return;
        }

        setForm({
            storeName:
                merchant.storeName || "",

            description:
                merchant.description || "",

            contactEmail:
                merchant.contactEmail || "",
        });

        setLoading(false);

    }, [merchant]);

    async function handleSubmit(e) {

    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {

        const res = await api.updateMerchantProfile(form);

        if (res.merchant) {
            setMerchant(res.merchant);
        }

        setSuccess(
            "Profile updated successfully."
        );

    } catch (err) {

        setError(err.message);

    } finally {

        setSaving(false);
    }
}

    if (loading) {

        return (

            <div className="page-container">

                <p className="subtext">
                    Loading profile...
                </p>

            </div>

        );
    }

    return (

        <div className="page-container">

            <h1 className="page-header">
                Merchant Profile
            </h1>

            <div className="profile-card">

                <div className="profile-row">

                    <strong>
                        Account Owner:
                    </strong>

                    {" "}

                    {user?.name}

                </div>

                <div className="profile-row">

                    <strong>
                        Login Email:
                    </strong>

                    {" "}

                    {user?.email}

                </div>

                <div className="profile-row">

                    <strong>
                        Account Status:
                    </strong>

                    {" "}

                    {merchant?.isActive === false
                        ? "Deactivated"
                        : "Active"}

                </div>

            </div>

            <div className="info-box">

                <h2 className="section-header">
                    Store Information
                </h2>

                <form
                    className="form-container"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="storeName">
                            Store Name
                        </label>

                        <input
                            id="storeName"
                            className="text-input"
                            type="text"
                            value={form.storeName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    storeName:
                                        e.target.value,
                                })
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="contactEmail">
                            Contact Email
                        </label>

                        <input
                            id="contactEmail"
                            className="text-input"
                            type="email"
                            value={form.contactEmail}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    contactEmail:
                                        e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="description">
                            Store Description
                        </label>

                        <textarea
                            id="description"
                            className="text-area"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description:
                                        e.target.value,
                                })
                            }
                        />

                    </div>

                    {error ? (

                        <div className="form-error">
                            {error}
                        </div>

                    ) : null}

                    {success ? (

                        <div className="subtext">

                            {success}

                        </div>

                    ) : null}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Changes"}

                    </button>

                </form>

            </div>

        </div>
    );
}
