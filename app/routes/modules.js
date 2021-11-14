const { checkAuth } = require("../utils/authentication");
const moduleController = require("../controller/modules");

module.exports = (app) => {
  app.get("/c/:role_code", moduleController.getCustomerModules);
  app.get("/modules/", checkAuth, moduleController.getPermittedModules);
  app.post("/modules/", checkAuth, moduleController.postModules);

  // app.put("/:module_code", checkAuth, moduleController.updateModules);

  app.get("/modules/:id", checkAuth, moduleController.getModuleDetails);
  app.delete("/modules/:id", checkAuth, moduleController.deleteModule);
};
