const express = require("express");
const debug = require("debug");
const cors = require("cors");
// const green = require('chalk');
const multer = require("multer");
const fs = require("fs");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { MongoClient, GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const upload = multer();
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Products");
const Image = require("./db/Images");
const PORT = process.env.PORT || 3000;
const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello My Node Application");
});

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    let user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      admin: false,
    });
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        res.send({ result: "something went wrong please try again later" });
      }
      res.send({ result, auth: token });
    });
    // res.json(user); // Send the result as a JSON response
  } catch (error) {
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    // let user = await User.findOne(req.body).select("-password");
    let user = await User.findOne({ email });
    if (user) {
      // Compare the entered password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            res.send({
              result: "Something went wrong. Please try again later.",
            });
          }
          res.send({ user, auth: token });
        });
      } else {
        res.send({ result: "Invalid password" });
      }
    } else {
      res.send({ result: "No user found" });
    }
  } else {
    res.send({ result: "Please provide email and password" });
  }
});

// app.post("/add-product", upload.single("productPicture"), async (req, res) => {
app.post(
  "/add-product",
  upload.array("productPictures", 5),
  async (req, res) => {
    const files = req.files;
    try {
      // Access other form data (productName, price, etc.) from req.body
      const jsonData = JSON.parse(req.body.jsonData);

      // Create an array to store all base64 encoded images
      const imageArray = [];

      // Loop through each file and convert it to base64
      for (const file of files) {
        imageArray.push(file.buffer.toString("base64"));
      }

      // Create and save product with images to database
      const product = new Product({
        name: jsonData.name,
        price: jsonData.price,
        category: jsonData.category,
        userId: jsonData.userId,
        company: jsonData.company,
        description: jsonData.description,
        rating: jsonData.rating,
        productPictures: imageArray,
      });

      const result = await product.save();
      res.send(result);
    } catch (error) {
      res.status(500).send("Error adding product");
    }
  }
);

app.get("/products", async (req, res) => {
  try {
    let products = await Product.find();
    if (products.length > 0) {
      res.send(products);
    } else {
      res.send({ result: "No Products Found" });
    }
  } catch (error) {
    res.status(500).send("Error loading product list");
  }
});

app.get("/cart-products", async (req, res) => {
  try {
    const { ids } = req.query; // Get the IDs from query parameters
    const productIds = Array.isArray(ids) ? ids : [ids]; // Convert to an array if single ID is passed

    // Find products by matching the IDs
    let products = await Product.find({ _id: { $in: productIds } });

    if (products.length > 0) {
      res.send(products);
    } else {
      res.send({ result: "No Products Found" });
    }
  } catch (error) {
    res.status(500).send("Error loading product list");
  }
});

app.delete("/product/:id", async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id", async (req, res) => {
  const result = await Product.findOne({ _id: req.params.id });
  result ? res.send(result) : res.send({ result: "No Products Found" });
});

app.put(
  "/product/:id",
  upload.array("productPictures", 5),
  async (req, res) => {
    try {
      const files = req.files;
      const jsonData = JSON.parse(req.body.jsonData);

      if (files) {
        const imageArray = [];
        for (const file of files) {
          imageArray.push(file.buffer.toString("base64"));
        }
        const result = await Product.updateOne(
          { _id: req.params.id },
          {
            $set: {
              ...jsonData,
              productPictures: imageArray,
            },
          }
        );
        result ? res.send(result) : res.send({ result: "No Products updated" });
      } else {
        // File is not included, update only jsonData
        const result = await Product.updateOne(
          { _id: req.params.id },
          {
            $set: {
              ...jsonData,
            },
          }
        );
        result ? res.send(result) : res.send({ result: "No Products updated" });
      }
    } catch (error) {
      res.status(500).send("Error updating product");
    }
  }
);

app.get("/search/:key", async (req, res) => {
  const result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });
  result ? res.send(result) : res.send({ result: "No Products Found" });
});

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    console.warn("middleware called if", token);
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please provide valid token " });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please add token with header" });
  }
}
//////////////////////////////////////////////////////////////////////

app.post(
  "/api/upload/base64",
  upload.single("profilePicture"),
  async (req, res) => {
    const file = req.file;
    console.log(file);
    try {
      // Convert the file buffer to a base64 string
      // const base64Data = file.buffer.toString("base64");
      const image = new Image({
        // profilePicture: base64Data,
        profilePicture: file.buffer.toString("base64"),
      });

      // let image = new Image(req.body);
      let result = await image.save();

      // Remove the temporary file
      fs.unlinkSync(file.path);

      res.json({ message: "Image uploaded successfully" });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

app.post("/api/retrieve/base64", async (req, res) => {
  try {
    let images = await Image.findOne({ _id: "65132e66bcd07de5507d4e09" });
    if (images.length > 0) {
      res.send(images);
      // res.send(images.profilePicture);
    } else {
      res.send({ result: "No images Found" });
    }
  } catch (error) {
    res.status(500).send("Error loading product list");
  }
});

app.get("/api/retrieve/base64", async (req, res) => {
  try {
    const image = await Image.findOne({ _id: "65132e66bcd07de5507d4e09" });
    if (image) {
      res.send(image);
      // res.send(image.profilePicture);
    } else {
      res.send({ result: "No image found" });
    }
  } catch (error) {
    res.status(500).send("Error retrieving image");
  }
});
app.get("/api/getImage/blob", async (req, res) => {
  try {
    const image = await Image.findOne({ _id: "6515a86f9171314b2c313e75" });
    if (image) {
      res.send(image);
      // res.send(image.profilePicture);
    } else {
      res.send({ result: "No image found" });
    }
  } catch (error) {
    res.status(500).send("Error retrieving image");
  }
});
//////////////////////////////////////////////////////////////////////////////////////

// Handle file upload
app.post(
  "/api/upload/blob",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const file = req.file; // Access the uploaded file's Buffer data
      console.log(file);
      // Create a new document and save the Blob data
      const image = new Image({ profilePicture: file.buffer });
      const result = await image.save();
      // res.send(result);
      res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// Example: Uploading image to Amazon S3
// app.post(
//   "/api/upload/cloud",
//   upload.single("profilePicture"),
//   async (req, res) => {
//     const file = req.file;

//     // Set up AWS S3 credentials
//     AWS.config.update({
//       accessKeyId: "your-access-key",
//       secretAccessKey: "your-secret-access-key",
//     });

//     const s3 = new AWS.S3();

//     try {
//       // Upload the file to Amazon S3
//       const uploadParams = {
//         Bucket: "your-bucket-name",
//         Key: file.originalname,
//         Body: file.buffer,
//         ACL: "public-read",
//       };

//       const { Location } = await s3.upload(uploadParams).promise();

//       // Create a new user with the profile picture URL
//       const user = new User({
//         name: req.body.name,
//         profilePictureUrl: Location,
//       });

//       // Save the user to MongoDB
//       await user.save();

//       res.json({ message: "Image uploaded successfully" });
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       res.status(500).json({ error: "Failed to upload image" });
//     }
//   }
// );

// app.listen(5000);
app.listen(PORT, () => {
  console.log("listening to port " + PORT);
  // debug(`listening on port ${chalk.green(PORT)}`);
});
