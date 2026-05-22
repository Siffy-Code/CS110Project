const mongoose = require("mongoose");

// Audit log of every admin action, used by the "Logs" page in the admin
// portal so we can answer "who deactivated this listing and when?".
const adminLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        target: {
            kind: { type: String, default: "" },
            id: { type: mongoose.Schema.Types.ObjectId, default: null },
            label: { type: String, default: "" },
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);
