const express = require("express");
const debug = require("debug");
const cors = require("cors");
// const green = require('chalk');
const multer = require("multer");
const fs = require("fs");
const AWS = require("aws-sdk");
// const redis = require("redis");
const upload = multer();
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Products");
const Image = require("./db/Images");
const PORT = process.env.PORT || 3000;

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

app.use(express.json());
app.use(cors());

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

app.listen(PORT, () => {
  console.log("listening to port " + PORT);
  // debug(`listening on port ${chalk.green(PORT)}`);
});