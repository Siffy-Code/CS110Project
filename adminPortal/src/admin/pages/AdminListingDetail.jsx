import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminListingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState(null);
    const [reasonOpen, setReasonOpen] = useState(false);
    const [reasonValue, setReasonValue] = useState("");

    async function load() {
        setLoading(true);
        try {
            const res = await api.getListing(id);
            setListing(res.listing);
            setError("");
        } catch (err) {
            setError(err.message);
            setListing(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function runConfirmed() {
        if (!confirm) return;
        try {
            await confirm.run();
            setConfirm(null);
            if (confirm.action === "delete") {
                navigate("/listings");
                return;
            }
            await load();
        } catch (err) {
            setError(err.message);
            setConfirm(null);
        }
    }

    async function submitDeactivate(e) {
        e.preventDefault();
        try {
            await api.deactivateListing(id, reasonValue);
            setReasonOpen(false);
            setReasonValue("");
            await load();
        } catch (err) {
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <div className="page-container">
                <p className="subtext">Loading listing...</p>
            </div>
        );
    }

    if (error && !listing) {
        return (
            <div className="page-container">
                <Link to="/listings" className="back-link">
                    ← Back to listings
                </Link>
                <div className="form-error">{error}</div>
            </div>
        );
    }

    if (!listing) return null;

    return (
        <div className="page-container">
            <Link to="/listings" className="back-link">
                ← Back to listings
            </Link>

            <div className="page-header-row">
                <h1 className="page-header">{listing.title}</h1>
                <span
                    className={`badge ${listing.isActive ? "ok" : "bad"}`}
                >
                    {listing.isActive ? "active" : "inactive"}
                </span>
            </div>

            {error ? <div className="form-error">{error}</div> : null}

            {listing.imageUrl ? (
                <div className="listing-detail-image">
                    <img src={listing.imageUrl} alt={listing.title} />
                </div>
            ) : null}

            <div className="info-box">
                <h2 className="section-header">Details</h2>
                <div className="detail-grid">
                    <DetailRow label="Price" value={`$${Number(listing.price).toFixed(2)}`} />
                    <DetailRow label="Kind" value={listing.kind || "service"} />
                    <DetailRow
                        label="Category"
                        value={listing.category?.name || "—"}
                    />
                    <DetailRow
                        label="Created"
                        value={formatDate(listing.createdAt)}
                    />
                    <DetailRow
                        label="Updated"
                        value={formatDate(listing.updatedAt)}
                    />
                </div>
                {listing.description ? (
                    <p className="detail-description">{listing.description}</p>
                ) : (
                    <p className="subtext">No description provided.</p>
                )}
            </div>

            <div className="info-box">
                <h2 className="section-header">Merchant</h2>
                <div className="detail-grid">
                    <DetailRow
                        label="Store"
                        value={listing.merchant?.storeName || "Unknown"}
                    />
                    <DetailRow
                        label="Status"
                        value={
                            listing.merchant?.isActive ? "Active" : "Deactivated"
                        }
                    />
                    {listing.merchant?.contactEmail ? (
                        <DetailRow
                            label="Contact"
                            value={listing.merchant.contactEmail}
                        />
                    ) : null}
                </div>
                {listing.merchant?.description ? (
                    <p className="detail-description">
                        {listing.merchant.description}
                    </p>
                ) : null}
            </div>

            {!listing.isActive ? (
                <div className="info-box">
                    <h2 className="section-header">Deactivation</h2>
                    <div className="detail-grid">
                        <DetailRow
                            label="Reason"
                            value={listing.deactivatedReason || "—"}
                        />
                        <DetailRow
                            label="Deactivated by"
                            value={
                                listing.deactivatedBy
                                    ? `${listing.deactivatedBy.name} (${listing.deactivatedBy.email})`
                                    : "—"
                            }
                        />
                    </div>
                </div>
            ) : null}

            <div className="detail-actions">
                {listing.isActive ? (
                    <button
                        className="primary-button danger"
                        onClick={() => {
                            setReasonOpen(true);
                            setReasonValue("");
                        }}
                    >
                        Deactivate
                    </button>
                ) : (
                    <button
                        className="secondary-button"
                        onClick={() =>
                            setConfirm({
                                action: "reactivate",
                                run: () => api.reactivateListing(id),
                            })
                        }
                    >
                        Reactivate
                    </button>
                )}

                <button
                    className="primary-button danger"
                    onClick={() =>
                        setConfirm({
                            action: "delete",
                            run: () => api.deleteListing(id),
                        })
                    }
                >
                    Delete
                </button>
            </div>

            <ConfirmModal
                open={!!confirm}
                title={
                    confirm?.action === "delete"
                        ? "Delete listing?"
                        : "Reactivate listing?"
                }
                message={
                    confirm?.action === "delete"
                        ? `Permanently delete "${listing.title}"?`
                        : `Reactivate "${listing.title}"?`
                }
                confirmLabel={confirm?.action === "delete" ? "Delete" : "Confirm"}
                danger={confirm?.action === "delete"}
                onConfirm={runConfirmed}
                onClose={() => setConfirm(null)}
            />

            {reasonOpen ? (
                <div
                    className="modal-backdrop"
                    onClick={() => setReasonOpen(false)}
                >
                    <form
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={submitDeactivate}
                    >
                        <h2 className="modal-title">
                            Deactivate "{listing.title}"
                        </h2>
                        <div className="form-group">
                            <label htmlFor="detail-reason">
                                Reason (shown to the merchant)
                            </label>
                            <textarea
                                id="detail-reason"
                                className="text-area"
                                value={reasonValue}
                                onChange={(e) => setReasonValue(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="secondary-button"
                                type="button"
                                onClick={() => setReasonOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="primary-button danger"
                                type="submit"
                            >
                                Deactivate
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="detail-row">
            <span className="detail-label">{label}</span>
            <span className="detail-value">{value}</span>
        </div>
    );
}

function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleString();
}
