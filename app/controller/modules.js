const _ = require("lodash");
const log4js = require("log4js");

const db = require("../../config/mongo");
const collections = require("../../data/collections");
const commonUtils = require("../utils/commonUtils");
const custom_mappings = require("../../data/custom_data/mappings/custom_mapping");

const log_info = log4js.getLogger("info")

//For Customers, these roles doesnt require login
exports.get_customer_modules = async function (req, res, next) {
  try {
    let { role_code } = req.params;
    var role_details = await db.getDb().db().collection(collections.roles).findOne({ role_code: role_code });

    //check if the role requires a login
    if (!_.isEmpty(role_details) && !role_details.requires_login) {
      //get list of module_codes of all modules mapped to the role
      let modules = custom_mappings.role_modules_mapping[role_code];
      if (!_.isEmpty(modules)) {
        let query = { "submodules.module_code": { $in: modules } };
        let options = {
          projection: { name: 1, module_code: 1, submodules: { $elemMatch: { module_code: { $in: modules } } } }
        };
        let result = await db.getDb().db().collection(collections.modules).find(query, options).toArray();
        if (!_.isEmpty(result)) {
          log_info.info({ success: true, data: result })
          return res.status(200).json({ success: true, data: result });
        }
      }
    }
    let error = new Error("No Modules Found");
    error.status = 404;
    throw error;
  } catch (err) {
    next(err)
  }
};

//For Authorized Users, these roles require login
exports.get_user_modules = async function (req, res, next) {
  try {
    let user_role = req.user.role_code;

    //get list of module_codes of all modules mapped to the role
    let modules = custom_mappings.role_modules_mapping[user_role];
    if (!_.isEmpty(modules)) {
      let query = { "submodules.module_code": { $in: modules } };
      let options = {
        projection: { name: 1, module_code: 1, submodules: { $elemMatch: { module_code: { $in: modules } } } }
      };
      let result = await db.getDb().db().collection(collections.modules).find(query, options).toArray();
      if (!_.isEmpty(result)) {
        log_info.info({ success: true, data: result })
        return res.status(200).json({ success: true, data: result });
      }
    }
    let error = new Error("No Modules Found");
    error.status = 404;
    throw error;
  } catch (err) {
    next(err);
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
  }
*/
exports.post_modules = async function (req, res, next) {
  try {
    let data = req.body;
    //if its a main Module
    if (data.type === "main") {
      let insertData = {
        module_code: commonUtils.makeId(10, data.name),
        name: data.name,
        submodules: [],
      };
      let result = await db.getDb().db().collection(collections.modules).insertOne(insertData);

      log_info.info({ success: true, data: "Module Inserted" })
      return res.status(200).json({ success: true, data: "Module Inserted" });

    } else { //if its a sub module

      if (!data.main_module) {
        const error = new Error("Main module cannot be empty");
        error.status = 400;
        throw error;
      }

      let main_module_query = { module_code: data.main_module };
      let updation_query = {
        $push: {
          submodules: {
            module_code: commonUtils.makeId(10, data.name),
            name: data.name
          }
        }
      };

      let updation_result = await db.getDb().db().collection(collections.modules).updateOne(main_module_query, updation_query);
      //if submodule is added to the main module

      if (updation_result.modifiedCount) {
        await db.getDb().db().collection(collections.modules).updateOne(main_module_query, { $set: { last_updated_on: new Date() } })
        log_info.info({ success: true, data: "Module Inserted" })
        return res.status(200).json({ success: true, data: "Module Inserted" });
      }

      if (updation_result.matchedCount) {
        var error = new Error("Module not inserted")
        error.status = 304;
        throw error
      } else {
        var error = new Error("Main Module not found. Enter a valid main Module.")
        error.status = 400;
        throw error
      }
    }
  } catch (err) {
    next(err)
  }
};

// exports.getModuleDetails = async function (req, res) {
//   let query = { _id: mongo.ObjectId(req.params.id) };
//   let result = await mongo.findOne(collections.modules, query);
//   res.status(200).json(result);
// };

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
//   if (_.isEmpty(_.intersection(modulesToEnable, modulesToDisable))) {
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

// exports.deleteModule = async function (req, res) {
//   let query = { _id: mongo.ObjectId(req.params.id) };
//   let result = await mongo.deleteOne(collections.modules, query);
//   res.status(200).json(result);
// };
