const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
}

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "name, email and password are required" });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: "Email already registered" });
        }

        // Customers/merchants can self-register; admins must be created via seed
        // or another admin (see /api/admin/users), never from public signup.
        const safeRole = role === "merchant" ? "merchant" : "customer";

        const user = new User({ name, email: email.toLowerCase(), role: safeRole });
        await user.setPassword(password);
        await user.save();

        return res.status(201).json({
            token: signToken(user),
            user: user.toSafeJSON(),
        });
    } catch (err) {
        console.error("register error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: "Account has been deactivated" });
        }

        const ok = await user.checkPassword(password);
        if (!ok) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        return res.json({
            token: signToken(user),
            user: user.toSafeJSON(),
        });
    } catch (err) {
        console.error("login error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

router.get("/me", requireAuth, (req, res) => {
    return res.json({ user: req.user.toSafeJSON() });
});

module.exports = router;
