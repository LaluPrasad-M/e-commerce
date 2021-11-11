const mongo = require("../utils/mongo");
const collections = require("../../data/collections");
const commonUtils = require("../utils/commonUtils");
const custom_mappings = require("../../data/custom-data/mappings/custom-mapping");

let moduleTypes = { main: "main", sub: "sub" };

exports.getPermittedModules = async function (req, res) {
  let user_role = req.userData.role_code;
  let modules = custom_mappings.role_modules_mapping[user_role];
  console.log(user_role, modules);

  if (modules) {
    let query = { "submodules.module_code": { $in: modules } };
    let result = await mongo.find(collections.modules, query);
    console.log(result);
    if (result) {
      return res.status(200).json(result);
    }
  }
  return res.status(500).json({ message: "No Modules found." });
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
    let result = await mongo.insertOne(collections.modules, insertData);
    return res.status(200).json(result);
  } else if (data.type === moduleTypes.sub) {
    let mainModuleQuery = { module_code: req.body.main_module };
    let updationData = {
      $addToSet: {
        submodules: {
          module_code: commonUtils.makeId(10, data.name),
          name: data.name,
        },
      },
    };
    let result = await mongo.findOneAndUpdate(
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
