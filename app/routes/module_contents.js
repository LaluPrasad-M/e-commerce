const { check_authentication } = require("./middlewares/authorization");
const module_contents_controller = require("../controller/module_contents");

module.exports = (app) => {
  app.get("/module_contents/:module_code",  module_contents_controller.get_module_contents);
  app.post("/module_contents/", check_authentication, module_contents_controller.post_module_contents);
};
