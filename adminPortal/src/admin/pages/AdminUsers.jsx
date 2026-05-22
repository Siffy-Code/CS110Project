import { useEffect, useState } from "react";
import { api } from "../api";
import DataRow from "../components/DataRow.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("");
    const [q, setQ] = useState("");
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState(null);
    const [resetting, setResetting] = useState(null);
    const [resetValue, setResetValue] = useState("");

    async function load() {
        try {
            const params = {};
            if (role) params.role = role;
            if (q) params.q = q;

            const res = await api.listUsers(params);
            setUsers(res.users);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    function ask(action, user, run) {
        setConfirm({ action, user, run });
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

    async function submitReset(e) {
        e.preventDefault();
        if (!resetting) return;
        try {
            await api.resetPassword(resetting.id, resetValue);
            setResetting(null);
            setResetValue("");
            alert("Password reset successfully.");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="page-container">

            <h1 className="page-header">Users</h1>

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
                        placeholder="Search name or email"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <button className="primary-button" type="submit">
                        Search
                    </button>
                </form>

                <select
                    className="dropdown-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">All roles</option>
                    <option value="customer">Customers</option>
                    <option value="merchant">Merchants</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {error ? <div className="form-error">{error}</div> : null}

            <div className="data-list">
                {users.length === 0 ? (
                    <p className="subtext">No users match.</p>
                ) : (
                    users.map((u) => (
                        <DataRow
                            key={u.id}
                            title={`${u.name} (${u.role})`}
                            subtext={u.email}
                            badge={
                                u.isActive
                                    ? { label: "active", tone: "ok" }
                                    : { label: "inactive", tone: "bad" }
                            }
                            actions={
                                <>
                                    {u.isActive ? (
                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                ask("deactivate", u, () =>
                                                    api.deactivateUser(u.id)
                                                )
                                            }
                                        >
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                ask("reactivate", u, () =>
                                                    api.reactivateUser(u.id)
                                                )
                                            }
                                        >
                                            Reactivate
                                        </button>
                                    )}

                                    <button
                                        className="secondary-button"
                                        onClick={() => {
                                            setResetting(u);
                                            setResetValue("");
                                        }}
                                    >
                                        Reset password
                                    </button>

                                    <button
                                        className="primary-button danger"
                                        onClick={() =>
                                            ask("delete", u, () =>
                                                api.deleteUser(u.id)
                                            )
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
                        ? "Delete user?"
                        : confirm?.action === "deactivate"
                        ? "Deactivate user?"
                        : "Reactivate user?"
                }
                message={
                    confirm
                        ? `${confirm.action} ${confirm.user.email}?`
                        : ""
                }
                confirmLabel={confirm?.action === "delete" ? "Delete" : "Confirm"}
                danger={confirm?.action === "delete"}
                onConfirm={runConfirmed}
                onClose={() => setConfirm(null)}
            />

            {resetting ? (
                <div
                    className="modal-backdrop"
                    onClick={() => setResetting(null)}
                >
                    <form
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={submitReset}
                    >
                        <h2 className="modal-title">
                            Reset password for {resetting.email}
                        </h2>
                        <div className="form-group">
                            <label htmlFor="newpw">New password</label>
                            <input
                                id="newpw"
                                className="text-input"
                                type="text"
                                minLength={6}
                                required
                                value={resetValue}
                                onChange={(e) => setResetValue(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="secondary-button"
                                type="button"
                                onClick={() => setResetting(null)}
                            >
                                Cancel
                            </button>
                            <button className="primary-button" type="submit">
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

        </div>
    );
}
