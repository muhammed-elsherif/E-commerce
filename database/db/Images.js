const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  profilePicture: Buffer, // Store image data as a Buffer (Blob)
  // profilePicture: String, // For base64 string
  // profilePictureUrl: String, // For cloud storage URL
});

module.exports = mongoose.model("images", imageSchema);