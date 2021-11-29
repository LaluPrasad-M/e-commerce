const { check_authentication } = require("./middlewares/authorization");
const moduleController = require("../controller/modules");

module.exports = (app) => {
  app.get("/c/:role_code", moduleController.getCustomerModules);
  app.get("/modules/", check_authentication, moduleController.getUserModules);
  app.post("/modules/", check_authentication, moduleController.postModules);

  // app.put("/:module_code", check_authentication, moduleController.updateModules);

  // app.get("/modules/:id", check_authentication, moduleController.getModuleDetails);
  // app.delete("/modules/:id", check_authentication, moduleController.deleteModule);
};
