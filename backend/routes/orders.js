const express = require('express');
const router = express.Router();
const Order = require('../db/Order');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { sendResponse, sendError, sendNotFound, sendUnauthorized } = require('../utils/response');

// Create new order
router.post("/", verifyToken, async (req, res) => {
    try {
        const order = new Order({
            userId: req.user._id,
            products: req.body.products,
            amount: req.body.amount,
            address: req.body.address,
            status: "pending"
        });

        const result = await order.save();
        sendResponse(res, result, 201);
    } catch (error) {
        sendError(res, "Error creating order");
    }
});

// Get user's orders
router.get("/user", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        sendResponse(res, orders);
    } catch (error) {
        sendError(res, "Error fetching orders");
    }
});

// Get all orders (admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        sendResponse(res, orders);
    } catch (error) {
        sendError(res, "Error fetching orders");
    }
});

// Update order status (admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status: req.body.status } },
            { new: true }
        );

        if (!order) {
            return sendNotFound(res, "Order not found");
        }

        sendResponse(res, order);
    } catch (error) {
        sendError(res, "Error updating order");
    }
});

// Get single order
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return sendNotFound(res, "Order not found");
        }

        if (req.user.role !== 'admin' && order.userId.toString() !== req.user._id.toString()) {
            return sendUnauthorized(res, "Not authorized to view this order");
        }

        sendResponse(res, order);
    } catch (error) {
        sendError(res, "Error fetching order");
    }
});

module.exports = router; 