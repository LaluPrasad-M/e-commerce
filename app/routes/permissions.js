const { check_authentication } = require("./middlewares/authorization");
const permissionController = require("../controller/permissions");

module.exports = (app) => {
  app.post("/add", check_authentication, permissionController.postAdd);
  app.post("/revoke", check_authentication, permissionController.postRevoke);
  app.get("/", check_authentication, permissionController.getPermission);
  app.get("/all", check_authentication, permissionController.getAllPermissions);
};
