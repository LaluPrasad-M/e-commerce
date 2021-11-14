const _ = require("lodash");

const mongo = require("../utils/mongo");
const collections = require("../../data/collections");
const commonUtils = require("../utils/commonUtils");
const custom_mappings = require("../../data/custom_data/mappings/custom_mapping");

//For Customers, these roles doesnt require login
exports.getCustomerModules = async function (req, res) {
  let { role_code } = req.params;
  var role_details = await mongo.findOne(collections.roles, { role_code: role_code });

  //check if the role required a login
  if (!_.isEmpty(role_details) && !role_details.requires_login) {
    //get list of module_codes of all modules mapped to the role
    let modules = custom_mappings.role_modules_mapping[role_code];
    if (!_.isEmpty(modules)) {
      let query = { "submodules.module_code": { $in: modules } };
      let result = await mongo.find(collections.modules, query);
      if (!_.isEmpty(result)) {
        console.log(result);
        return res.status(200).json(result);
      }
    }
  }
  return res.status(500).json({ message: "No Modules found." });
};


//For Authorized Users, these roles require login
exports.getUserModules = async function (req, res) {
  let user_role = req.userData.role_code;

  //get list of module_codes of all modules mapped to the role
  let modules = custom_mappings.role_modules_mapping[user_role];
  if (!_.isEmpty(modules)) {
    let query = { "submodules.module_code": { $in: modules } };
    let result = await mongo.find(collections.modules, query);
    if (!_.isEmpty(result)) {
      console.log(result);
      return res.status(200).json(result);
    }
  }
  return res.status(500).json({ message: "No Modules found." });
};

let moduleTypes = { main: "main", sub: "sub" };

/*
  {
    "name":"module name",
    "type":"main"
  },
  {
    "name":"submodule name",
    "type":"sub",
    "main_module": "main module code",
  }
*/
exports.postModules = async function (req, res) {
  let data = req.body;
  //if its a main Module
  if (data.type === moduleTypes.main) {
    let insertData = {
      module_code: commonUtils.makeId(10, data.name),
      name: data.name,
      submodules: [],
    };
    let result = await mongo.insertOne(collections.modules, insertData);
    return res.status(200).json({ ...result, module_code: insertData.module_code });
  } else if (data.type === moduleTypes.sub) { //if its a sub module
    let mainModuleQuery = { module_code: req.body.main_module };
    let module_code = commonUtils.makeId(10, data.name);

    //add the submodule to the main_module
    let updationData = {
      $addToSet: {
        submodules: {
          module_code: module_code,
          name: data.name,
        },
      },
    };
    let result = await mongo.findOneAndUpdate(collections.modules, mainModuleQuery, updationData);
    //if submodule is added to the main module
    if (!_.isEmpty(result)) { 
      console.log({ ...result, module_code: module_code });
      return res.status(200).json({ ...result, module_code: module_code });
    } else { //if the submodule is not added to main module
      console.log("Main Module not found. Enter a valid main Module.");
      return res.status(400).json({ message: "Main Module not found. Enter a valid main Module." });
    }
  } else { //if its not a main or sub module type
    console.log("Invalid Module type.");
    return res.status(400).json({ message: "Invalid Module type." });
  }
};

exports.getModuleDetails = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let result = await mongo.findOne(collections.modules, query);
  res.status(200).json(result);
};

// /*
// /:module_code
// {
//   enable:["role_code"],
//   disable:["roles_code"]
// }
// */
// exports.updateModules = async function (req, res) {
//   let module_code = req.params.module_code;
//   let query = { "submodules.module_code": module_code };
//   let modulesToEnable = req.body.enable || [];
//   let modulesToDisable = req.body.disable || [];
//   let result = "";
//   let commonElements = await commonUtils.getArraysIntersection(
//     modulesToEnable,
//     modulesToDisable
//   );
//   if (!commonElements.length) {
//     if (modulesToEnable.length) {
//       let data = {
//         $addToSet: {
//           "submodules.$.permitted_role_codes": { $each: modulesToEnable },
//         },
//       };
//       let updationResult = await mongo.findOneAndUpdate(
//         collections.modules,
//         query,
//         data
//       );
//       if (updationResult) {
//         console.log("Modules Enabled Successfully.");
//         result += "Modules Enabled Successfully. ";
//       }
//     }
//     if (modulesToDisable.length) {
//       let data = {
//         $pullAll: { "submodules.$.permitted_role_codes": modulesToDisable },
//       };
//       let updationResult = await mongo.findOneAndUpdate(
//         collections.modules,
//         query,
//         data
//       );
//       if (updationResult) {
//         console.log("Modules Disabled Successfully.");
//         result += "Modules Disabled Successfully. ";
//       }
//     }
//     if (result !== "") {
//       return res.status(200).json({ message: result });
//     } else {
//       console.log("Module Permissions are not changed for any users");
//       return res
//         .status(403)
//         .json({ message: "Module Permissions are not changed for any users" });
//     }
//   } else {
//     console.log("Cannot enable and disable the same module for the same user.");
//     return res.status("403").json({
//       message: "Cannot enable and disable the same module for the same user.",
//     });
//   }
// };

exports.deleteModule = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let result = await mongo.deleteOne(collections.modules, query);
  res.status(200).json(result);
};
