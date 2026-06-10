import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import "../styles/customer.css";

export default function CustomerMerchantProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [merchantName, setMerchantName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewRating, setReviewRating] = useState("5");
    const [reviewComment, setReviewComment] = useState("");

    useEffect(() => {
        loadMerchantListings();
    }, [id]);

    async function loadMerchantListings() {
        setLoading(true);
        try {
            const res = await api.publicListings({ merchant: id });
            const items = res.listings || [];
            setListings(items);
            if (items.length > 0) {
                setMerchantName(items[0].merchant?.storeName || "Merchant");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleMessageMerchant() {
        navigate("/messages");
    }

    function handleSubmitReview(e) {
        e.preventDefault();
        alert("Reviews are not yet connected to the backend.");
        setReviewComment("");
    }

    if (loading) return <div className="page-container"><p className="subtext">Loading...</p></div>;

    return (
        <div className="page-container">

            <button
                className="secondary-button back-button"
                onClick={() => navigate("/browse")}
            >
                ← Back to Browse
            </button>

            <div className="merchant-banner">
                🏪 {merchantName || "Merchant Profile"}
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="two-column-layout">

                <div className="left-panel">

                    <div className="merchant-info-card info-box">
                        <h2 className="section-header">About</h2>
                        <p className="subtext">
                            Compute and processing services offered on the marketplace.
                        </p>
                    </div>

                    <div className="merchant-info-card info-box">
                        <h2 className="section-header">Rating</h2>
                        <div className="rating-row">
                            <span className="stars-placeholder">★★★★☆</span>
                            <span className="subtext">—</span>
                        </div>
                        <p className="subtext">Reviews not yet connected.</p>
                    </div>

                    <button
                        className="primary-button"
                        onClick={handleMessageMerchant}
                        style={{ width: "100%" }}
                    >
                        Message Merchant
                    </button>

                </div>

                <div className="right-panel">

                    <h2 className="section-header">Listings</h2>

                    {listings.length === 0 && (
                        <p className="subtext">No active listings.</p>
                    )}

                    <div className="listings-grid" style={{ marginBottom: "30px" }}>
                        {listings.map((listing) => (
                            <div key={listing._id} className="listing-card">

                                <div className="listing-image">No Image</div>

                                <div className="listing-content">
                                    <div className="listing-title">{listing.title}</div>
                                    <div className="listing-price">
                                        ${listing.price?.toFixed(2)} {listing.priceUnit || ""}
                                    </div>
                                    <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                                        <button
                                            className="primary-button"
                                            onClick={() =>
                                                navigate(`/browse/listing/${listing._id}`)
                                            }
                                        >
                                            View
                                        </button>
                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                alert("Payment processing is disabled for this demo.")
                                            }
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    <h2 className="section-header">Leave a Review</h2>

                    <form className="form-container" onSubmit={handleSubmitReview}>
                        <div className="form-group">
                            <label>Rating</label>
                            <select
                                className="dropdown-input"
                                value={reviewRating}
                                onChange={(e) => setReviewRating(e.target.value)}
                            >
                                <option value="5">★★★★★ — 5</option>
                                <option value="4">★★★★☆ — 4</option>
                                <option value="3">★★★☆☆ — 3</option>
                                <option value="2">★★☆☆☆ — 2</option>
                                <option value="1">★☆☆☆☆ — 1</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Comment</label>
                            <textarea
                                className="text-area"
                                placeholder="Share your experience..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="primary-button">
                            Submit Review
                        </button>
                    </form>

                </div>

            </div>

        </div>
    );
}
