const { check_authentication } = require("./middlewares/authorization");
const user_controller = require("../controller/users");

module.exports = (app) => {
  app.post("/users/register", user_controller.post_register_user);
  app.post("/users/login", user_controller.post_login_user);
  app.post("/users/logout", check_authentication, user_controller.post_logout_user);

  app.get("/users/", user_controller.get_users_list);
  app.get("/users/profile", check_authentication, user_controller.get_user_profile);

  //self update of profile
  app.put("/users/profile", check_authentication, user_controller.update_user_profile);

  // add one more update, which only a user's manager can update and not himself, like.. change of manager, role, etc
};
