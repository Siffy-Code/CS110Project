import "../styles/customer.css";

const PLACEHOLDER_CART = [
    { id: 1, title: "GPU Batch Processing", merchant: "TechRig Solutions", price: 0.12, unit: "/ hr", qty: 10 },
    { id: 2, title: "Malware Scan & Removal", merchant: "SecureBox Co.", price: 25.00, unit: "/ scan", qty: 1 },
];

export default function CustomerCart() {

    const subtotal = PLACEHOLDER_CART.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (

        <div className="page-container">

            <button className="secondary-button back-button">← Continue Shopping</button>

            <h1 className="page-header">Your Cart</h1>

            <div className="cart-list">
                {PLACEHOLDER_CART.map((item) => (
                    <div key={item.id} className="cart-item">

                        <div className="cart-item-left">
                            <span style={{ fontSize: "18px" }}>{item.title}</span>
                            <span className="subtext">{item.merchant}</span>
                            <span className="subtext">${item.price.toFixed(2)} {item.unit}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span className="subtext">Qty: {item.qty}</span>
                            <span style={{ fontSize: "16px" }}>${(item.price * item.qty).toFixed(2)}</span>
                            <button className="secondary-button">Remove</button>
                        </div>

                    </div>
                ))}
            </div>

            <div className="cart-total-box">

                <div className="cart-total-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="cart-total-row">
                    <span>Fees</span>
                    <span>$0.00</span>
                </div>

                <hr style={{ borderColor: "#5a5a5a", margin: "12px 0" }} />

                <div className="cart-total-row" style={{ fontWeight: "bold" }}>
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <button
                    className="primary-button"
                    style={{ width: "100%", marginTop: "15px" }}
                    onClick={() => alert("Payment processing is disabled for this demo.")}
                >
                    Checkout
                </button>

            </div>

        </div>
    );
}
