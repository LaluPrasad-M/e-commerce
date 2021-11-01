const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const userController = require("../controller/roles");

router.post("/", checkAuth, userController.postRoles);

router.get("/", checkAuth, userController.getRoles);
router.get("/:id", checkAuth, userController.getUserDetails);
router.put("/:id", checkAuth, userController.updateUsers);
router.delete("/:id", checkAuth, userController.deleteUser);

module.exports = router;
