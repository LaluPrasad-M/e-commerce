const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const module_contents_controller = require("../controller/module_contents");

router.get("/:module_code", checkAuth, module_contents_controller.get_module_contents);
router.post("/", checkAuth, module_contents_controller.post_module_contents);

module.exports = router;
