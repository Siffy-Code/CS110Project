import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import "../styles/customer.css";

export default function CustomerListingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadListing();
    }, [id]);

    async function loadListing() {
        setLoading(true);
        try {
            // Fetch all listings then find by id (public endpoint doesn't have single-listing route)
            const res = await api.publicListings();
            const found = (res.listings || []).find((l) => l._id === id);
            if (!found) throw new Error("Listing not found.");
            setListing(found);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="page-container"><p className="subtext">Loading...</p></div>;
    if (error) return <div className="page-container"><p className="form-error">{error}</p></div>;
    if (!listing) return null;

    return (
        <div className="page-container">

            <button
                className="secondary-button back-button"
                onClick={() => navigate("/browse")}
            >
                ← Back to Browse
            </button>

            <div className="listing-image" style={{ maxWidth: "600px", height: "240px" }}>
                No Image
            </div>

            <div style={{ maxWidth: "600px", marginTop: "20px" }}>

                <h1 className="page-header">{listing.title}</h1>

                <div className="info-box">
                    <div className="profile-row">
                        <span className="listing-price">
                            ${listing.price?.toFixed(2)} {listing.priceUnit || ""}
                        </span>
                    </div>
                    <div className="profile-row subtext">
                        Category: {listing.category?.name || "—"}
                    </div>
                    {listing.description && (
                        <div className="profile-row">
                            {listing.description}
                        </div>
                    )}
                </div>

                <div className="info-box">
                    <h2 className="section-header">Merchant</h2>
                    <p>{listing.merchant?.storeName || "Unknown"}</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate(`/browse/merchant/${listing.merchant?._id}`)
                            }
                        >
                            View Profile
                        </button>
                        <button
                            className="secondary-button"
                            onClick={() => alert("Payment processing is disabled for this demo.")}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}
