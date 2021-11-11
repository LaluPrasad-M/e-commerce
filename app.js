"use strict";

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const compression = require("compression");

// const bodyParser = require("body-parser");

const users = require("./app/routes/users");
const roles = require("./app/routes/roles");
const modules = require("./app/routes/modules");
const module_contents = require("./app/routes/module_contents");

// const permissions = require("./app/routes/permissions");
// const orders = require("./app/routes/orders");
// const categories = require("./app/routes/categories");
// const tags = require("./app/routes/tags");
// const products = require("./app/routes/products");
// const carts = require("./app/routes/carts");

const app = express();

//Preventing CORS errors
//to Run Client and Server on different Systems
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested_With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, GET");
    return res.status(200).json({});
  }
  next();
});

//creating session so that flash can save messages
app.use(
  session({
    secret: "e-commerce",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());

//Data compression before the data is sent by api
app.use(compression({ filter: shouldCompress }));
function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

//if express >= 4.16.0, then bodyParser has been re-added under the methods express.json() and express.urlencoded()
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", users);
app.use("/roles", roles);
app.use("/modules", modules);
app.use("/module_contents",module_contents);

// app.use("/permissions", permissions);
// app.use("/orders", orders);
// app.use("/categories", categories);
// app.use("/tags", tags);
// app.use("/products", products);
// app.use("/carts", carts);

//Handling Errors
app.use((req, res, next) => {
  const error = new Error("Url Not Found! Invalid URL!");
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
