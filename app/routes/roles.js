const { check_authentication } = require("./middlewares/authorization");
const user_controller = require("../controller/roles");

module.exports = (app) => {
  app.post("/roles/", check_authentication, user_controller.postRoles);

  app.get("/roles/", check_authentication, user_controller.getRoles);
  // app.get("/roles/:id", check_authentication, user_controller.getUserDetails);
  // app.put("/roles/:id", check_authentication, user_controller.updateUsers);
  // app.delete("/roles/:id", check_authentication, user_controller.deleteUser);
};
