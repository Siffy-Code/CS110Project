import { useEffect, useState } from "react";

import { api } from "../api";

import "../styles/merchant.css";

export default function MerchantEditServices() {

    const [listings, setListings] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [savingId, setSavingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
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

    function updateListingField(
        id,
        field,
        value
    ) {

        setListings((prev) =>
            prev.map((listing) => {

                if (listing._id !== id) {
                    return listing;
                }

                return {
                    ...listing,
                    [field]: value,
                };
            })
        );
    }

    async function saveListing(listing) {

        setSavingId(listing._id);

        setError("");
        setSuccess("");

        try {

            await api.updateListing(
                listing._id,
                {
                    title:
                        listing.title,

                    description:
                        listing.description,

                    price:
                        listing.price,

                    category:
                        listing.category?._id ||
                        listing.category ||
                        "",

                    kind:
                        listing.kind,

                    imageUrl:
                        listing.imageUrl,

                    isActive:
                        listing.isActive,
                }
            );

            setSuccess(
                `"${listing.title}" updated successfully.`
            );

        } catch (err) {

            setError(err.message);

        } finally {

            setSavingId(null);
        }
    }

    async function deleteListing(id) {

        const confirmed =
            window.confirm(
                "Delete this listing?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.deleteListing(id);

            setListings((prev) =>
                prev.filter(
                    (listing) =>
                        listing._id !== id
                )
            );

        } catch (err) {

            setError(err.message);
        }
    }

    if (loading) {

        return (

            <div className="page-container">

                <p className="subtext">
                    Loading services...
                </p>

            </div>

        );
    }

    return (

        <div className="page-container">

            <h1 className="page-header">
                Edit Services
            </h1>

            <p className="subtext">

                Manage your listings,
                pricing,
                categories,
                and visibility.

            </p>

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

            <div className="service-option-list">

                {listings.length === 0 ? (

                    <div className="info-box">

                        <p className="subtext">
                            No listings found.
                        </p>

                    </div>

                ) : (

                    listings.map((listing) => (

                        <div
                            key={listing._id}
                            className="service-option-card"
                        >

                            <img
                                src={
                                    listing.imageUrl ||
                                    "https://placehold.co/300x200?text=Listing"
                                }
                                alt={listing.title}
                                className="service-option-image"
                            />

                            <div className="service-option-content">

                                <div className="form-group">

                                    <label>
                                        Title
                                    </label>

                                    <input
                                        className="text-input"
                                        value={listing.title}
                                        onChange={(e) =>
                                            updateListingField(
                                                listing._id,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        className="text-area"
                                        value={listing.description}
                                        onChange={(e) =>
                                            updateListingField(
                                                listing._id,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="service-option-row">

                                    <div className="two-column-layout">

                                        <div className="left-panel">

                                            <div className="form-group">

                                                <label>
                                                    Price
                                                </label>

                                                <input
                                                    className="text-input"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={listing.price}
                                                    onChange={(e) =>
                                                        updateListingField(
                                                            listing._id,
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>

                                        <div className="right-panel">

                                            <div className="form-group">

                                                <label>
                                                    Category
                                                </label>

                                                <select
                                                    className="dropdown-input service-dropdown"
                                                    value={
                                                        listing.category?._id ||
                                                        listing.category ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        updateListingField(
                                                            listing._id,
                                                            "category",
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="">
                                                        None
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

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Image URL
                                    </label>

                                    <input
                                        className="text-input"
                                        value={
                                            listing.imageUrl || ""
                                        }
                                        onChange={(e) =>
                                            updateListingField(
                                                listing._id,
                                                "imageUrl",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="two-column-layout">

                                    <div className="left-panel">

                                        <div className="form-group">

                                            <label>
                                                Listing Type
                                            </label>

                                            <select
                                                className="dropdown-input"
                                                value={listing.kind}
                                                onChange={(e) =>
                                                    updateListingField(
                                                        listing._id,
                                                        "kind",
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="service">
                                                    Service
                                                </option>

                                                <option value="product">
                                                    Product
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                    <div className="right-panel">

                                        <div className="form-group">

                                            <label>
                                                Visibility
                                            </label>

                                            <select
                                                className="dropdown-input"
                                                value={
                                                    listing.isActive
                                                        ? "active"
                                                        : "inactive"
                                                }
                                                onChange={(e) =>
                                                    updateListingField(
                                                        listing._id,
                                                        "isActive",
                                                        e.target.value === "active"
                                                    )
                                                }
                                            >

                                                <option value="active">
                                                    Active
                                                </option>

                                                <option value="inactive">
                                                    Hidden
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "15px",
                                        marginTop: "20px",
                                    }}
                                >

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            saveListing(listing)
                                        }
                                        disabled={
                                            savingId === listing._id
                                        }
                                    >

                                        {savingId === listing._id
                                            ? "Saving..."
                                            : "Save Changes"}

                                    </button>

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            deleteListing(
                                                listing._id
                                            )
                                        }
                                    >

                                        Delete

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}