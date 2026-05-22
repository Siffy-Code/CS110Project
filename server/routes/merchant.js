const express = require("express");
const mongoose = require("mongoose");

const Merchant = require("../models/Merchant");
const Listing = require("../models/Listing");

const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Every endpoint here is for the logged-in merchant managing their own data.
router.use(requireAuth, requireRole("merchant"));

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Looks up the Merchant doc owned by the current user, or returns null.
async function findOwnMerchant(req) {
    if (req.user.merchant) {
        return Merchant.findById(req.user.merchant);
    }
    return Merchant.findOne({ owner: req.user._id });
}

/* ------------------------------------------------------------------ */
/* GET /api/merchant/me   -> the merchant profile owned by this user  */
/* ------------------------------------------------------------------ */

router.get("/me", async (req, res) => {
    const merchant = await findOwnMerchant(req);
    if (!merchant) {
        return res.status(404).json({ error: "No merchant profile found for this user" });
    }
    res.json({ merchant });
});

/* ------------------------------------------------------------------ */
/* Listings owned by this merchant                                    */
/* ------------------------------------------------------------------ */

router.get("/listings", async (req, res) => {
    const merchant = await findOwnMerchant(req);
    if (!merchant) {
        return res.status(404).json({ error: "No merchant profile found for this user" });
    }

    const listings = await Listing.find({ merchant: merchant._id })
        .populate("category", "name slug")
        .sort({ createdAt: -1 });

    res.json({ listings });
});

router.post("/listings", async (req, res) => {
    const merchant = await findOwnMerchant(req);
    if (!merchant) {
        return res.status(404).json({ error: "No merchant profile found for this user" });
    }
    if (!merchant.isActive) {
        return res.status(403).json({
            error: "Your merchant account is deactivated; contact an admin.",
        });
    }

    const { title, description, price, category, kind, imageUrl } = req.body;

    if (!title || price === undefined || price === null) {
        return res.status(400).json({ error: "title and price are required" });
    }
    if (Number(price) < 0) {
        return res.status(400).json({ error: "price must be >= 0" });
    }
    if (category && !isValidId(category)) {
        return res.status(400).json({ error: "Invalid category id" });
    }

    const listing = await Listing.create({
        merchant: merchant._id,
        title: title.trim(),
        description: description || "",
        price: Number(price),
        category: category || undefined,
        kind: kind === "product" ? "product" : "service",
        imageUrl: imageUrl || "",
    });

    res.status(201).json({ listing });
});

router.patch("/listings/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid listing id" });
    }

    const merchant = await findOwnMerchant(req);
    if (!merchant) {
        return res.status(404).json({ error: "No merchant profile found for this user" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (!listing.merchant.equals(merchant._id)) {
        return res.status(403).json({ error: "You don't own this listing" });
    }

    // Merchants can't undo an admin deactivation; they have to ask the admin.
    if (!listing.isActive && listing.deactivatedBy) {
        return res.status(403).json({
            error: "This listing was deactivated by an admin and can't be edited.",
        });
    }

    const { title, description, price, category, kind, imageUrl, isActive } =
        req.body;

    if (title !== undefined) listing.title = String(title).trim();
    if (description !== undefined) listing.description = description;
    if (price !== undefined) {
        if (Number(price) < 0) {
            return res.status(400).json({ error: "price must be >= 0" });
        }
        listing.price = Number(price);
    }
    if (category !== undefined) {
        if (category && !isValidId(category)) {
            return res.status(400).json({ error: "Invalid category id" });
        }
        listing.category = category || undefined;
    }
    if (kind !== undefined) {
        listing.kind = kind === "product" ? "product" : "service";
    }
    if (imageUrl !== undefined) listing.imageUrl = imageUrl;

    // A merchant can hide / show their own listing (as long as an admin
    // didn't disable it for them).
    if (isActive !== undefined) {
        listing.isActive = !!isActive;
    }

    await listing.save();
    res.json({ listing });
});

router.delete("/listings/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid listing id" });
    }

    const merchant = await findOwnMerchant(req);
    if (!merchant) {
        return res.status(404).json({ error: "No merchant profile found for this user" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (!listing.merchant.equals(merchant._id)) {
        return res.status(403).json({ error: "You don't own this listing" });
    }

    await listing.deleteOne();
    res.json({ ok: true });
});

module.exports = router;
