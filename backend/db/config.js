const mongoose = require("mongoose");

// const connectDB = async ()=>{

// mongoose.connect("mongodb://mongodb:27017/e-commerce");
mongoose.connect(process.env.MONGODB_URI);
//     const product = mongoose.model('product', productSchema);
//     const data = await product.find();
//     console.warn(data);
// }
// connectDB();
