const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");
const Merchant = require("../models/Merchant");
const Listing = require("../models/Listing");
const Conversation =
    require("../models/Conversation");
const Message =
    require("../models/Message");
const { requireAuth, requireRole } =
    require("../middleware/auth");

const router = express.Router();

/* ========================================= */
/* AUTH GATE                                 */
/* ========================================= */

router.use(
    requireAuth,
    requireRole("merchant")
);

/* ========================================= */
/* HELPERS                                   */
/* ========================================= */

function isValidId(id) {

    return mongoose.Types.ObjectId.isValid(id);
}

async function findOwnMerchant(req) {

    if (req.user.merchant) {

        return Merchant.findById(
            req.user.merchant
        );
    }

    return Merchant.findOne({
        owner: req.user._id
    });
}

/* ========================================= */
/* MERCHANT PROFILE                          */
/* ========================================= */

router.get("/me", async (req, res) => {

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    res.json({ merchant });
});

router.patch("/me", async (req, res) => {

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    const {
        storeName,
        description,
        contactEmail,
    } = req.body;

    if (storeName !== undefined) {

        merchant.storeName =
            String(storeName).trim();
    }

    if (description !== undefined) {

        merchant.description =
            description;
    }

    if (contactEmail !== undefined) {

        merchant.contactEmail =
            contactEmail;
    }

    await merchant.save();

    res.json({ merchant });
});

/* ========================================= */
/* LISTINGS                                  */
/* ========================================= */

router.get("/listings", async (req, res) => {

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    const listings =
        await Listing.find({
            merchant: merchant._id
        })
        .populate("category", "name slug")
        .sort({ createdAt: -1 });

    res.json({ listings });
});

router.post("/listings", async (req, res) => {

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    if (!merchant.isActive) {

        return res.status(403).json({
            error:
                "Your merchant account is deactivated; contact an admin."
        });
    }

    const {
        title,
        description,
        price,
        category,
        kind,
        imageUrl,
    } = req.body;

    if (
        !title ||
        price === undefined ||
        price === null
    ) {

        return res.status(400).json({
            error:
                "title and price are required"
        });
    }

    if (Number(price) < 0) {

        return res.status(400).json({
            error:
                "price must be >= 0"
        });
    }

    if (
        category &&
        !isValidId(category)
    ) {

        return res.status(400).json({
            error:
                "Invalid category id"
        });
    }

    const listing =
        await Listing.create({

            merchant: merchant._id,

            title:
                title.trim(),

            description:
                description || "",

            price:
                Number(price),

            category:
                category || undefined,

            kind:
                kind === "product"
                    ? "product"
                    : "service",

            imageUrl:
                imageUrl || "",
        });

    res.status(201).json({
        listing
    });
});

router.patch("/listings/:id", async (req, res) => {

    if (!isValidId(req.params.id)) {

        return res.status(400).json({
            error:
                "Invalid listing id"
        });
    }

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    const listing =
        await Listing.findById(
            req.params.id
        );

    if (!listing) {

        return res.status(404).json({
            error:
                "Listing not found"
        });
    }

    if (
        !listing.merchant.equals(
            merchant._id
        )
    ) {

        return res.status(403).json({
            error:
                "You don't own this listing"
        });
    }

    if (
        !listing.isActive &&
        listing.deactivatedBy
    ) {

        return res.status(403).json({
            error:
                "This listing was deactivated by an admin and can't be edited."
        });
    }

    const {
        title,
        description,
        price,
        category,
        kind,
        imageUrl,
        isActive,
    } = req.body;

    if (title !== undefined) {

        listing.title =
            String(title).trim();
    }

    if (description !== undefined) {

        listing.description =
            description;
    }

    if (price !== undefined) {

        if (Number(price) < 0) {

            return res.status(400).json({
                error:
                    "price must be >= 0"
            });
        }

        listing.price =
            Number(price);
    }

    if (category !== undefined) {

        if (
            category &&
            !isValidId(category)
        ) {

            return res.status(400).json({
                error:
                    "Invalid category id"
            });
        }

        listing.category =
            category || undefined;
    }

    if (kind !== undefined) {

        listing.kind =
            kind === "product"
                ? "product"
                : "service";
    }

    if (imageUrl !== undefined) {

        listing.imageUrl =
            imageUrl;
    }

    if (isActive !== undefined) {

        listing.isActive =
            !!isActive;
    }

    await listing.save();

    res.json({ listing });
});

router.delete("/listings/:id", async (req, res) => {

    if (!isValidId(req.params.id)) {

        return res.status(400).json({
            error:
                "Invalid listing id"
        });
    }

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    const listing =
        await Listing.findById(
            req.params.id
        );

    if (!listing) {

        return res.status(404).json({
            error:
                "Listing not found"
        });
    }

    if (
        !listing.merchant.equals(
            merchant._id
        )
    ) {

        return res.status(403).json({
            error:
                "You don't own this listing"
        });
    }

    await listing.deleteOne();

    res.json({ ok: true });
});
/* ========================================= */
/* ORDERS                                    */
/* ========================================= */

router.get("/orders", async (req, res) => {

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    const orders =
        await Order.find({
            merchant: merchant._id
        })
        .populate(
            "customer",
            "name email"
        )
        .populate(
            "listing",
            "title"
        )
        .sort({
            createdAt: -1
        });

    res.json({
        orders
    });



});
router.patch("/orders/:id/status", async (req, res) => {

    if (!isValidId(req.params.id)) {

        return res.status(400).json({
            error: "Invalid order id"
        });
    }

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    const order =
        await Order.findById(
            req.params.id
        );

    if (!order) {

        return res.status(404).json({
            error:
                "Order not found"
        });
    }

    if (
        !order.merchant.equals(
            merchant._id
        )
    ) {

        return res.status(403).json({
            error:
                "You don't own this order"
        });
    }

    const { status } = req.body;

    if (
        ![
            "pending",
            "completed",
            "cancelled",
            "refunded"
        ].includes(status)
    ) {

        return res.status(400).json({
            error:
                "Invalid status"
        });
    }

    order.status = status;

    await order.save();

    res.json({ order });
});

/* ========================================= */
/* CREATE MANUAL ORDER                       */
/* ========================================= */

router.post("/orders", async (req, res) => {

    const merchant =
        await findOwnMerchant(req);

    if (!merchant) {

        return res.status(404).json({
            error:
                "No merchant profile found for this user"
        });
    }

    const {
        customerName,
        customerEmail,
        listingId,
        priceAtPurchase,
        status,
    } = req.body;

    if (
        !customerName ||
        !customerEmail ||
        !listingId
    ) {

        return res.status(400).json({
            error:
                "customerName, customerEmail and listingId are required"
        });
    }

    if (
        !isValidId(listingId)
    ) {

        return res.status(400).json({
            error:
                "Invalid listing id"
        });
    }

    const listing =
        await Listing.findById(
            listingId
        );

    if (!listing) {

        return res.status(404).json({
            error:
                "Listing not found"
        });
    }

    if (
        !listing.merchant.equals(
            merchant._id
        )
    ) {

        return res.status(403).json({
            error:
                "You don't own this listing"
        });
    }

    const customer =
    await User.findOne({
        email:
            customerEmail
                .toLowerCase()
    });

    if (!customer) {

        return res.status(404).json({
            error:
                "Customer account not found. Customer must register first."
        });
    }

    const order =
        await Order.create({

            customer:
                customer._id,

            merchant:
                merchant._id,

            listing:
                listing._id,

            priceAtPurchase:
                priceAtPurchase !== undefined &&
                priceAtPurchase !== ""
                    ? Number(
                        priceAtPurchase
                    )
                    : listing.price,

            status:
                [
                    "pending",
                    "completed",
                    "cancelled",
                    "refunded",
                ].includes(status)
                    ? status
                    : "pending",

            manualEntry:
                true,
        });

    const populatedOrder =
        await Order.findById(
            order._id
        )
        .populate(
            "customer",
            "name email"
        )
        .populate(
            "listing",
            "title"
        );

    res.status(201).json({
        order:
            populatedOrder
    });
});


/* ========================================= */
/* MESSAGES / CONVERSATIONS                  */
/* ========================================= */

router.get(
    "/messages",
    async (req, res) => {

        const merchant =
            await findOwnMerchant(
                req
            );

        if (!merchant) {

            return res
                .status(404)
                .json({
                    error:
                        "No merchant profile found",
                });
        }

        const conversations =
            await Conversation.find({
                merchant:
                    merchant._id,
            })
            .populate(
                "customer",
                "name email"
            )
            .sort({
                updatedAt: -1,
            });

        res.json({
            conversations,
        });
    }
);

router.post(
    "/messages",
    async (req, res) => {

        const merchant =
            await findOwnMerchant(
                req
            );

        if (!merchant) {

            return res
                .status(404)
                .json({
                    error:
                        "No merchant profile found",
                });
        }

        const {
            customerEmail,
            subject,
            content,
        } = req.body;

        if (
            !customerEmail ||
            !subject ||
            !content
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "customerEmail, subject and content are required",
                });
        }

        const customer =
            await User.findOne({
                email:
                    customerEmail.toLowerCase(),
            });

        if (!customer) {

            return res
                .status(404)
                .json({
                    error:
                        "Customer not found",
                });
        }

        const conversation =
            await Conversation.create({
                
                customer:
                    customer._id,

                merchant:
                    merchant._id,

                subject:
                    subject.trim(),
            });

        console.log(
            "Created conversation:",
            conversation
        );
        await Message.create({

            conversation:
                conversation._id,

            messageNumber:
                0,

            direction:
                "FROM",

            content:
                content.trim(),
        });

        const populated =
            await Conversation
                .findById(
                    conversation._id
                )
                .populate(
                    "customer",
                    "name email"
                );

        res.status(201).json({
            conversation:
                populated,
        });
    }
);
router.get(
    "/messages/:id",
    async (req, res) => {

        if (
            !isValidId(
                req.params.id
            )
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "Invalid conversation id",
                });
        }

        const merchant =
            await findOwnMerchant(
                req
            );

        const conversation =
            await Conversation.findById(
                req.params.id
            )
            .populate(
                "customer",
                "name email"
            );

        if (!conversation) {

            return res
                .status(404)
                .json({
                    error:
                        "Conversation not found",
                });
        }

        if (
            !conversation.merchant.equals(
                merchant._id
            )
        ) {

            return res
                .status(403)
                .json({
                    error:
                        "Unauthorized",
                });
        }

        const messages =
            await Message.find({
                conversation:
                    conversation._id,
            }).sort({
                messageNumber: 1,
            });

        res.json({
            conversation,
            messages,
        });
    }
);
router.post(
    "/messages/:id",
    async (req, res) => {

        if (
            !isValidId(
                req.params.id
            )
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "Invalid conversation id",
                });
        }

        const merchant =
            await findOwnMerchant(
                req
            );

        const conversation =
            await Conversation.findById(
                req.params.id
            );

        if (!conversation) {

            return res
                .status(404)
                .json({
                    error:
                        "Conversation not found",
                });
        }

        if (
            !conversation.merchant.equals(
                merchant._id
            )
        ) {

            return res
                .status(403)
                .json({
                    error:
                        "Unauthorized",
                });
        }

        const { content } =
            req.body;

        if (
            !content ||
            !content.trim()
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "Message content required",
                });
        }

        const nextNumber =
            await Message.countDocuments(
                {
                    conversation:
                        conversation._id,
                }
            );

        const message =
            await Message.create({

                conversation:
                    conversation._id,

                messageNumber:
                    nextNumber,

                direction:
                    "FROM",

                content:
                    content.trim(),
            });

        res.status(201).json({
            message,
        });
    }
);
/* ========================================= */
/* ARCHIVE / UNARCHIVE CONVERSATION          */
/* ========================================= */

router.patch(
    "/messages/:id/archive",
    async (req, res) => {

        if (
            !isValidId(
                req.params.id
            )
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "Invalid conversation id",
                });
        }

        const merchant =
            await findOwnMerchant(
                req
            );

        const conversation =
            await Conversation.findById(
                req.params.id
            );

        if (!conversation) {

            return res
                .status(404)
                .json({
                    error:
                        "Conversation not found",
                });
        }

        if (
            !conversation.merchant.equals(
                merchant._id
            )
        ) {

            return res
                .status(403)
                .json({
                    error:
                        "Unauthorized",
                });
        }

        const { archived } =
            req.body;

        conversation.archived =
            !!archived;

        await conversation.save();

        res.json({
            conversation,
        });
    }
);
module.exports = router;