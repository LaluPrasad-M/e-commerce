const mongo = require("../utils/mongo");
const collections = require("../../data/collections");
const commonUtils = require("../utils/commonUtils");
const custom_mappings = require("../../data/custom-data/mappings/custom-mapping");

exports.get_module_contents = async function (req, res) {
  console.log(req.userData);
  let module_code = req.params.module_code;
  let module_content_code = custom_mappings.module_content_mapping[module_code];
  if (module_content_code) {
    let query = { module_content_code: module_content_code };
    let result = await mongo.findOne(collections.module_contents, query);
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ message: "module_contents not found!" });
    }
  } else {
    return res.status(500).json({ message: "module not found!" });
  }
};

/* 
{
    "module_content_name":"module contents page name",
    "module_code":"module_code of the modules",
    "data":["Array of details of the products or services"]
}
*/
exports.post_module_contents = async function (req, res) {
  let data = req.body;
  let dataQuery = {
    ...data,
    module_content_code: commonUtils.makeId(10, data.module_content_name),
  };
  let result = mongo.insertOne(collections.module_contents, dataQuery);
  if (result) {
    console.log(result);
    return res.status(200).json(result);
  } else {
    return res
      .status(500)
      .json({ message: "Module Content page not inserted" });
  }
};
