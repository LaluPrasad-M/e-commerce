const mongo = require("../utils/mongo");
const collections = require("../../data/collections");

exports.getUsers = async function (req, res) {
  const result = await mongo.find(collections.carts);
  res.status(200).json(result);
};

exports.postUsers = async function (req, res) {
  let data = req.body;
  const result = await mongo.insertOne(collections.carts,data);
  res.status(200).json(result);
};

exports.getUserDetails = async function (req, res) {
  let query ={ _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.findOne(collections.carts, query);
  res.status(200).json(result);
};

exports.updateUsers = async function (req, res) {
  let query ={ _id: mongo.ObjectId(req.params.id) };
  let data = req.body;
  const result = await mongo.update(collections.carts, query, data);
  res.status(200).json(result);
};

exports.deleteUser = async function (req, res) {
  let query ={ _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.deleteOne(collections.carts, query);
  res.status(200).json(result);
};
