import "../styles/merchant.css";

export default function MerchantDashboard() {

    return (

        <div className="page-container">

            <h1 className="page-header">
                Merchant Dashboard
            </h1>

            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h2>Profile</h2>
                    <button className="primary-button">
                        Open
                    </button>
                </div>

                <div className="dashboard-card">
                    <h2>Finances</h2>
                    <button className="primary-button">
                        Open
                    </button>
                </div>

            </div>

        </div>
    );
}