const express = require("express");
const bodyparser = require("body-parser");

const users = require("./api/routes/users");
const orders = require("./api/routes/orders");
const roles = require("./api/routes/roles");
const categories = require("./api/routes/categories");
const tags = require("./api/routes/tags");
const products = require("./api/routes/products");
const carts = require("./api/routes/carts");

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

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use("/users", users);
app.use("/orders", orders);
app.use("/roles", roles);
app.use("/categories", categories);
app.use("/tags", tags);
app.use("/products", products);
app.use("/carts", carts);

//Handling Errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
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
