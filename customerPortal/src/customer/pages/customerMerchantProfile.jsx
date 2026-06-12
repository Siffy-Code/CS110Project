import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useCart } from "../CartContext.jsx";
import "../styles/customer.css";

export default function CustomerMerchantProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [listings, setListings] = useState([]);
    const [merchantName, setMerchantName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewRating, setReviewRating] = useState("5");
    const [reviewComment, setReviewComment] = useState("");

    // Favorite state
    const [favorited, setFavorited] = useState(false);
    const [favLoading, setFavLoading] = useState(false);

    // Message form state
    const [showMessageForm, setShowMessageForm] = useState(false);
    const [msgSubject, setMsgSubject] = useState("");
    const [msgContent, setMsgContent] = useState("");
    const [msgSending, setMsgSending] = useState(false);
    const [msgError, setMsgError] = useState("");

    // Cart added feedback
    const [added, setAdded] = useState({});

    useEffect(() => {
        loadMerchantListings();
        loadFavoriteStatus();
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

    async function loadFavoriteStatus() {
        try {
            const res = await api.customerFavorites();
            const favs = res.favorites || [];
            setFavorited(favs.some((f) => f._id === id));
        } catch {
            // silently ignore
        }
    }

    async function handleToggleFavorite() {
        setFavLoading(true);
        try {
            if (favorited) {
                await api.removeFavorite(id);
                setFavorited(false);
            } else {
                await api.addFavorite(id);
                setFavorited(true);
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setFavLoading(false);
        }
    }

    async function handleSendMessage(e) {
        e.preventDefault();
        if (!msgSubject.trim() || !msgContent.trim()) return;
        setMsgSending(true);
        setMsgError("");
        try {
            const res = await api.createConversation({
                merchantId: id,
                subject: msgSubject.trim(),
                content: msgContent.trim(),
            });
            setShowMessageForm(false);
            setMsgSubject("");
            setMsgContent("");
            navigate(`/messages/${res.conversation._id}`);
        } catch (err) {
            setMsgError(err.message);
        } finally {
            setMsgSending(false);
        }
    }

    function handleAddToCart(listing) {
        addToCart(listing);
        setAdded((prev) => ({ ...prev, [listing._id]: true }));
        setTimeout(() => {
            setAdded((prev) => ({ ...prev, [listing._id]: false }));
        }, 1500);
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
                        onClick={() => setShowMessageForm((prev) => !prev)}
                        style={{ width: "100%", marginBottom: "10px" }}
                    >
                        {showMessageForm ? "Cancel" : "Message Merchant"}
                    </button>

                    <button
                        className={favorited ? "primary-button" : "secondary-button"}
                        onClick={handleToggleFavorite}
                        disabled={favLoading}
                        style={{ width: "100%" }}
                    >
                        {favorited ? "★ Favorited" : "☆ Add to Favorites"}
                    </button>

                    {showMessageForm && (
                        <div className="info-box" style={{ marginTop: "15px" }}>
                            <h2 className="section-header">New Message</h2>
                            {msgError && <p className="form-error">{msgError}</p>}
                            <form onSubmit={handleSendMessage}>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input
                                        className="text-input"
                                        type="text"
                                        placeholder="What's this about?"
                                        value={msgSubject}
                                        onChange={(e) => setMsgSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea
                                        className="text-area"
                                        placeholder="Write your message..."
                                        value={msgContent}
                                        onChange={(e) => setMsgContent(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={msgSending}
                                    style={{ width: "100%" }}
                                >
                                    {msgSending ? "Sending..." : "Send"}
                                </button>
                            </form>
                        </div>
                    )}

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
                                            className={added[listing._id] ? "primary-button" : "secondary-button"}
                                            onClick={() => handleAddToCart(listing)}
                                        >
                                            {added[listing._id] ? "Added!" : "Add to Cart"}
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