import { useEffect, useState } from "react";
import { api } from "../api";
import DataRow from "../components/DataRow.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(null);
    const [confirm, setConfirm] = useState(null);

    async function load() {
        try {
            const res = await api.listCategories();
            setCategories(res.categories);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        try {
            await api.createCategory(name, description);
            setName("");
            setDescription("");
            await load();
        } catch (err) {
            setError(err.message);
        }
    }

    async function saveEdit(e) {
        e.preventDefault();
        if (!editing) return;
        try {
            await api.updateCategory(editing._id, {
                name: editing.name,
                description: editing.description,
            });
            setEditing(null);
            await load();
        } catch (err) {
            setError(err.message);
        }
    }

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

    return (
        <div className="page-container">

            <h1 className="page-header">Categories</h1>

            <form onSubmit={handleCreate} className="info-box form-container">
                <h2 className="section-header">Add a category</h2>

                <div className="form-group">
                    <label htmlFor="cat-name">Name</label>
                    <input
                        id="cat-name"
                        className="text-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cat-desc">Description</label>
                    <input
                        id="cat-desc"
                        className="text-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button className="primary-button" type="submit">
                    Create category
                </button>
            </form>

            {error ? <div className="form-error">{error}</div> : null}

            <div className="data-list">
                {categories.length === 0 ? (
                    <p className="subtext">No categories yet.</p>
                ) : (
                    categories.map((c) => (
                        <DataRow
                            key={c._id}
                            title={c.name}
                            subtext={c.description || c.slug}
                            actions={
                                <>
                                    <button
                                        className="secondary-button"
                                        onClick={() => setEditing({ ...c })}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="primary-button danger"
                                        onClick={() =>
                                            setConfirm({
                                                action: "delete",
                                                category: c,
                                                run: () =>
                                                    api.deleteCategory(c._id),
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
                title="Delete category?"
                message={
                    confirm
                        ? `Delete "${confirm.category.name}"? Listings using this category will be detached, not deleted.`
                        : ""
                }
                danger
                confirmLabel="Delete"
                onConfirm={runConfirmed}
                onClose={() => setConfirm(null)}
            />

            {editing ? (
                <div
                    className="modal-backdrop"
                    onClick={() => setEditing(null)}
                >
                    <form
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={saveEdit}
                    >
                        <h2 className="modal-title">Edit category</h2>

                        <div className="form-group">
                            <label htmlFor="edit-name">Name</label>
                            <input
                                id="edit-name"
                                className="text-input"
                                value={editing.name}
                                onChange={(e) =>
                                    setEditing({
                                        ...editing,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-desc">Description</label>
                            <input
                                id="edit-desc"
                                className="text-input"
                                value={editing.description || ""}
                                onChange={(e) =>
                                    setEditing({
                                        ...editing,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => setEditing(null)}
                            >
                                Cancel
                            </button>
                            <button className="primary-button" type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

        </div>
    );
}
