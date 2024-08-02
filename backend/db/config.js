const mongoose = require("mongoose");

// const connectDB = async ()=>{
// mongoose.connect("mongodb://localhost:27017/e-commerce");
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect("mongodb://mongodb:27017/e-commerce");

// const mongoDBUri =
//   "mongodb+srv://obli:kdvZaOq7RWmwir4k@cluster0.philcn1.mongodb.net/e-commerce";

// mongoose.connect(mongoDBUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// }
// connectDB();
