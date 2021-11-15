"use strict";

const express = require("express");
const expressManager = require("./config/express");
const files = require("./app/utils/app_utils");

const app = express();
const PORT = 8080;

expressManager.config(app);

files.walkRoutes(__dirname + "/app/routes", app);

//expressManager.NotFoundError should be after all the others routes are gone through
expressManager.NotFoundError(app);
app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`)
});
