const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../db/Images');
const { sendResponse, sendError } = require('../utils/response');

const upload = multer();

// Upload image as base64
router.post("/upload/base64", upload.single("profilePicture"), async (req, res) => {
    try {
        const file = req.file;
        const base64Data = file.buffer.toString("base64");
        const image = new Image({
            profilePicture: base64Data
        });
        const result = await image.save();
        sendResponse(res, { message: "Image uploaded successfully", id: result._id });
    } catch (error) {
        console.error("Error uploading image:", error);
        sendError(res, "Failed to upload image");
    }
});

// Upload image as blob
router.post("/upload/blob", upload.single("profilePicture"), async (req, res) => {
    try {
        const file = req.file;
        const image = new Image({
            profilePicture: file.buffer
        });
        const result = await image.save();
        sendResponse(res, { message: "Image uploaded successfully", id: result._id });
    } catch (error) {
        console.error("Error uploading image:", error);
        sendError(res, "Failed to upload image");
    }
});

// Get image by ID
router.get("/getImage/blob", async (req, res) => {
    try {
        const image = await Image.findOne({ _id: req.query.id });
        if (image) {
            sendResponse(res, image);
        } else {
            sendError(res, "No image found", 404);
        }
    } catch (error) {
        sendError(res, "Error retrieving image");
    }
});

module.exports = router;