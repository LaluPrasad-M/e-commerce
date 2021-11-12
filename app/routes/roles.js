const { checkAuth } = require("../utils/authentication");
const userController = require("../controller/roles");

module.exports = (app) => {
  app.post("/roles/", checkAuth, userController.postRoles);

  app.get("/roles/", checkAuth, userController.getRoles);
  app.get("/roles/:id", checkAuth, userController.getUserDetails);
  app.put("/roles/:id", checkAuth, userController.updateUsers);
  app.delete("/roles/:id", checkAuth, userController.deleteUser);
};
