const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["customer", "merchant", "admin"],
            default: "customer",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Populated only when role === "merchant".
        merchant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            default: null,
        },
        // Populated only when role === "customer".
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Merchant",
            },
        ],
    },
    { timestamps: true }
);

userSchema.methods.setPassword = async function (plain) {
    this.passwordHash = await bcrypt.hash(plain, 10);
};

userSchema.methods.checkPassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toSafeJSON = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        isActive: this.isActive,
        merchant: this.merchant,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

module.exports = mongoose.model("User", userSchema);