const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const Merchant = require("../models/Merchant");
const Listing = require("../models/Listing");
const Category = require("../models/Category");
const Order = require("../models/Order");
const AdminLog = require("../models/AdminLog");

const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Every admin endpoint goes through this gate.
router.use(requireAuth, requireRole("admin"));

async function logAction(adminUser, action, target = {}, details = {}) {
    try {
        await AdminLog.create({
            admin: adminUser._id,
            action,
            target,
            details,
        });
    } catch (err) {
        console.error("Failed to write AdminLog:", err.message);
    }
}

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function slugify(str) {
    return String(str)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/* ------------------------------------------------------------------ */
/* Dashboard stats                                                    */
/* ------------------------------------------------------------------ */

router.get("/stats", async (req, res) => {
    const [users, merchants, listings, activeListings, orders, categories] =
        await Promise.all([
            User.countDocuments(),
            Merchant.countDocuments(),
            Listing.countDocuments(),
            Listing.countDocuments({ isActive: true }),
            Order.countDocuments(),
            Category.countDocuments(),
        ]);

    res.json({
        users,
        merchants,
        listings,
        activeListings,
        inactiveListings: listings - activeListings,
        orders,
        categories,
    });
});

/* ------------------------------------------------------------------ */
/* Users                                                              */
/* ------------------------------------------------------------------ */

router.get("/users", async (req, res) => {
    const { role, q } = req.query;
    const filter = {};

    if (role && ["customer", "merchant", "admin"].includes(role)) {
        filter.role = role;
    }
    if (q) {
        const re = new RegExp(q, "i");
        filter.$or = [{ name: re }, { email: re }];
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ users: users.map((u) => u.toSafeJSON()) });
});

router.get("/users/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user: user.toSafeJSON() });
});

router.patch("/users/:id/deactivate", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user._id.equals(req.user._id)) {
        return res.status(400).json({ error: "You can't deactivate your own admin account" });
    }

    user.isActive = false;
    await user.save();

    await logAction(req.user, "user.deactivate", {
        kind: "user",
        id: user._id,
        label: user.email,
    });

    res.json({ user: user.toSafeJSON() });
});

router.patch("/users/:id/reactivate", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = true;
    await user.save();

    await logAction(req.user, "user.reactivate", {
        kind: "user",
        id: user._id,
        label: user.email,
    });

    res.json({ user: user.toSafeJSON() });
});

router.post("/users/:id/reset-password", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid user id" });
    }

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "newPassword must be at least 6 characters" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.setPassword(newPassword);
    await user.save();

    await logAction(req.user, "user.reset_password", {
        kind: "user",
        id: user._id,
        label: user.email,
    });

    res.json({ ok: true });
});

router.delete("/users/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user._id.equals(req.user._id)) {
        return res.status(400).json({ error: "You can't delete your own admin account" });
    }

    await user.deleteOne();

    await logAction(req.user, "user.delete", {
        kind: "user",
        id: user._id,
        label: user.email,
    });

    res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/* Merchants                                                          */
/* ------------------------------------------------------------------ */

router.get("/merchants", async (req, res) => {
    const merchants = await Merchant.find()
        .populate("owner", "name email role isActive")
        .sort({ createdAt: -1 });

    res.json({ merchants });
});

router.get("/merchants/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid merchant id" });
    }

    const merchant = await Merchant.findById(req.params.id).populate(
        "owner",
        "name email role isActive"
    );
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    const listings = await Listing.find({ merchant: merchant._id })
        .populate("category", "name slug")
        .sort({ createdAt: -1 });

    res.json({ merchant, listings });
});

router.patch("/merchants/:id/deactivate", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid merchant id" });
    }

    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    merchant.isActive = false;
    await merchant.save();

    // Cascade: hide every listing this merchant owns.
    const result = await Listing.updateMany(
        { merchant: merchant._id, isActive: true },
        {
            isActive: false,
            deactivatedReason: "Merchant deactivated by admin",
            deactivatedBy: req.user._id,
        }
    );

    await logAction(
        req.user,
        "merchant.deactivate",
        { kind: "merchant", id: merchant._id, label: merchant.storeName },
        { listingsHidden: result.modifiedCount }
    );

    res.json({ merchant, listingsHidden: result.modifiedCount });
});

router.patch("/merchants/:id/reactivate", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid merchant id" });
    }

    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    merchant.isActive = true;
    await merchant.save();

    await logAction(req.user, "merchant.reactivate", {
        kind: "merchant",
        id: merchant._id,
        label: merchant.storeName,
    });

    res.json({ merchant });
});

/* ------------------------------------------------------------------ */
/* Listings                                                           */
/* ------------------------------------------------------------------ */

router.get("/listings", async (req, res) => {
    const { merchant, active, q } = req.query;
    const filter = {};

    if (merchant && isValidId(merchant)) {
        filter.merchant = merchant;
    }
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;
    if (q) {
        filter.title = new RegExp(q, "i");
    }

    const listings = await Listing.find(filter)
        .populate("merchant", "storeName isActive")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(500);

    res.json({ listings });
});

router.post("/listings", async (req, res) => {
    const { merchant, title, description, price, category, kind, imageUrl } =
        req.body;

    if (!merchant || !isValidId(merchant)) {
        return res.status(400).json({ error: "Valid merchant id is required" });
    }
    if (!title || price === undefined || price === null) {
        return res.status(400).json({ error: "title and price are required" });
    }
    if (Number(price) < 0) {
        return res.status(400).json({ error: "price must be >= 0" });
    }
    if (category && !isValidId(category)) {
        return res.status(400).json({ error: "Invalid category id" });
    }

    const merchantDoc = await Merchant.findById(merchant);
    if (!merchantDoc) {
        return res.status(404).json({ error: "Merchant not found" });
    }

    const listing = await Listing.create({
        merchant: merchantDoc._id,
        title: String(title).trim(),
        description: description || "",
        price: Number(price),
        category: category || undefined,
        kind: kind === "product" ? "product" : "service",
        imageUrl: imageUrl || "",
    });

    await logAction(
        req.user,
        "listing.create",
        { kind: "listing", id: listing._id, label: listing.title },
        { merchant: merchantDoc.storeName }
    );

    res.status(201).json({ listing });
});

router.patch("/listings/:id/deactivate", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid listing id" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    listing.isActive = false;
    listing.deactivatedReason = req.body.reason || "Deactivated by admin";
    listing.deactivatedBy = req.user._id;
    await listing.save();

    await logAction(
        req.user,
        "listing.deactivate",
        { kind: "listing", id: listing._id, label: listing.title },
        { reason: listing.deactivatedReason }
    );

    res.json({ listing });
});

router.patch("/listings/:id/reactivate", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid listing id" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    listing.isActive = true;
    listing.deactivatedReason = "";
    listing.deactivatedBy = null;
    await listing.save();

    await logAction(req.user, "listing.reactivate", {
        kind: "listing",
        id: listing._id,
        label: listing.title,
    });

    res.json({ listing });
});

router.delete("/listings/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid listing id" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    await listing.deleteOne();

    await logAction(req.user, "listing.delete", {
        kind: "listing",
        id: listing._id,
        label: listing.title,
    });

    res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/* Categories                                                         */
/* ------------------------------------------------------------------ */

router.get("/categories", async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
});

router.post("/categories", async (req, res) => {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ error: "name is required" });
    }

    const slug = slugify(name);
    const existing = await Category.findOne({
        $or: [{ name: name.trim() }, { slug }],
    });
    if (existing) {
        return res.status(409).json({ error: "Category already exists" });
    }

    const category = await Category.create({
        name: name.trim(),
        slug,
        description: description || "",
    });

    await logAction(req.user, "category.create", {
        kind: "category",
        id: category._id,
        label: category.name,
    });

    res.status(201).json({ category });
});

router.patch("/categories/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid category id" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const { name, description } = req.body;

    if (name && name.trim()) {
        category.name = name.trim();
        category.slug = slugify(name);
    }
    if (description !== undefined) {
        category.description = description;
    }

    await category.save();

    await logAction(req.user, "category.update", {
        kind: "category",
        id: category._id,
        label: category.name,
    });

    res.json({ category });
});

router.delete("/categories/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid category id" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Detach the category from any listings using it instead of breaking them.
    await Listing.updateMany(
        { category: category._id },
        { $unset: { category: "" } }
    );

    await category.deleteOne();

    await logAction(req.user, "category.delete", {
        kind: "category",
        id: category._id,
        label: category.name,
    });

    res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/* Admin action log                                                   */
/* ------------------------------------------------------------------ */

router.get("/logs", async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const logs = await AdminLog.find()
        .populate("admin", "name email")
        .sort({ createdAt: -1 })
        .limit(limit);

    res.json({ logs });
});

module.exports = router;
