const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

// const mongoDBUri =
//   "mongodb+srv://obli:kdvZaOq7RWmwir4k@cluster0.philcn1.mongodb.net/e-commerce";

// mongoose.connect(mongoDBUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// }
// connectDB();
