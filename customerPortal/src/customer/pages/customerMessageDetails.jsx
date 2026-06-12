import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import "../styles/customer.css";

export default function CustomerMessageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        loadConversation();
    }, [id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function loadConversation() {
        try {
            const res = await api.customerConversation(id);
            setConversation(res.conversation || null);
            setMessages(res.messages || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSend(e) {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSending(true);

        try {
            await api.sendCustomerMessage(id, newMessage.trim());
            setNewMessage("");
            await loadConversation();
        } catch (err) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <div className="page-container">
                <p className="subtext">Loading...</p>
            </div>
        );
    }

    const title = conversation?.subject || "Conversation";

    return (
        <div className="page-container">

            <button
                className="secondary-button back-button"
                onClick={() => navigate("/messages")}
            >
                ← Messages
            </button>

            <h1 className="page-header">{title}</h1>
            {conversation?.merchant?.storeName && (
                <p className="subtext" style={{ marginTop: "-10px", marginBottom: "15px" }}>
                    Merchant: {conversation.merchant.storeName}
                </p>
            )}

            {error && <div className="form-error">{error}</div>}

            <div className="info-box" style={{ marginBottom: "20px" }}>
                {messages.map((msg) => {
                    const isMe = msg.direction === "TO";
                    return (
                        <div
                            key={msg._id}
                            style={{
                                marginBottom: "18px",
                                textAlign: isMe ? "right" : "left",
                            }}
                        >
                            <div className="subtext" style={{ marginBottom: "4px" }}>
                                {isMe ? "You" : (msg.senderName || "Them")} ·{" "}
                                {(msg.createdAt || "").slice(0, 16).replace("T", " ")}
                            </div>
                            <div
                                style={{
                                    display: "inline-block",
                                    background: isMe ? "#555" : "#4a4a4a",
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    maxWidth: "70%",
                                    textAlign: "left",
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <form
                style={{ display: "flex", gap: "10px" }}
                onSubmit={handleSend}
            >
                <input
                    className="text-input"
                    style={{ flex: 1 }}
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                />
                <button
                    type="submit"
                    className="primary-button"
                    disabled={sending || !newMessage.trim()}
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </form>

        </div>
    );
}