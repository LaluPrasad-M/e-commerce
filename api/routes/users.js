const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const userController = require("../controller/users");

router.post("/login", userController.postLogin);
router.get("/", userController.getUsers);
router.post("/", userController.postUsers);
router.get("/:id", checkAuth, userController.getUserDetails);
router.put("/:id", userController.updateUsers);
router.delete("/", userController.deleteUser);

module.exports = router;
