const { checkAuth } = require("../utils/authentication");
const module_contents_controller = require("../controller/module_contents/module_contents.controller");

module.exports = (app) => {
  app.get("/module_contents/:module_code", checkAuth, module_contents_controller.get_module_contents);
  app.post("/module_contents/", checkAuth, module_contents_controller.post_module_contents);
};
