const { checkAuth } = require("../utils/authentication");
const permissionController = require("../controller/permissions");

module.exports = (app) => {
  app.post("/add", checkAuth, permissionController.postAdd);
  app.post("/revoke", checkAuth, permissionController.postRevoke);
  app.get("/", checkAuth, permissionController.getPermission);
  app.get("/all", checkAuth, permissionController.getAllPermissions);
};
