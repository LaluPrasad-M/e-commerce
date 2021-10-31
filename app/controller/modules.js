const mongo = require("../utils/mongo");
const collections = require("../../data/collections");
const commonUtils = require("../utils/commonUtils");
let moduleTypes = { main: "main", sub: "sub" };

exports.getPermittedModules = async function (req, res) {
  let userData = req.userData || req.body;
  if (!userData.role || !userData.companyId) {
    return res.status(403).json({ message: "Invalid User Login." });
  }

  let query = { role: userData.role, companyId: userData.companyId };
  const permittedModules = await mongo.findOne(collections.permissions, query);

  if (permittedModules && permittedModules.modulesEnabled) {
    query = { "submodules._id": { $in: permittedModules.modulesEnabled } };
    let projection = {
      name: true,
      submodules: {
        $elemMatch: {
          _id: { $in: permittedModules.modulesEnabled },
        },
      },
    };
    const result = await mongo.find(collections.modules, query, projection);
    console.log(result);
    return res.status(200).json(result);
  } else {
    return res.status(500).json({ message: "No Modules found." });
  }
};

exports.postModules = async function (req, res) {
  let data = req.body;
  if (data.type === moduleTypes.main) {
    if (!data.submodules) data.submodules = [];
    const result = await mongo.insertOne(collections.modules, data);
    return res.status(200).json(result);
  } else if (data.type === moduleTypes.sub) {
    let mainModuleQuery = { _id: mongo.ObjectId(data.mainModule) };
    const mainModule = await mongo.findOne(
      collections.modules,
      mainModuleQuery
    );
    if (mainModule) {
      let id = await commonUtils.makeId(10, data.name);
      data = { submodules: mainModule.submodules.concat({ _id: id, ...data }) };
      const result = await mongo.update(
        collections.modules,
        mainModuleQuery,
        data
      );
      if (result) {
        return res.status(200).json(result);
      } else {
        return res
          .status(500)
          .json({ message: "could not update/ Please try again later" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Main Module not found. Enter a valid main Module." });
    }
  } else {
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
