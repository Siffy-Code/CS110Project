const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");
const Merchant = require("../models/Merchant");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { requireAuth, requireRole } =
    require("../middleware/auth");

const router = express.Router();

/* ========================================= */
/* AUTH GATE                                 */
/* ========================================= */

router.use(
    requireAuth,
    requireRole("customer")
);

/* ========================================= */
/* HELPERS                                   */
/* ========================================= */

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

/* ========================================= */
/* ORDERS                                    */
/* ========================================= */

router.get("/orders", async (req, res) => {

    const orders =
        await Order.find({
            customer: req.user._id,
        })
        .populate("listing", "title")
        .populate("merchant", "storeName")
        .sort({ createdAt: -1 });

    res.json({ orders });
});

/* ========================================= */
/* MESSAGES / CONVERSATIONS                  */
/* ========================================= */

router.get("/messages", async (req, res) => {

    const conversations =
        await Conversation.find({
            customer: req.user._id,
        })
        .populate("merchant", "storeName")
        .sort({ updatedAt: -1 });

    res.json({ conversations });
});

router.post("/messages", async (req, res) => {

    const {
        merchantId,
        subject,
        content,
    } = req.body;

    if (
        !merchantId ||
        !subject ||
        !content
    ) {

        return res.status(400).json({
            error:
                "merchantId, subject and content are required",
        });
    }

    if (!isValidId(merchantId)) {

        return res.status(400).json({
            error: "Invalid merchant id",
        });
    }

    const merchant =
        await Merchant.findById(merchantId);

    if (!merchant) {

        return res.status(404).json({
            error: "Merchant not found",
        });
    }

    const conversation =
        await Conversation.create({
            customer: req.user._id,
            merchant: merchant._id,
            subject: subject.trim(),
        });

    await Message.create({
        conversation: conversation._id,
        messageNumber: 0,
        direction: "TO",
        content: content.trim(),
    });

    const populated =
        await Conversation
            .findById(conversation._id)
            .populate("merchant", "storeName");

    res.status(201).json({
        conversation: populated,
    });
});

router.get("/messages/:id", async (req, res) => {

    if (!isValidId(req.params.id)) {

        return res.status(400).json({
            error: "Invalid conversation id",
        });
    }

    const conversation =
        await Conversation.findById(req.params.id)
            .populate("merchant", "storeName");

    if (!conversation) {

        return res.status(404).json({
            error: "Conversation not found",
        });
    }

    if (
        !conversation.customer.equals(
            req.user._id
        )
    ) {

        return res.status(403).json({
            error: "Unauthorized",
        });
    }

    const messages =
        await Message.find({
            conversation: conversation._id,
        }).sort({ messageNumber: 1 });

    res.json({ conversation, messages });
});

router.post("/messages/:id", async (req, res) => {

    if (!isValidId(req.params.id)) {

        return res.status(400).json({
            error: "Invalid conversation id",
        });
    }

    const conversation =
        await Conversation.findById(req.params.id);

    if (!conversation) {

        return res.status(404).json({
            error: "Conversation not found",
        });
    }

    if (
        !conversation.customer.equals(
            req.user._id
        )
    ) {

        return res.status(403).json({
            error: "Unauthorized",
        });
    }

    const { content } = req.body;

    if (!content || !content.trim()) {

        return res.status(400).json({
            error: "Message content required",
        });
    }

    const nextNumber =
        await Message.countDocuments({
            conversation: conversation._id,
        });

    const message =
        await Message.create({
            conversation: conversation._id,
            messageNumber: nextNumber,
            direction: "TO",
            content: content.trim(),
        });

    await Conversation.findByIdAndUpdate(
        conversation._id,
        { updatedAt: new Date() }
    );

    res.status(201).json({ message });
});

/* ========================================= */
/* FAVORITES                                 */
/* ========================================= */

router.get("/favorites", async (req, res) => {

    const user =
        await User.findById(req.user._id);

    if (
        !user.favorites ||
        user.favorites.length === 0
    ) {

        return res.json({ favorites: [] });
    }

    const favorites =
        await Merchant.find({
            _id: { $in: user.favorites },
        }).select("storeName description");

    res.json({ favorites });
});

router.post("/favorites", async (req, res) => {

    const { merchantId } = req.body;

    if (!merchantId || !isValidId(merchantId)) {

        return res.status(400).json({
            error: "Valid merchantId required",
        });
    }

    const merchant =
        await Merchant.findById(merchantId);

    if (!merchant) {

        return res.status(404).json({
            error: "Merchant not found",
        });
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { favorites: merchantId } }
    );

    res.json({ ok: true });
});

router.delete("/favorites/:merchantId", async (req, res) => {

    if (!isValidId(req.params.merchantId)) {

        return res.status(400).json({
            error: "Invalid merchant id",
        });
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { favorites: req.params.merchantId } }
    );

    res.json({ ok: true });
});

module.exports = router;