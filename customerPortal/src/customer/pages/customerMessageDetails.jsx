import "../styles/customer.css";

const PLACEHOLDER_MESSAGES = [
    { id: 1, from: "You", text: "Hey, is overnight scheduling available for GPU jobs?", time: "May 19, 9:02 AM" },
    { id: 2, from: "TechRig Solutions", text: "Yes! We offer off-hours subscriptions starting at $0.05/hr.", time: "May 19, 9:45 AM" },
    { id: 3, from: "You", text: "Great, I'll check out the listing.", time: "May 19, 10:01 AM" },
];

export default function CustomerMessageDetails() {

    return (

        <div className="page-container">

            <button className="secondary-button back-button">← Messages</button>

            <h1 className="page-header">TechRig Solutions</h1>

            <div className="info-box" style={{ maxWidth: "700px", marginBottom: "20px" }}>
                {PLACEHOLDER_MESSAGES.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            marginBottom: "18px",
                            textAlign: msg.from === "You" ? "right" : "left",
                        }}
                    >
                        <div className="subtext" style={{ marginBottom: "4px" }}>
                            {msg.from} · {msg.time}
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                background: msg.from === "You" ? "#555" : "#4a4a4a",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                maxWidth: "70%",
                                textAlign: "left",
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: "10px", maxWidth: "700px" }}>
                <input
                    className="text-input"
                    style={{ flex: 1 }}
                    type="text"
                    placeholder="Type a message..."
                />
                <button className="primary-button">Send</button>
            </div>

        </div>
    );
}
