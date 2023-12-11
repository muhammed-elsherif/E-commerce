const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  userId: String,
  company: String,
  description: String,
  rating: Number,
  productPictures: [String], // For base64 string
});

module.exports = mongoose.model("products", productSchema);
