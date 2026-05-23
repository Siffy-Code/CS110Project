import "../styles/customer.css";

const PLACEHOLDER_LISTINGS = [
    { id: 1, title: "GPU Batch Processing", price: "$0.12 / hr" },
    { id: 2, title: "Dataset ETL Pipeline", price: "$0.20 / hr" },
    { id: 3, title: "Overnight CPU Rental", price: "$0.05 / hr" },
];

const PLACEHOLDER_REVIEWS = [
    { id: 1, author: "customer123", rating: "★★★★★", comment: "Fast turnaround, great service." },
    { id: 2, author: "poweruser99", rating: "★★★★☆", comment: "Good results, communication was solid." },
];

export default function CustomerMerchantProfile() {

    return (

        <div className="page-container">

            <button className="secondary-button back-button">← Back to Browse</button>

            <div className="merchant-banner">
                🏪 TechRig Solutions
            </div>

            <div className="two-column-layout">

                <div className="left-panel">

                    <div className="merchant-info-card">
                        <h2 className="section-header">About</h2>
                        <p className="subtext">High-performance compute rentals for data pipelines, ML training, and batch jobs.</p>
                        <p className="subtext">Contact: merchant@techrigs.com</p>
                    </div>

                    <div className="merchant-info-card">
                        <h2 className="section-header">Rating</h2>
                        <div className="rating-row">
                            <span className="stars-placeholder">★★★★☆</span>
                            <span className="subtext">4.2 / 5</span>
                        </div>
                        <p className="subtext">Based on 24 reviews</p>
                    </div>

                    <button className="primary-button">Message Merchant</button>

                </div>

                <div className="right-panel">

                    <h2 className="section-header">Listings</h2>

                    <div className="listings-grid" style={{ marginBottom: "30px" }}>
                        {PLACEHOLDER_LISTINGS.map((listing) => (
                            <div key={listing.id} className="listing-card">

                                <div className="listing-image">No Image</div>

                                <div className="listing-content">
                                    <div className="listing-title">{listing.title}</div>
                                    <div className="listing-price">{listing.price}</div>
                                    <div style={{ marginTop: "10px" }}>
                                        <button className="secondary-button">Add to Cart</button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    <h2 className="section-header">Reviews</h2>

                    <div className="data-list">
                        {PLACEHOLDER_REVIEWS.map((review) => (
                            <div key={review.id} className="data-row">
                                <div className="data-row-left">
                                    <span className="data-row-title">{review.rating} — {review.author}</span>
                                    <span className="data-row-subtext">{review.comment}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <h2 className="section-header">Leave a Review</h2>
                        <div className="form-container">
                            <div className="form-group">
                                <label>Rating</label>
                                <select className="dropdown-input">
                                    <option>★★★★★ — 5</option>
                                    <option>★★★★☆ — 4</option>
                                    <option>★★★☆☆ — 3</option>
                                    <option>★★☆☆☆ — 2</option>
                                    <option>★☆☆☆☆ — 1</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea className="text-area" placeholder="Share your experience..." />
                            </div>
                            <button className="primary-button">Submit Review</button>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}
