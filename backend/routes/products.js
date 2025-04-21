const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../db/Products');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { sendResponse, sendError, sendNotFound } = require('../utils/response');

const upload = multer();

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        sendResponse(res, products || []);
    } catch (error) {
        sendError(res, "Error loading product list");
    }
});

// Get cart products
router.get("/cart-products", async (req, res) => {
    try {
        const { ids } = req.query; // Get the IDs from query parameters
        const productIds = Array.isArray(ids) ? ids : [ids]; // Convert to an array if single ID is passed
    
        // Find products by matching the IDs
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length > 0) {
            sendResponse(res, products);
        } else {
            sendResponse(res, { result: "No Products Found" });
        }
    } catch (error) {
        sendError(res, "Error loading product list");
    }
});

// Get single product
router.get("/:id", async (req, res) => {
    try {
        // const result = await Product.findOne({ _id: req.params.id });
        const product = await Product.findById(req.params.id);
        if (product) {
            sendResponse(res, product);
        } else {
            sendResponse(res, { result: "No Product Found" });
        }
    } catch (error) {
        sendError(res, "Error loading product");
    }
});

// Add product (admin only), upload.single("productPicture")
router.post("/", verifyToken, isAdmin, upload.array("productPictures", 5), async (req, res) => {
    try {
        const files = req.files;
        if (!files) {
            return sendError(res, "No file uploaded", 400);
        }

        const jsonData = JSON.parse(req.body.jsonData);
        const imageArray = files.map(file => file.buffer.toString("base64"));

        const product = new Product({
            name: jsonData.name,
            price: jsonData.price,
            category: jsonData.category,
            userId: jsonData.userId,
            company: jsonData.company,
            description: jsonData.description,
            rating: jsonData.rating,
            productPictures: imageArray,
            discountPercentage: jsonData.discountPercentage,
            discountPrice: jsonData.discountPrice
        });

        const result = await product.save();
        sendResponse(res, result, 201);
    } catch (error) {
        console.error(error);
        sendError(res, "Error adding product");
    }
});

// Update product (admin only)
router.put("/:id", verifyToken, isAdmin, upload.array("productPictures", 5), async (req, res) => {
    try {
        const files = req.files;
        const jsonData = JSON.parse(req.body.jsonData);

        const updateData = { ...jsonData };
        if (files) {
            updateData.productPictures = files.map(file => file.buffer.toString("base64"));
        }

        const result = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (result) {
            sendResponse(res, result);
        } else {
            sendResponse(res, { result: "No Product updated" });
        }
    } catch (error) {
        sendError(res, "Error updating product");
    }
});

// Delete product (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        
    } catch (error) {
        sendError(res, "Error deleting product");
    }
});

// Search products
router.get("/search/:key", async (req, res) => {
    try {
        const key = req.params.key;
        const products = await Product.find({
            $or: [
                { name: { $regex: key, $options: 'i' } },
                { category: { $regex: key, $options: 'i' } },
                { description: { $regex: key, $options: 'i' } }
            ]
        });
        sendResponse(res, products || []);
    } catch (error) {
        sendError(res, "Error searching products");
    }
});

module.exports = router; 