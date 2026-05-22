import { useEffect, useState } from "react";
import { api } from "../api";
import DataRow from "../components/DataRow.jsx";

export default function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .listLogs(200)
            .then((res) => setLogs(res.logs))
            .catch((err) => setError(err.message));
    }, []);

    return (
        <div className="page-container">

            <h1 className="page-header">Audit log</h1>
            <p className="subtext">
                Most recent admin actions. Useful when debugging "who did what".
            </p>

            {error ? <div className="form-error">{error}</div> : null}

            <div className="data-list">
                {logs.length === 0 ? (
                    <p className="subtext">No actions logged yet.</p>
                ) : (
                    logs.map((log) => (
                        <DataRow
                            key={log._id}
                            title={log.action}
                            subtext={
                                <>
                                    {new Date(log.createdAt).toLocaleString()}
                                    {" - "}
                                    {log.admin
                                        ? `${log.admin.name} <${log.admin.email}>`
                                        : "Unknown admin"}
                                    {log.target?.label
                                        ? ` - target: ${log.target.label}`
                                        : ""}
                                </>
                            }
                        />
                    ))
                )}
            </div>

        </div>
    );
}
