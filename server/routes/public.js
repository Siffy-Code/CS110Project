const express = require("express");

const Listing = require("../models/Listing");
const Category = require("../models/Category");

// Read-only endpoints used by the merchant/customer portals so they can show
// only what's currently active. Admins use /api/admin/* instead.
const router = express.Router();

router.get("/listings", async (req, res) => {
    const { category, merchant } = req.query;
    const filter = { isActive: true };

    if (category) {
        const cat = await Category.findOne({ slug: category });
        if (cat) filter.category = cat._id;
    }
    if (merchant) filter.merchant = merchant;

    const listings = await Listing.find(filter)
        .populate("merchant", "storeName isActive")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(200);

    // Hide listings whose merchant is no longer active.
    const visible = listings.filter(
        (l) => !l.merchant || l.merchant.isActive !== false
    );

    res.json({ listings: visible });
});

router.get("/categories", async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
});

module.exports = router;