const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        merchant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        imageUrl: {
            type: String,
            default: "",
        },
        // "service" matches the project brief; we still call them listings.
        kind: {
            type: String,
            enum: ["service", "product"],
            default: "service",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Set when an admin disables a listing so we can show why on the UI.
        deactivatedReason: {
            type: String,
            default: "",
        },
        deactivatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
