const mongo = require("../utils/mongo");
const collections = require("../../data/collections");
const commonUtils = require("../utils/commonUtils");

let moduleTypes = { main: "main", sub: "sub" };

exports.getPermittedModules = async function (req, res) {
  let user_role = req.userData.role_code;
  let query = { "submodules.permitted_role_codes": user_role };
  let projection = {
    name: true,
    submodules: {
      $elemMatch: {
        permitted_role_codes: role_code,
      },
    },
  };
  const result = await mongo.find(collections.modules, query, projection);
  if (result.length > 0) {
    console.log(result);
    return res.status(200).json(result);
  } else {
    return res.status(500).json({ message: "No Modules found." });
  }
};

/*
  {
    "name":"module name",
    "type":"main"
  },
  {
    "name":"submodule name",
    "type":"sub",
    "main_module": "main module code",
    "permitted_role_codes": ["role_code"] ==> optional
  }
*/
exports.postModules = async function (req, res) {
  let data = req.body;
  if (data.type === moduleTypes.main) {
    let insertData = {
      module_code: commonUtils.makeId(10, data.name),
      name: data.name,
      submodules: [],
    };
    const result = await mongo.insertOne(collections.modules, insertData);
    return res.status(200).json(result);
  } else if (data.type === moduleTypes.sub) {
    let mainModuleQuery = { module_code: req.body.main_module };
    let updationData = {
      $addToSet: {
        submodules: {
          module_code: commonUtils.makeId(10, data.name),
          name: data.name,
          permitted_role_codes: data.permitted_role_codes
            ? data.permitted_role_codes
            : [],
        },
      },
    };
    const result = await mongo.findOneAndUpdate(
      collections.modules,
      mainModuleQuery,
      updationData
    );
    if (result) {
      console.log("Module Updated Successfully.");
      return res.status(200).json("Module Updated Successfully.");
    } else {
      console.log("Main Module not found. Enter a valid main Module.");
      return res
        .status(400)
        .json({ message: "Main Module not found. Enter a valid main Module." });
    }
  } else {
    console.log("Invalid Module type.");
    return res.status(400).json({ message: "Invalid Module type." });
  }
};

exports.getModuleDetails = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.findOne(collections.modules, query);
  res.status(200).json(result);
};

exports.updateModules = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let data = req.body;
  const result = await mongo.update(collections.modules, query, data);
  res.status(200).json(result);
};

exports.deleteModule = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.deleteOne(collections.modules, query);
  res.status(200).json(result);
};
