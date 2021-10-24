const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const userController = require("../controller/tags");

router.get("/", userController.getUsers);
router.post("/", userController.postUsers);
router.get("/:id", checkAuth, userController.getUserDetails);
router.put("/:id", userController.updateUsers);
router.delete("/:id", userController.deleteUser);

module.exports = router;
