const Dispute = require("../models/Dispute.model")
const Product = require("../models/product.model")
const OrderItem = require("../models/orderItem.model")
const Order = require("../models/order.model")
const Evidence = require("../models/Evidence.model")       // ✅ was missing — caused crash
const Resolution = require("../models/resolution.model")   // ✅ was missing — caused crash
const QRTracking = require("../models/qrTracking.model")

// ─── Buyer: Raise a dispute on an order item ──────────────────────────────────
async function raiseDispute(req, res) {
    try {
        const data = req.body

        const orderItem = await OrderItem.findById(data.orderItemId)
        if (!orderItem) {
            return res.status(404).json({ message: "Order item not found" })
        }

        const product = await Product.findById(orderItem.productId)
        const order = await Order.findById(orderItem.orderId)

        // Check if a dispute already exists for this order item
        const existing = await Dispute.findOne({ orderItemId: orderItem._id })
        if (existing) {
            return res.status(400).json({ message: "A dispute already exists for this item" })
        }

        const dispute = await Dispute.create({
            orderId: order._id,
            orderItemId: orderItem._id,
            buyerId: order.buyerId,
            sellerId: orderItem.sellerId,
            reason: data.reason,
            fulfillmentType: product.fulfillmentType,
        })

        res.status(201).json({
            message: "Issue Raised Successfully.",
            dispute
        })
    } catch (err) {
        res.status(500).json({
            message: "Some error occurred",
            error: err.message
        })
    }
}

// ─── Admin: Get all disputes ───────────────────────────────────────────────────
async function getAllDisputes(req, res) {
    try {
        const disputes = await Dispute.find()
            .populate("buyerId", "username email")
            .populate("sellerId", "username email storeName")
            .populate("orderId")
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: "Disputes fetched successfully",
            disputes
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// ─── Anyone: Get details of one dispute ───────────────────────────────────────
async function getDisputeDetails(req, res) {
    try {
        const { disputeId } = req.params

        const dispute = await Dispute.findById(disputeId)
            .populate("buyerId", "username email")
            .populate("sellerId", "username email storeName")
            .populate("orderId")
            .populate("adminId", "username")

        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" })
        }

        // ✅ Now Evidence and Resolution are imported so this won't crash
        const evidence = await Evidence.find({ disputeId: disputeId })
        const resolution = await Resolution.findOne({ disputeId: disputeId })
            .populate("resolvedBy", "username")

        // ✅ Fetch QR Tracking Timeline for the specific disputed item
        const tracking = await QRTracking.findOne({ orderItemId: dispute.orderItemId })
            .populate('timeline.scannedBy', 'username role')

        res.status(200).json({
            message: "Dispute details fetched",
            dispute,
            evidence,
            resolution,
            tracking // ✅ Added tracking info
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// ─── Buyer: Get my own disputes ────────────────────────────────────────────────
async function getMyDisputes(req, res) {
    try {
        if (!req.user || !req.user._id) {
            console.error("DEBUG: getMyDisputes failed - req.user._id is missing");
            return res.status(401).json({ message: "User ID missing from token" });
        }

        console.log("DEBUG: Fetching disputes for buyerId:", req.user._id);

        const disputes = await Dispute.find({ buyerId: req.user._id })
            .populate("sellerId", "username storeName")
            .populate("orderId", "totalAmount status createdAt")
            .sort({ createdAt: -1 });

        console.log(`DEBUG: Found ${disputes.length} disputes`);

        // For each dispute, also fetch its resolution if it exists
        const disputesWithResolution = await Promise.all(
            disputes.map(async (d) => {
                try {
                    const resolution = await Resolution.findOne({ disputeId: d._id });
                    return {
                        ...d.toObject(),
                        resolution: resolution || null
                    };
                } catch (mapErr) {
                    console.error(`DEBUG: Error fetching resolution for dispute ${d._id}:`, mapErr.message);
                    return { ...d.toObject(), resolution: null };
                }
            })
        );

        res.status(200).json({
            message: "Your disputes fetched",
            disputes: disputesWithResolution
        });
    } catch (err) {
        console.error("DEBUG: getMyDisputes CRASH:", err.message);
        // Temporarily send the real error message to the frontend for debugging
        res.status(500).json({ message: `SERVER_CRASH: ${err.message}` });
    }
}

// ─── Seller: Respond to a dispute (FBM only) ──────────────────────────────────
async function sellerRespond(req, res) {
    try {
        const { disputeId } = req.params
        const { response } = req.body   // seller's explanation text

        const dispute = await Dispute.findById(disputeId)
        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" })
        }

        // Only FBM disputes go to seller first
        if (dispute.fulfillmentType !== "FBM") {
            return res.status(400).json({ message: "Only FBM disputes need seller response" })
        }

        // Make sure it's the right seller
        if (dispute.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not the seller for this dispute" })
        }

        dispute.sellerResponse = response
        dispute.status = "Under Review"   // moves to admin after seller responds
        await dispute.save()

        res.status(200).json({
            message: "Response submitted. Dispute is now Under Review.",
            dispute
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// ─── Admin: Start reviewing a dispute (Pending -> Under Review) ───────────────
async function startReview(req, res) {
    try {
        const { disputeId } = req.params;
        const dispute = await Dispute.findById(disputeId);

        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        // Only update if it's currently Pending
        if (dispute.status === "Pending") {
            dispute.status = "Under Review";
            dispute.adminId = req.user._id;
            await dispute.save();
        }

        res.status(200).json({
            message: "Dispute is now Under Review",
            dispute
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// ─── Seller: Get disputes for their products ──────────────────────────────────
async function getSellerDisputes(req, res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User ID missing from token" });
        }

        const disputes = await Dispute.find({ sellerId: req.user._id })
            .populate("buyerId", "username email")
            .populate({
                path: "orderItemId",
                populate: {
                    path: "productId",
                    select: "title price images fulfillmentType"
                }
            })
            .populate("orderId", "totalAmount status createdAt")
            .sort({ createdAt: -1 });

        // Include resolutions
        const disputesWithResolution = await Promise.all(
            disputes.map(async (d) => {
                try {
                    const resolution = await Resolution.findOne({ disputeId: d._id });
                    return {
                        ...d.toObject(),
                        resolution: resolution || null
                    };
                } catch (err) {
                    return { ...d.toObject(), resolution: null };
                }
            })
        );

        res.status(200).json({
            message: "Seller disputes fetched successfully",
            disputes: disputesWithResolution
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// ─── Admin: Analyze dispute with QR tracking timeline ──────────────────────────
async function analyzeDisputeWithTracking(req, res) {
    try {
        const { disputeId } = req.params

        const dispute = await Dispute.findById(disputeId)
            .populate("buyerId sellerId orderId")

        const orderItems = await OrderItem.find({ orderId: dispute.orderId })
        
        const trackingRecords = await QRTracking.find({
            orderId: dispute.orderId
        }).populate('timeline.scannedBy', 'username role')

        let analysis = {
            photoTimeline: [],
            recommendation: ""
        }

        for (let tracking of trackingRecords) {
            for (let entry of tracking.timeline) {
                if (entry.photos && entry.photos.length > 0) {
                    analysis.photoTimeline.push({
                        stage: entry.stage,
                        timestamp: entry.timestamp,
                        scannedBy: entry.scannedBy?.username || "Unknown",
                        role: entry.scannedBy?.role || "Unknown",
                        photos: entry.photos,
                        notes: entry.notes
                    })
                }
            }
        }

        if (analysis.photoTimeline.length >= 3) {
            analysis.recommendation = "All handoffs documented. Review photos to determine when damage occurred."
        } else {
            analysis.recommendation = "Incomplete photo documentation. Manual review required."
        }

        res.status(200).json({
            message: "Dispute analysis complete",
            dispute,
            analysis
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = { raiseDispute, getAllDisputes, getDisputeDetails, getMyDisputes, sellerRespond, startReview, getSellerDisputes, analyzeDisputeWithTracking }