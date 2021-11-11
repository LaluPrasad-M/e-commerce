const express = require("express");
const router = express.Router();

const { checkAuth } = require("../utils/authentication");
const moduleController = require("../controller/modules");

router.get("/", checkAuth, moduleController.getPermittedModules);
router.post("/", checkAuth, moduleController.postModules);
// router.put("/:module_code", checkAuth, moduleController.updateModules);

router.get("/:id", checkAuth, moduleController.getModuleDetails);
router.delete("/:id", checkAuth, moduleController.deleteModule);

module.exports = router;
