const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const moduleController = require("../controller/modules");

router.get("/", checkAuth, moduleController.getPermittedModules);
router.post("/", checkAuth, moduleController.postModules);
router.get("/:id", checkAuth, moduleController.getModuleDetails);
router.put("/:id", checkAuth, moduleController.updateModules);
router.delete("/:id", checkAuth, moduleController.deleteModule);

module.exports = router;
