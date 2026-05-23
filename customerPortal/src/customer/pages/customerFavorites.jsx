import "../styles/customer.css";

const PLACEHOLDER_FAVORITES = [
    { id: 1, storeName: "TechRig Solutions", description: "High-performance GPU and CPU rentals.", rating: "★★★★★" },
    { id: 2, storeName: "SecureBox Co.", description: "Malware scanning and removal specialists.", rating: "★★★★☆" },
];

export default function CustomerFavorites() {

    return (

        <div className="page-container">

            <button className="secondary-button back-button">← Dashboard</button>

            <h1 className="page-header">Favorite Merchants</h1>

            <div className="data-list">
                {PLACEHOLDER_FAVORITES.map((merchant) => (
                    <div key={merchant.id} className="data-row">

                        <div className="data-row-left">
                            <span className="data-row-title">{merchant.storeName}</span>
                            <span className="data-row-subtext">{merchant.description}</span>
                            <span className="data-row-subtext">{merchant.rating}</span>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button className="primary-button">View Profile</button>
                            <button className="secondary-button">Unfavorite</button>
                        </div>

                    </div>
                ))}
            </div>

            {PLACEHOLDER_FAVORITES.length === 0 && (
                <p className="subtext">You haven't favorited any merchants yet.</p>
            )}

        </div>
    );
}
