const mongoose = require('mongoose');

// const connectDB = async ()=>{
    mongoose.connect('mongodb://localhost:27017/e-commerce');
//     const product = mongoose.model('product', productSchema);
//     const data = await product.find();
//     console.warn(data);
// }
// connectDB();