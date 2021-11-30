const { check_authentication } = require("./middlewares/authorization");
const { schema_validator } = require("./middlewares/schema_validation");

const { create_module_schema } = require("../models/modules.model")
const module_controller = require("../controller/modules");

module.exports = (app) => {
  app.get("/c/:role_code", module_controller.get_customer_modules);
  app.get("/modules", check_authentication, module_controller.get_user_modules);

  app.post("/modules", check_authentication, schema_validator(create_module_schema), module_controller.post_modules);

  // app.put("/:module_code", check_authentication, module_controller.updateModules);

  // app.get("/modules/:id", check_authentication, module_controller.getModuleDetails);
  // app.delete("/modules/:id", check_authentication, module_controller.deleteModule);
};
