import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import "../styles/customer.css";

export default function CustomerBrowse() {
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [listRes, catRes] = await Promise.all([
                api.publicListings(),
                api.publicCategories(),
            ]);
            setListings(listRes.listings || []);
            setCategories(catRes.categories || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function filterByCategory(slug) {
        setSelectedCategory(slug);
        setLoading(true);
        try {
            const res = await api.publicListings(slug ? { category: slug } : {});
            setListings(res.listings || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filtered = searchText
        ? listings.filter(
              (l) =>
                  l.title.toLowerCase().includes(searchText.toLowerCase()) ||
                  (l.merchant?.storeName || "")
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
          )
        : listings;

    return (
        <div className="page-container">

            <h1 className="page-header">Browse Services</h1>

            <div className="search-bar-row">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search services..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className="filter-row">
                <button
                    className={
                        selectedCategory === ""
                            ? "primary-button"
                            : "secondary-button"
                    }
                    onClick={() => filterByCategory("")}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        className={
                            selectedCategory === cat.slug
                                ? "primary-button"
                                : "secondary-button"
                        }
                        onClick={() => filterByCategory(cat.slug)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {loading && <p className="subtext">Loading listings...</p>}
            {error && <p className="form-error">{error}</p>}

            {!loading && filtered.length === 0 && (
                <p className="subtext">No listings found.</p>
            )}

            <div className="listings-grid">
                {filtered.map((listing) => (
                    <div key={listing._id} className="listing-card">

                        <div className="listing-image">No Image</div>

                        <div className="listing-content">
                            <div className="listing-title">{listing.title}</div>
                            <div className="listing-price">
                                ${listing.price?.toFixed(2)}{" "}
                                {listing.priceUnit || ""}
                            </div>
                            <div className="listing-merchant">
                                {listing.merchant?.storeName || "Unknown Merchant"}
                            </div>
                            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
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
                                        navigate(
                                            `/browse/merchant/${listing.merchant?._id}`
                                        )
                                    }
                                >
                                    Merchant
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
