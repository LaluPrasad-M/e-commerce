const mongo = require("../utils/mongo");
const { DB_1 } = require("../../resources/databases");
const collections = require("../../resources/collections");

exports.getUsers = async function (req, res) {
  const result = await mongo.find(DB_1, collections.roles);
  res.status(200).json(result);
};

exports.postUsers = async function (req, res) {
  let data = req.body;
  const result = await mongo.insertOne(DB_1, collections.roles, data);
  res.status(200).json(result);
};

exports.getUserDetails = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.findOne(DB_1, collections.roles, query);
  res.status(200).json(result);
};

exports.updateUsers = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let data = req.body;
  const result = await mongo.update(DB_1, collections.roles, query, data);
  res.status(200).json(result);
};

exports.deleteUser = async function (req, res) {
  let query = { _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.deleteOne(DB_1, collections.roles, query);
  res.status(200).json(result);
};
