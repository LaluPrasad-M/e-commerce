const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const userController = require("../controller/products");

router.get("/", checkAuth, userController.getUsers);
router.post("/", checkAuth, userController.postUsers);
router.get("/:id", checkAuth, userController.getUserDetails);
router.put("/:id", checkAuth, userController.updateUsers);
router.delete("/:id", checkAuth, userController.deleteUser);

module.exports = router;
