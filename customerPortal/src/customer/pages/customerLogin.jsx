import "../styles/customer.css";

export default function CustomerLogin() {

    return (

        <div className="login-page">

            <div className="login-box">

                <h1 className="page-header">Customer Login</h1>

                <div className="form-container">

                    <div className="form-group">
                        <label>Email</label>
                        <input className="text-input" type="email" placeholder="you@example.com" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input className="text-input" type="password" placeholder="••••••••" />
                    </div>

                    <button className="primary-button">
                        Log In
                    </button>

                    <p className="login-switch">
                        Don't have an account? <a>Register here</a>
                    </p>

                </div>

            </div>

        </div>
    );
}
