const express = require("express");
const debug = require("debug");
const cors = require("cors");
// const green = require('chalk');
const multer = require("multer");
const fs = require("fs");
const AWS = require("aws-sdk");
// const redis = require("redis");
require("./db/config");
const User = require("./db/User");
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const {
    limiter,
    sqlInjectionProtection,
    requestSizeLimiter,
    securityHeaders,
    xss,
    mongoSanitize,
    hpp
} = require('./middleware/security');

const app = express();

// const client = redis.createClient({
//   host: "redis",
//   port: "6379",
// });

// client.set("visitsCounter", 0);
// app.get("/", (req, res) => {
//   res.send("Hello My Node Application");
//   client.get("visitsCounter", (err, visitsCounter) => {
//     res.send("Visits ctr: " + visitsCOunter);
//     client.set("visitCOunter", parseInt(visitsCounter) + 1);
//   });
// });

// Security middlewares
app.use(securityHeaders);
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
app.use(requestSizeLimiter);
app.use(sqlInjectionProtection);

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const imageRoutes = require('./routes/images');

// Use routes
app.use('/api', imageRoutes);
app.use('/', authRoutes);
app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);

app.put("/admin", async (req, res) => {
  const userId = req.body;

  try {
    // Find the user by userId and update their admin status
    let user = await User.findOne(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.admin = true;
    let result = await user.save();

    res.json({ message: "User is now an admin" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Database connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
  console.log("listening to port " + PORT);
  // debug(`listening on port ${chalk.green(PORT)}`);
});