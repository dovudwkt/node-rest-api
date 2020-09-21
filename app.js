const express = require("express");
const app = express();
const morgan = require("morgan"); // Middleware for logs
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// Routes
const productRoutes = require("./api/routes/products");
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
  "mongodb+srv://dovud:" +
    process.env.MONGO_ATLAS_PWD +
    "@sigma.yydxo.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    // useMongoClient: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);

// Run logging middleware before other routes
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // see docs
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Controll-Allow-Origin", "*");
  res.header(
    "Access-Controll-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Controll-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use('/orders', orderRoutes);

// Handle errors. If no routes found, then the following line is reached
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
