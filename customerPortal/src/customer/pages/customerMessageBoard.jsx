import "../styles/customer.css";

const PLACEHOLDER_THREADS = [
    { id: 1, with: "TechRig Solutions", preview: "Hey, is overnight scheduling available?", date: "2025-05-19", unread: true },
    { id: 2, with: "SecureBox Co.", preview: "Thanks for the quick turnaround!", date: "2025-05-12", unread: false },
    { id: 3, with: "Support (Admin)", preview: "Your refund has been processed.", date: "2025-05-08", unread: false },
];

export default function CustomerMessageBoard() {

    return (

        <div className="page-container">

            <button className="secondary-button back-button">← Dashboard</button>

            <h1 className="page-header">Messages</h1>

            <div className="data-list">
                {PLACEHOLDER_THREADS.map((thread) => (
                    <a key={thread.id} className="message-link">
                        <div className="data-row">

                            <div className="data-row-left">
                                <span className="data-row-title">
                                    {thread.unread && <span style={{ color: "#aaa", marginRight: "6px" }}>●</span>}
                                    {thread.with}
                                </span>
                                <span className="data-row-subtext">{thread.preview}</span>
                            </div>

                            <span className="subtext">{thread.date}</span>

                        </div>
                    </a>
                ))}
            </div>

        </div>
    );
}
