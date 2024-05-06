const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: String,
  category: String,
  userId: String,
  productPicture: String, // For base64 string
});

module.exports = mongoose.model("cart", productSchema);
