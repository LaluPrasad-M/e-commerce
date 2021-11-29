const _ = require("lodash");

const db = require("../../config/mongo");
const collections = require("../../data/collections");
const commonUtils = require("../utils/commonUtils");
const custom_mappings = require("../../data/custom_data/mappings/custom_mapping");

exports.get_module_contents = async function (req, res) {
  let { module_code } = req.params;
  //get list of module_content_codes of all module_contents mapped to the module
  let module_content_code = custom_mappings.module_content_mapping[module_code];
  if (!_.isEmpty(module_content_code)) {
    let query = { module_content_code: module_content_code };
    //get contents of the module
    let result = await db.getDb().db().collection(collections.module_contents).findOne(query);
    if (!_.isEmpty(result)) {
      console.log(result);
      return res.status(200).json(result);
    } else {
      console.log("module_contents not found!");
      return res.status(500).json({ message: "module_contents not found!" });
    }
  } else {
    console.log("module not found!");
    return res.status(500).json({ message: "module not found!" });
  }
};

/* 
{
    "module_content_name":"module contents page name",
    "module_code":"module_code of the modules",
    "data":[{name:"sweets",price:"500",image:"image_url"},{price:"300",name:"spice",order:"order"}]
}
*/
exports.post_module_contents = async function (req, res) {
  let data = req.body;
  let dataQuery = {
    ...data,
    module_content_code: commonUtils.makeId(10, data.module_content_name),
  };
  let result = db.getDb().db().collection(collections.module_contents).insertOne(dataQuery);
  if (!_.isEmpty(result)) {
    console.log({ ...result, module_content_code: dataQuery.module_content_code });
    return res.status(200).json({ ...result, module_content_code: dataQuery.module_content_code });
  } else {
    console.log("Module Content page not inserted");
    return res.status(500).json({ message: "Module Content page not inserted" });
  }
};
