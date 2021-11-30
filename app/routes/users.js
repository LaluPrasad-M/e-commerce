const { check_authentication } = require("./middlewares/authorization");
const { schema_validator } = require("./middlewares/schema_validation");

const { register_user_schema, login_user_schema, update_user_schema } = require("../models/user.model");
const user_controller = require("../controller/users");

module.exports = (app) => {
  app.post("/users/register", schema_validator(register_user_schema), user_controller.post_register_user);
  app.post("/users/login", schema_validator(login_user_schema), user_controller.post_login_user);
  app.post("/users/logout", check_authentication, user_controller.post_logout_user);

  app.get("/users/", check_authentication, user_controller.get_users_list);
  app.get("/users/profile", check_authentication, user_controller.get_user_profile);

  //self update of profile
  app.put("/users/profile", check_authentication, schema_validator(update_user_schema), user_controller.update_user_profile);

  // add one more update, which only a user's manager can update and not himself, like.. change of manager, role, etc
};
