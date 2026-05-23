import "../styles/customer.css";

export default function CustomerRegister() {

    return (

        <div className="login-page">

            <div className="login-box">

                <h1 className="page-header">Create Account</h1>

                <div className="form-container">

                    <div className="form-group">
                        <label>Name</label>
                        <input className="text-input" type="text" placeholder="Your name" />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input className="text-input" type="email" placeholder="you@example.com" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input className="text-input" type="password" placeholder="••••••••" />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input className="text-input" type="password" placeholder="••••••••" />
                    </div>

                    <button className="primary-button">
                        Register
                    </button>

                    <p className="login-switch">
                        Already have an account? <a>Log in here</a>
                    </p>

                </div>

            </div>

        </div>
    );
}
