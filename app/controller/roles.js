const mongo = require("../utils/mongo");
const commonUtils = require("../utils/commonUtils");
const collections = require("../../data/collections");

/*
{
  "role_name":"Role Name", ==> required
  "company_name":"Company Name",
  "user_type":"Manager" | "Employee" | "Customer", ==> required
}
*/
exports.postRoles = async function (req, res) {
  let data = req.body;
  //create a role_code using the role_name
  data["role_code"] = await commonUtils.makeId(10, data.role_name);

  let result = await mongo.insertOne(collections.roles, data);
  
  console.log({ ...result, role_code: data.role_code })
  return res.status(200).json({ ...result, role_code: data.role_code });
};

exports.getRoles = async function (req, res) {
  let result = await mongo.find(collections.roles);
  res.status(200).json(result);
};


exports.getUserDetails = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let result = await mongo.findOne(collections.roles, query);
  res.status(200).json(result);
};

exports.updateUsers = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let data = req.body;
  let result = await mongo.update(collections.roles, query, data);
  res.status(200).json(result);
};

exports.deleteUser = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let result = await mongo.deleteOne(collections.roles, query);
  res.status(200).json(result);
};
