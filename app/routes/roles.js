const { check_authentication } = require("./middlewares/authorization");
const { schema_validator } = require("./middlewares/schema_validation");

const { create_role_schema } = require("../models/roles.model")
const user_controller = require("../controller/roles");

module.exports = (app) => {
  app.post("/roles/", check_authentication, schema_validator(create_role_schema), user_controller.postRoles);

  app.get("/roles/", check_authentication, user_controller.getRoles);
};
