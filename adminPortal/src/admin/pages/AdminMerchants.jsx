import { useEffect, useState } from "react";
import { api } from "../api";
import DataRow from "../components/DataRow.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminMerchants() {
    const [merchants, setMerchants] = useState([]);
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState(null);

    async function load() {
        try {
            const res = await api.listMerchants();
            setMerchants(res.merchants);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function ask(action, merchant, run) {
        setConfirm({ action, merchant, run });
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

            <h1 className="page-header">Merchants</h1>

            {error ? <div className="form-error">{error}</div> : null}

            <div className="data-list">
                {merchants.length === 0 ? (
                    <p className="subtext">No merchants registered.</p>
                ) : (
                    merchants.map((m) => (
                        <DataRow
                            key={m._id}
                            title={m.storeName}
                            subtext={
                                m.owner
                                    ? `Owner: ${m.owner.name} (${m.owner.email})`
                                    : "Owner missing"
                            }
                            badge={
                                m.isActive
                                    ? { label: "active", tone: "ok" }
                                    : { label: "deactivated", tone: "bad" }
                            }
                            actions={
                                m.isActive ? (
                                    <button
                                        className="primary-button danger"
                                        onClick={() =>
                                            ask("deactivate", m, () =>
                                                api.deactivateMerchant(m._id)
                                            )
                                        }
                                    >
                                        Deactivate (hide all listings)
                                    </button>
                                ) : (
                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            ask("reactivate", m, () =>
                                                api.reactivateMerchant(m._id)
                                            )
                                        }
                                    >
                                        Reactivate
                                    </button>
                                )
                            }
                        />
                    ))
                )}
            </div>

            <ConfirmModal
                open={!!confirm}
                title={
                    confirm?.action === "deactivate"
                        ? "Deactivate merchant?"
                        : "Reactivate merchant?"
                }
                message={
                    confirm?.action === "deactivate"
                        ? `Deactivating "${confirm?.merchant.storeName}" will also hide every listing they own. Continue?`
                        : `Reactivate "${confirm?.merchant.storeName}"? Their listings will need to be reactivated individually.`
                }
                danger={confirm?.action === "deactivate"}
                onConfirm={runConfirmed}
                onClose={() => setConfirm(null)}
            />

        </div>
    );
}
