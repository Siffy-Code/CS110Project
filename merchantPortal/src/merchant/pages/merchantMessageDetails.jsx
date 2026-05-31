import React from "react";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import { api }
from "../api";

import "../styles/merchant.css";

export default function MerchantMessageDetails() {

    const { id } =
        useParams();

    const [
        conversation,
        setConversation,
    ] = useState(null);

    const [
        messages,
        setMessages,
    ] = useState([]);

    const [
        newMessage,
        setNewMessage,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {

        loadConversation();

    }, [id]);

    async function loadConversation() {

        try {

            const res =
                await api
                    .merchantConversation(
                        id
                    );

            setConversation(
                res.conversation
            );

            setMessages(
                res.messages || []
            );

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);
        }
    }

    async function sendMessage() {

        if (
            !newMessage.trim()
        ) {
            return;
        }

        try {

            const res =
                await api
                    .sendMerchantMessage(
                        id,
                        newMessage
                    );

            setMessages((prev) => [
                ...prev,
                res.message,
            ]);

            setNewMessage("");

        } catch (err) {

            setError(
                err.message
            );
        }
    }

    if (loading) {

        return (

            <div className="page-container">

                <h1 className="page-header">
                    Conversation
                </h1>

                <p className="subtext">
                    Loading...
                </p>

            </div>
        );
    }

    return (

        <div className="page-container">

            <h1 className="page-header">

                {
                    conversation?.subject
                }

            </h1>

            <p className="subtext">

                Customer:
                {" "}
                {
                    conversation
                        ?.customer
                        ?.name
                }

                {" • "}

                {
                    conversation
                        ?.customer
                        ?.email
                }

            </p>

            {error && (

                <div className="form-error">
                    {error}
                </div>

            )}

            <div className="data-list">

                {messages.map(
                    (message) => (

                        <div
                            key={
                                message._id
                            }
                            className="info-box"
                            style={{
                                marginBottom:
                                    "15px",

                                borderLeft:
                                    message.direction ===
                                    "FROM"
                                        ? "4px solid #4caf50"
                                        : "4px solid #2196f3",
                            }}
                        >

                            <div
                                className="data-row-subtext"
                                style={{
                                    marginBottom:
                                        "8px",
                                    fontWeight:
                                        "bold",
                                }}
                            >

                                {
                                    message.direction
                                }

                                {" • "}

                                Message #
                                {
                                    message.messageNumber
                                }

                            </div>

                            <div
                                style={{
                                    marginBottom:
                                        "10px",
                                }}
                            >

                                {
                                    message.content
                                }

                            </div>

                            <div
                                className="data-row-subtext"
                            >

                                {new Date(
                                    message.createdAt
                                ).toLocaleString()}

                            </div>

                        </div>

                    )
                )}

            </div>

            <div
                className="info-box"
                style={{
                    marginTop: "25px",
                }}
            >

                <h2 className="section-header">
                    Reply
                </h2>

                <textarea
                    className="text-area"
                    maxLength={256}
                    value={newMessage}
                    onChange={(e) =>
                        setNewMessage(
                            e.target.value
                        )
                    }
                />

                <div
                    className="data-row-subtext"
                    style={{
                        marginTop: "10px",
                    }}
                >

                    {
                        newMessage.length
                    }
                    /256

                </div>

                <button
                    className="primary-button"
                    style={{
                        marginTop: "15px",
                    }}
                    onClick={
                        sendMessage
                    }
                >

                    Send Reply

                </button>

            </div>

        </div>
    );
}