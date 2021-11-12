const { checkAuth } = require("../utils/authentication");
const userController = require("../controller/users");

module.exports = (app) => {
  app.post("/users/signup", userController.postSignup);
  app.post("/users/login", userController.postLogin);
  app.post("/users/logout", userController.postLogout);

  app.get("/users/", checkAuth, userController.getUsers);
  app.get("/users/:id", checkAuth, userController.getUserDetails);
  app.put("/users/:id", checkAuth, userController.updateUsers);
  app.delete("/users/:id", checkAuth, userController.deleteUser);
};
