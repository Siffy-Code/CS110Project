const mongoose = require("mongoose");

const conversationSchema =
    new mongoose.Schema(
        {
            customer: {
                type:
                    mongoose.Schema
                        .Types
                        .ObjectId,
                ref: "User",
                required: true,
            },

            merchant: {
                type:
                    mongoose.Schema
                        .Types
                        .ObjectId,
                ref: "Merchant",
                required: true,
            },

            subject: {
                type: String,
                required: true,
                maxlength: 100,
            },
            archived: {
                type: Boolean,
                default: false,
            },
        },
        {
            timestamps: true,
        }
    );

module.exports =
    mongoose.model(
        "Conversation",
        conversationSchema
    );