const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const userController = require("../controller/users");

router.post("/signup", userController.postSignup);
router.post("/login", userController.postLogin);
router.post("/logout", userController.postLogout);

router.get("/", checkAuth, userController.getUsers);
router.get("/:id", checkAuth, userController.getUserDetails);
router.put("/:id", checkAuth, userController.updateUsers);
router.delete("/:id", checkAuth, userController.deleteUser);

module.exports = router;
