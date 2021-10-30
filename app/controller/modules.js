const mongo = require("../utils/mongo");
const collections = require("../../data/collections");

let moduleTypes = { main: "main", sub: "sub" };

exports.getModules = async function (req, res) {
  const result = await mongo.find(collections.modules);
  return res.status(200).json(result);
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
      data = { submodules: mainModule.submodules.concat({_id: new mongo.ObjectId(),...data}) };
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
