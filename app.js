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
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use("/users", users);
app.use("/orders", orders);
app.use("/roles", roles);
app.use("/categories", categories);
app.use("/tags", tags);
app.use("/products", products);
app.use("/carts", carts);

module.exports = app;
