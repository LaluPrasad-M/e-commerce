const mongo = require("../utils/mongo");
const collections = require("../../data/collections");
const authentication = require("../utils/authentication");

exports.postLogin = async (req, res, next) => {
  let email = req.body.email;
  const user = await mongo.findOne(collections.users, { email: email });
  if (user) {
    let tokenQuery = {
      name: user.name,
      email: user.email,
    };
    let token = await authentication.generateSessionToken(
      req.body.password,
      user.password,
      tokenQuery
    );
    await req.flash("token", token);
    res.status(200).json({ token });
  }
  res.status(401).json({ message: "Authentication Failed" });
};

exports.postLogout = async (req, res) => {
  req.flash("token");
  res.status(200).json({ message: "logged out successfully" });
};

exports.getUsers = async (req, res) => {
  const result = await mongo.find(collections.users);
  res.status(200).json(result);
};

exports.postUsers = async (req, res) => {
  let data = req.body;
  data["password"] = await authentication.hash(data.password);
  let result = await mongo.insertOne(collections.users, data);
  res.status(200).json(result);
};

exports.getUserDetails = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.findOne(collections.users, query);
  res.status(200).json(result);
};

exports.updateUsers = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let data = req.body;
  const result = await mongo.update(collections.users, query, data);
  res.status(200).json(result);
};

exports.deleteUser = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.deleteOne(collections.users, query);
  res.status(200).json(result);
};
