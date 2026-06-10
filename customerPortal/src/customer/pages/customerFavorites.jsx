import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import "../styles/customer.css";

export default function CustomerFavorites() {
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadFavorites();
    }, []);

    async function loadFavorites() {
        try {
            const res = await api.customerFavorites();
            setFavorites(res.favorites || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleUnfavorite(merchantId) {
        try {
            await api.removeFavorite(merchantId);
            setFavorites((prev) => prev.filter((f) => f._id !== merchantId));
        } catch (err) {
            alert(err.message);
        }
    }

    if (loading) {
        return (
            <div className="page-container">
                <h1 className="page-header">Favorite Merchants</h1>
                <p className="subtext">Loading...</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <h1 className="page-header">Favorite Merchants</h1>

            {error && <div className="form-error">{error}</div>}

            {!error && favorites.length === 0 && (
                <p className="subtext">You haven't favorited any merchants yet.</p>
            )}

            <div className="data-list">
                {favorites.map((merchant) => (
                    <div key={merchant._id} className="data-row">

                        <div className="data-row-left">
                            <span className="data-row-title">
                                {merchant.storeName || "Merchant"}
                            </span>
                            <span className="data-row-subtext">
                                {merchant.description || ""}
                            </span>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="primary-button"
                                onClick={() => navigate(`/browse/merchant/${merchant._id}`)}
                            >
                                View Profile
                            </button>
                            <button
                                className="secondary-button"
                                onClick={() => handleUnfavorite(merchant._id)}
                            >
                                Unfavorite
                            </button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
