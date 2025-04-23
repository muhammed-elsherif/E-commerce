const mongoose = require("mongoose");

// Database connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// const mongoDBUri =
//   "mongodb+srv://obli:kdvZaOq7RWmwir4k@cluster0.philcn1.mongodb.net/e-commerce";

// mongoose.connect(mongoDBUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// }
// connectDB();
