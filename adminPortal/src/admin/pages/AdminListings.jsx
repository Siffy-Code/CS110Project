import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import DataRow from "../components/DataRow.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

const EMPTY_FORM = {
    merchant: "",
    title: "",
    description: "",
    price: "",
    category: "",
    kind: "service",
};

export default function AdminListings() {
    const [listings, setListings] = useState([]);
    const [active, setActive] = useState("");
    const [q, setQ] = useState("");
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState(null);
    const [reasonFor, setReasonFor] = useState(null);
    const [reasonValue, setReasonValue] = useState("");

    const [merchants, setMerchants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        api.listMerchants().then((r) => setMerchants(r.merchants)).catch(() => {});
        api.listCategories().then((r) => setCategories(r.categories)).catch(() => {});
    }, []);

    async function load() {
        try {
            const params = {};
            if (active) params.active = active;
            if (q) params.q = q;

            const res = await api.listListings(params);
            setListings(res.listings);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    async function runConfirmed() {
        if (!confirm) return;
        try {
            await confirm.run();
            setConfirm(null);
            await load();
        } catch (err) {
            setError(err.message);
            setConfirm(null);
        }
    }

    async function submitCreate(e) {
        e.preventDefault();
        try {
            const payload = {
                merchant: form.merchant,
                title: form.title,
                description: form.description,
                price: Number(form.price),
                kind: form.kind,
            };
            if (form.category) payload.category = form.category;

            await api.createListing(payload);
            setCreating(false);
            setForm(EMPTY_FORM);
            await load();
        } catch (err) {
            setError(err.message);
        }
    }

    async function submitDeactivate(e) {
        e.preventDefault();
        if (!reasonFor) return;
        try {
            await api.deactivateListing(reasonFor._id, reasonValue);
            setReasonFor(null);
            setReasonValue("");
            await load();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="page-container">

            <div className="page-header-row">
                <h1 className="page-header">Listings</h1>
                <button
                    className="primary-button"
                    onClick={() => {
                        setForm(EMPTY_FORM);
                        setCreating(true);
                    }}
                >
                    + New listing
                </button>
            </div>

            <div className="filter-row">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        load();
                    }}
                    className="filter-form"
                >
                    <input
                        className="text-input"
                        placeholder="Search title"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <button className="primary-button" type="submit">
                        Search
                    </button>
                </form>

                <select
                    className="dropdown-input"
                    value={active}
                    onChange={(e) => setActive(e.target.value)}
                >
                    <option value="">All statuses</option>
                    <option value="true">Active only</option>
                    <option value="false">Inactive only</option>
                </select>
            </div>

            {error ? <div className="form-error">{error}</div> : null}

            <div className="data-list">
                {listings.length === 0 ? (
                    <p className="subtext">No listings match.</p>
                ) : (
                    listings.map((l) => (
                        <DataRow
                            key={l._id}
                            title={
                                <Link
                                    to={`/listings/${l._id}`}
                                    className="data-row-link"
                                >
                                    {`${l.title} - $${l.price}`}
                                </Link>
                            }
                            subtext={
                                <>
                                    {l.merchant?.storeName || "Unknown merchant"}
                                    {l.category ? ` - ${l.category.name}` : ""}
                                    {l.deactivatedReason
                                        ? ` - reason: ${l.deactivatedReason}`
                                        : ""}
                                </>
                            }
                            badge={
                                l.isActive
                                    ? { label: "active", tone: "ok" }
                                    : { label: "inactive", tone: "bad" }
                            }
                            actions={
                                <>
                                    <Link
                                        to={`/listings/${l._id}`}
                                        className="secondary-button row-link-button"
                                    >
                                        View
                                    </Link>
                                    {l.isActive ? (
                                        <button
                                            className="primary-button danger"
                                            onClick={() => {
                                                setReasonFor(l);
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
                                                    listing: l,
                                                    run: () =>
                                                        api.reactivateListing(
                                                            l._id
                                                        ),
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
                                                listing: l,
                                                run: () =>
                                                    api.deleteListing(l._id),
                                            })
                                        }
                                    >
                                        Delete
                                    </button>
                                </>
                            }
                        />
                    ))
                )}
            </div>

            <ConfirmModal
                open={!!confirm}
                title={
                    confirm?.action === "delete"
                        ? "Delete listing?"
                        : "Reactivate listing?"
                }
                message={
                    confirm
                        ? `${confirm.action} "${confirm.listing.title}"?`
                        : ""
                }
                confirmLabel={confirm?.action === "delete" ? "Delete" : "Confirm"}
                danger={confirm?.action === "delete"}
                onConfirm={runConfirmed}
                onClose={() => setConfirm(null)}
            />

            {reasonFor ? (
                <div
                    className="modal-backdrop"
                    onClick={() => setReasonFor(null)}
                >
                    <form
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={submitDeactivate}
                    >
                        <h2 className="modal-title">
                            Deactivate "{reasonFor.title}"
                        </h2>
                        <div className="form-group">
                            <label htmlFor="reason">
                                Reason (shown to the merchant)
                            </label>
                            <textarea
                                id="reason"
                                className="text-area"
                                value={reasonValue}
                                onChange={(e) => setReasonValue(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="secondary-button"
                                type="button"
                                onClick={() => setReasonFor(null)}
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

            {creating ? (
                <div
                    className="modal-backdrop"
                    onClick={() => setCreating(false)}
                >
                    <form
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={submitCreate}
                    >
                        <h2 className="modal-title">New listing</h2>

                        <div className="form-group">
                            <label htmlFor="new-merchant">Merchant</label>
                            <select
                                id="new-merchant"
                                className="dropdown-input"
                                value={form.merchant}
                                onChange={(e) =>
                                    setForm({ ...form, merchant: e.target.value })
                                }
                                required
                            >
                                <option value="">-- choose a merchant --</option>
                                {merchants.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.storeName}
                                        {m.isActive ? "" : " (deactivated)"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-title">Title</label>
                            <input
                                id="new-title"
                                className="text-input"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-desc">Description</label>
                            <textarea
                                id="new-desc"
                                className="text-area"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-price">Price ($)</label>
                            <input
                                id="new-price"
                                className="text-input"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({ ...form, price: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-cat">Category</label>
                            <select
                                id="new-cat"
                                className="dropdown-input"
                                value={form.category}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: e.target.value,
                                    })
                                }
                            >
                                <option value="">-- none --</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-kind">Kind</label>
                            <select
                                id="new-kind"
                                className="dropdown-input"
                                value={form.kind}
                                onChange={(e) =>
                                    setForm({ ...form, kind: e.target.value })
                                }
                            >
                                <option value="service">Service</option>
                                <option value="product">Product</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="secondary-button"
                                type="button"
                                onClick={() => setCreating(false)}
                            >
                                Cancel
                            </button>
                            <button className="primary-button" type="submit">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

        </div>
    );
}
