import "../styles/customer.css";

const PLACEHOLDER_ORDERS = [
    { id: "ORD-001", title: "GPU Batch Processing", merchant: "TechRig Solutions", total: "$1.20", status: "Completed", date: "2025-05-10" },
    { id: "ORD-002", title: "Malware Scan & Removal", merchant: "SecureBox Co.", total: "$25.00", status: "In Progress", date: "2025-05-18" },
    { id: "ORD-003", title: "Overnight CPU Rental", merchant: "NightOwl Compute", total: "$0.40", status: "Completed", date: "2025-05-01" },
];

export default function CustomerOrders() {

    return (

        <div className="page-container">

            <button className="secondary-button back-button">← Dashboard</button>

            <h1 className="page-header">My Orders</h1>

            <div className="data-list">
                {PLACEHOLDER_ORDERS.map((order) => (
                    <div key={order.id} className="data-row">

                        <div className="data-row-left">
                            <span className="data-row-title">{order.title}</span>
                            <span className="data-row-subtext">{order.merchant} · {order.date}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <span>{order.total}</span>
                            <span className="status-tag">{order.status}</span>
                            <button className="secondary-button">Details</button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
