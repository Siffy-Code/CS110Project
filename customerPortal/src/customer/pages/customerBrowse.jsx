import "../styles/customer.css";

const PLACEHOLDER_LISTINGS = [
    { id: 1, title: "GPU Batch Processing", price: "$0.12 / hr", merchant: "TechRig Solutions", category: "Data Processing" },
    { id: 2, title: "Malware Scan & Removal", price: "$25.00 / scan", merchant: "SecureBox Co.", category: "Malware Scanning" },
    { id: 3, title: "Overnight CPU Rental", price: "$0.05 / hr", merchant: "NightOwl Compute", category: "Data Processing" },
    { id: 4, title: "Deep Malware Removal", price: "$49.99 / job", merchant: "CleanSlate LLC", category: "Malware Scanning" },
    { id: 5, title: "Dataset ETL Pipeline", price: "$0.20 / hr", merchant: "TechRig Solutions", category: "Data Processing" },
    { id: 6, title: "Antivirus + Firewall Scan", price: "$15.00 / scan", merchant: "SecureBox Co.", category: "Malware Scanning" },
];

const CATEGORIES = ["All", "Data Processing", "Malware Scanning"];

export default function CustomerBrowse() {

    return (

        <div className="page-container">

            <h1 className="page-header">Browse Services</h1>

            <div className="search-bar-row">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search services..."
                />
                <button className="primary-button">Search</button>
            </div>

            <div className="filter-row">
                {CATEGORIES.map((cat) => (
                    <button key={cat} className="secondary-button">
                        {cat}
                    </button>
                ))}
            </div>

            <div className="listings-grid">
                {PLACEHOLDER_LISTINGS.map((listing) => (
                    <div key={listing.id} className="listing-card">

                        <div className="listing-image">
                            No Image
                        </div>

                        <div className="listing-content">
                            <div className="listing-title">{listing.title}</div>
                            <div className="listing-price">{listing.price}</div>
                            <div className="listing-merchant">{listing.merchant}</div>
                            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                                <button className="primary-button">View</button>
                                <button className="secondary-button">Add to Cart</button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
