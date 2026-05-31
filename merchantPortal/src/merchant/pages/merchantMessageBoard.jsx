import React from "react";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import { api }
from "../api";

import "../styles/merchant.css";

export default function MerchantMessageBoard() {

    const navigate =
        useNavigate();

    const [
        conversations,
        setConversations,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        activeTab,
        setActiveTab,
    ] = useState("active");

    const [
        searchText,
        setSearchText,
    ] = useState("");

    const [
        newConversation,
        setNewConversation,
    ] = useState({

        customerEmail: "",
        subject: "",
        content: "",
    });

    useEffect(() => {

        loadMessages();

    }, []);

    async function loadMessages() {

        try {

            const res =
                await api
                    .merchantMessages();

            setConversations(
                res.conversations || []
            );

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);
        }
    }

    async function createConversation() {

        try {

            const res =
                await api
                    .createConversation(
                        newConversation
                    );

            navigate(
                `/messages/${res.conversation._id}`
            );

        } catch (err) {

            setError(
                err.message
            );
        }
    }

    async function setArchived(
        id,
        archived
    ) {

        try {

            await api
                .updateConversationArchive(
                    id,
                    archived
                );

            setConversations(
                (prev) =>
                    prev.map(
                        (
                            conversation
                        ) => {

                            if (
                                conversation._id !==
                                id
                            ) {
                                return conversation;
                            }

                            return {

                                ...conversation,

                                archived,
                            };
                        }
                    )
            );

        } catch (err) {

            setError(
                err.message
            );
        }
    }

    const filteredConversations =
        conversations.filter(
            (conversation) => {

                const matchesSearch =
                    searchText === "" ||

                    conversation
                        .subject
                        ?.toLowerCase()
                        .includes(
                            searchText.toLowerCase()
                        ) ||

                    conversation
                        .customer
                        ?.name
                        ?.toLowerCase()
                        .includes(
                            searchText.toLowerCase()
                        ) ||

                    conversation
                        .customer
                        ?.email
                        ?.toLowerCase()
                        .includes(
                            searchText.toLowerCase()
                        );

                if (
                    !matchesSearch
                ) {
                    return false;
                }

                if (
                    activeTab ===
                    "search"
                ) {

                    return true;
                }

                if (
                    activeTab ===
                    "archived"
                ) {

                    return (
                        conversation.archived ===
                        true
                    );
                }

                return (
                    conversation.archived !==
                    true
                );
            }
        );

    if (loading) {

        return (

            <div className="page-container">

                <h1 className="page-header">
                    Messages
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
                Messages
            </h1>

            <p className="subtext">

                Customer support
                conversations and
                communication history.

            </p>

            {error && (

                <div className="form-error">
                    {error}
                </div>

            )}

            <div className="two-column-layout">

                <div className="right-panel">

                    <div className="info-box">

                        <div
                            style={{
                                display:
                                    "flex",

                                gap: "10px",

                                marginBottom:
                                    "20px",
                            }}
                        >

                            <button
                                className={
                                    activeTab ===
                                    "active"
                                        ? "primary-button"
                                        : "secondary-button"
                                }
                                onClick={() =>
                                    setActiveTab(
                                        "active"
                                    )
                                }
                            >

                                Active

                            </button>

                            <button
                                className={
                                    activeTab ===
                                    "archived"
                                        ? "primary-button"
                                        : "secondary-button"
                                }
                                onClick={() =>
                                    setActiveTab(
                                        "archived"
                                    )
                                }
                            >

                                Archived

                            </button>

                            <button
                                className={
                                    activeTab ===
                                    "search"
                                        ? "primary-button"
                                        : "secondary-button"
                                }
                                onClick={() =>
                                    setActiveTab(
                                        "search"
                                    )
                                }
                            >

                                Search

                            </button>

                        </div>

                        <input
                            className="text-input"
                            placeholder="Search customer or subject..."
                            value={
                                searchText
                            }
                            onChange={(e) =>
                                setSearchText(
                                    e.target.value
                                )
                            }
                            style={{
                                marginBottom:
                                    "20px",
                            }}
                        />

                        <div className="data-list">

                            {filteredConversations
                                .length === 0 ? (

                                <div className="info-box">

                                    <p className="subtext">

                                        No conversations found.

                                    </p>

                                </div>

                            ) : (

                                filteredConversations.map(
                                    (
                                        conversation
                                    ) => (

                                        <div
                                            key={
                                                conversation._id
                                            }
                                            className="data-row"
                                        >

                                            <div
                                                className="data-row-left"
                                                style={{
                                                    cursor:
                                                        "pointer",
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/messages/${conversation._id}`
                                                    )
                                                }
                                            >

                                                <div className="data-row-title">

                                                    {
                                                        conversation.subject
                                                    }

                                                </div>

                                                <div className="data-row-subtext">

                                                    Customer:
                                                    {" "}
                                                    {
                                                        conversation
                                                            .customer
                                                            ?.name
                                                    }

                                                </div>

                                                <div className="data-row-subtext">

                                                    Email:
                                                    {" "}
                                                    {
                                                        conversation
                                                            .customer
                                                            ?.email
                                                    }

                                                </div>

                                            </div>

                                            {conversation.archived ? (

                                                <button
                                                    className="secondary-button"
                                                    onClick={() =>
                                                        setArchived(
                                                            conversation._id,
                                                            false
                                                        )
                                                    }
                                                >

                                                    Restore

                                                </button>

                                            ) : (

                                                <button
                                                    className="secondary-button"
                                                    onClick={() =>
                                                        setArchived(
                                                            conversation._id,
                                                            true
                                                        )
                                                    }
                                                >

                                                    Archive

                                                </button>

                                            )}

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>

                </div>

                <div className="left-panel">

                    <div className="info-box">

                        <h2 className="section-header">
                            New Conversation
                        </h2>

                        <div className="form-group">

                            <label>
                                Customer Email
                            </label>

                            <input
                                className="text-input"
                                value={
                                    newConversation.customerEmail
                                }
                                onChange={(e) =>
                                    setNewConversation({
                                        ...newConversation,
                                        customerEmail:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Subject
                            </label>

                            <input
                                className="text-input"
                                value={
                                    newConversation.subject
                                }
                                onChange={(e) =>
                                    setNewConversation({
                                        ...newConversation,
                                        subject:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Initial Message
                            </label>

                            <textarea
                                className="text-area"
                                maxLength={256}
                                value={
                                    newConversation.content
                                }
                                onChange={(e) =>
                                    setNewConversation({
                                        ...newConversation,
                                        content:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>

                        <div
                            className="data-row-subtext"
                            style={{
                                marginBottom:
                                    "10px",
                            }}
                        >

                            {
                                newConversation
                                    .content
                                    .length
                            }
                            /256

                        </div>

                        <button
                            className="primary-button"
                            onClick={
                                createConversation
                            }
                        >

                            Start Conversation

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}