import "../styles/customer.css";

export default function CustomerDashboard() {

    return (

        <div className="page-container">

            <h1 className="page-header">
                Customer Dashboard
            </h1>

            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h2>Browse Listings</h2>
                    <button className="primary-button">
                        Open
                    </button>
                </div>

                <div className="dashboard-card">
                    <h2>My Orders</h2>
                    <button className="primary-button">
                        Open
                    </button>
                </div>

                <div className="dashboard-card">
                    <h2>Messages</h2>
                    <button className="primary-button">
                        Open
                    </button>
                </div>

                <div className="dashboard-card">
                    <h2>Favorites</h2>
                    <button className="primary-button">
                        Open
                    </button>
                </div>

            </div>

        </div>
    );
}
