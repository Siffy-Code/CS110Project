import React from "react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api";

import "../styles/merchant.css";

export default function MerchantListingDisplay() {

    const [listings, setListings] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [kind, setKind] =
        useState("");

    useEffect(() => {

        async function load() {

            try {

                const [
                    listingsRes,
                    categoriesRes,
                ] = await Promise.all([
                    api.listListings(),
                    api.listCategories(),
                ]);

                setListings(
                    listingsRes.listings || []
                );

                setCategories(
                    categoriesRes.categories || []
                );

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);
            }
        }

        load();

    }, []);

    const filteredListings =
        listings.filter((listing) => {

            const matchesSearch =
                listing.title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesCategory =
                !category ||
                listing.category?._id ===
                    category;

            const matchesKind =
                !kind ||
                listing.kind === kind;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesKind
            );
        });

    if (loading) {

        return (

            <div className="page-container">

                <p className="subtext">
                    Loading listings...
                </p>

            </div>

        );
    }

    return (

        <div className="page-container">

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    gap: "15px",
                }}
            >

                <div>

                    <h1 className="page-header">
                        My Listings
                    </h1>

                    <p className="subtext">

                        View and manage all
                        marketplace listings.

                    </p>

                </div>

                <Link
                    to="/editservices"
                    className="primary-button"
                >

                    Edit Listings

                </Link>

            </div>

            {error ? (

                <div className="form-error">
                    {error}
                </div>

            ) : null}

            <div
                className="info-box"
                style={{
                    marginBottom: "25px",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                    }}
                >

                    <input
                        className="text-input"
                        placeholder="Search listings..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        style={{
                            minWidth: "250px",
                        }}
                    />

                    <select
                        className="dropdown-input"
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Categories
                        </option>

                        {categories.map((cat) => (

                            <option
                                key={cat._id}
                                value={cat._id}
                            >

                                {cat.name}

                            </option>

                        ))}

                    </select>

                    <select
                        className="dropdown-input"
                        value={kind}
                        onChange={(e) =>
                            setKind(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Types
                        </option>

                        <option value="service">
                            Services
                        </option>

                        <option value="product">
                            Products
                        </option>

                    </select>

                </div>

            </div>

            {filteredListings.length === 0 ? (

                <div className="info-box">

                    <p className="subtext">
                        No listings match your filters.
                    </p>

                </div>

            ) : (

                <div className="listings-grid">

                    {filteredListings.map((listing) => (

                        <div
                            key={listing._id}
                            className="listing-card"
                        >

                            <img
                                src={
                                    listing.imageUrl ||
                                    "https://placehold.co/400x250?text=Listing"
                                }
                                alt={listing.title}
                                className="listing-image"
                            />

                            <div className="listing-content">

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        marginBottom:
                                            "10px",
                                    }}
                                >

                                    <div
                                        className="listing-title"
                                    >

                                        {listing.title}

                                    </div>

                                    <div
                                        className="service-tag"
                                    >

                                        {listing.kind}

                                    </div>

                                </div>

                                <div
                                    className="listing-description"
                                >

                                    {listing.description}

                                </div>

                                <div
                                    style={{
                                        marginBottom:
                                            "15px",
                                    }}
                                >

                                    <strong>
                                        $
                                        {listing.price}
                                    </strong>

                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        flexWrap:
                                            "wrap",
                                        marginBottom:
                                            "15px",
                                    }}
                                >

                                    {listing.category ? (

                                        <span
                                            className="service-tag"
                                        >

                                            {
                                                listing
                                                    .category
                                                    .name
                                            }

                                        </span>

                                    ) : null}

                                    <span
                                        className="service-tag"
                                    >

                                        {listing.isActive
                                            ? "Active"
                                            : "Hidden"}

                                    </span>

                                </div>

                                {!listing.isActive &&
                                listing.deactivatedReason ? (

                                    <div
                                        className="subtext"
                                        style={{
                                            marginBottom:
                                                "15px",
                                            color:
                                                "#ffaaaa",
                                        }}
                                    >

                                        Admin Reason:

                                        {" "}

                                        {
                                            listing.deactivatedReason
                                        }

                                    </div>

                                ) : null}

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                    }}
                                >

                                    <Link
                                        to="/edit-services"
                                        className="primary-button"
                                    >

                                        Edit

                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}