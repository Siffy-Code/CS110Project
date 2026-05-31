const mongoose =
    require("mongoose");

const messageSchema =
    new mongoose.Schema(
        {
            conversation: {
                type:
                    mongoose.Schema
                        .Types
                        .ObjectId,
                ref:
                    "Conversation",
                required: true,
            },

            messageNumber: {
                type: Number,
                required: true,
            },

            direction: {
                type: String,
                enum: [
                    "TO",
                    "FROM",
                ],
                required: true,
            },

            content: {
                type: String,
                required: true,
                maxlength: 256,
            },
        },
        {
            timestamps: true,
        }
    );

module.exports =
    mongoose.model(
        "Message",
        messageSchema
    );