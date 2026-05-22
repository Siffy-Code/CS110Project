/**
 * Wipes the database and inserts a small set of sample documents so the admin
 * portal has something interesting to look at.
 *
 * Run with:  npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("../config/db");

const User = require("../models/User");
const Merchant = require("../models/Merchant");
const Category = require("../models/Category");
const Listing = require("../models/Listing");
const Order = require("../models/Order");
const AdminLog = require("../models/AdminLog");

function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function makeUser({ name, email, password, role = "customer" }) {
    const u = new User({ name, email, role });
    await u.setPassword(password);
    await u.save();
    return u;
}

async function run() {
    await connectDB();

    console.log("Clearing collections...");
    await Promise.all([
        User.deleteMany({}),
        Merchant.deleteMany({}),
        Category.deleteMany({}),
        Listing.deleteMany({}),
        Order.deleteMany({}),
        AdminLog.deleteMany({}),
    ]);

    console.log("Creating users...");
    const admin = await makeUser({
        name: "Admin User",
        email: "admin@cs110.test",
        password: "admin123",
        role: "admin",
    });

    const merchantUserA = await makeUser({
        name: "Maria Merchant",
        email: "maria@shop.test",
        password: "merchant123",
        role: "merchant",
    });

    const merchantUserB = await makeUser({
        name: "Bob Merchant",
        email: "bob@shop.test",
        password: "merchant123",
        role: "merchant",
    });

    const customerA = await makeUser({
        name: "Carlos Customer",
        email: "carlos@cs110.test",
        password: "customer123",
    });

    const customerB = await makeUser({
        name: "Dana Customer",
        email: "dana@cs110.test",
        password: "customer123",
    });

    console.log("Creating merchants...");
    const merchantA = await Merchant.create({
        owner: merchantUserA._id,
        storeName: "Maria's Lawn Care",
        description: "Mowing, hedge trimming, and yard cleanup.",
        contactEmail: merchantUserA.email,
    });
    merchantUserA.merchant = merchantA._id;
    await merchantUserA.save();

    const merchantB = await Merchant.create({
        owner: merchantUserB._id,
        storeName: "Bob's Bike Repair",
        description: "Tune-ups, flat fixes, and brake jobs.",
        contactEmail: merchantUserB.email,
    });
    merchantUserB.merchant = merchantB._id;
    await merchantUserB.save();

    console.log("Creating categories...");
    const categoryNames = [
        "Home Services",
        "Repair",
        "Tutoring",
        "Delivery",
        "Cleaning",
    ];
    const categories = await Category.insertMany(
        categoryNames.map((n) => ({
            name: n,
            slug: slugify(n),
            description: `${n} category`,
        }))
    );

    const categoryByName = Object.fromEntries(
        categories.map((c) => [c.name, c])
    );

    console.log("Creating listings...");
    const listings = await Listing.insertMany([
        {
            merchant: merchantA._id,
            title: "Standard Lawn Mow",
            description: "Cut, edge, and blow up to 1/4 acre.",
            price: 45,
            category: categoryByName["Home Services"]._id,
            kind: "service",
        },
        {
            merchant: merchantA._id,
            title: "Hedge Trimming",
            description: "Per-hour trimming with all clippings hauled away.",
            price: 60,
            category: categoryByName["Home Services"]._id,
            kind: "service",
        },
        {
            merchant: merchantB._id,
            title: "Bike Tune-up",
            description: "Full drivetrain clean + brake adjust.",
            price: 75,
            category: categoryByName["Repair"]._id,
            kind: "service",
        },
        {
            merchant: merchantB._id,
            title: "Flat Tire Fix",
            description: "New tube and quick patch on the spot.",
            price: 20,
            category: categoryByName["Repair"]._id,
            kind: "service",
        },
    ]);

    console.log("Creating sample orders...");
    await Order.insertMany([
        {
            customer: customerA._id,
            merchant: merchantA._id,
            listing: listings[0]._id,
            priceAtPurchase: listings[0].price,
            status: "completed",
        },
        {
            customer: customerB._id,
            merchant: merchantB._id,
            listing: listings[2]._id,
            priceAtPurchase: listings[2].price,
            status: "pending",
        },
    ]);

    console.log("Creating sample admin log...");
    await AdminLog.create({
        admin: admin._id,
        action: "seed.run",
        target: { kind: "system", label: "Database seeded" },
        details: { listings: listings.length, categories: categories.length },
    });

    console.log("\nDone. Sample accounts:");
    console.log("  admin@cs110.test    / admin123       (admin)");
    console.log("  maria@shop.test     / merchant123    (merchant)");
    console.log("  bob@shop.test       / merchant123    (merchant)");
    console.log("  carlos@cs110.test   / customer123    (customer)");
    console.log("  dana@cs110.test     / customer123    (customer)");

    await mongoose.disconnect();
    process.exit(0);
}

run().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
