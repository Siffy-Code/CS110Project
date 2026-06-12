import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import "../styles/customer.css";

export default function CustomerMessageBoard() {
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        loadMessages();
    }, []);

    async function loadMessages() {
        try {
            const res = await api.customerMessages();
            setConversations(res.conversations || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filtered = searchText
        ? conversations.filter((c) =>
              (c.subject || "").toLowerCase().includes(searchText.toLowerCase()) ||
              (c.merchant?.storeName || "").toLowerCase().includes(searchText.toLowerCase())
          )
        : conversations;

    if (loading) {
        return (
            <div className="page-container">
                <h1 className="page-header">Messages</h1>
                <p className="subtext">Loading...</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <h1 className="page-header">Messages</h1>

            <div className="search-bar-row" style={{ marginBottom: "20px" }}>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search messages..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {error && <div className="form-error">{error}</div>}

            {!error && filtered.length === 0 && (
                <p className="subtext">No messages yet.</p>
            )}

            <div className="data-list">
                {filtered.map((thread) => (
                    <div
                        key={thread._id}
                        className="data-row message-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/messages/${thread._id}`)}
                    >
                        <div className="data-row-left">
                            <span className="data-row-title">
                                {thread.subject || "Conversation"}
                            </span>
                            <span className="data-row-subtext">
                                {thread.merchant?.storeName || ""}
                            </span>
                        </div>
                        <span className="subtext">
                            {(thread.updatedAt || "").slice(0, 10)}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}