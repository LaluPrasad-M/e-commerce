const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const permissionController = require("../controller/permissions");

router.post("/add", checkAuth, permissionController.postAdd);
router.post("/revoke", checkAuth, permissionController.postRevoke);
router.get("/", checkAuth, permissionController.getPermission);
router.get("/all", checkAuth, permissionController.getAllPermissions);

module.exports = router;
