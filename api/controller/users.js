const mongo = require("../utils/mongo");
const { DB_1 } = require("../../resources/databases");
const collections = require("../../resources/collections");
const authentication = require("../utils/authentication");

exports.postLogin = async(req, res, next) => {
  let email = req.body.email;
  const user = await mongo.findOne(DB_1, collections.users, {email:email});
  if(user){
    let tokenQuery = {
      'name': user.name,
      'email': user.email
    }
    let token = await authentication.generateSessionToken(req.body.password,user.password,tokenQuery);
    res.status(200).json({token:token});
  }
  res.status(401).json({message:"Authentication Failed"});
};

exports.getUsers = async (req, res) => {
  const result = await mongo.find(DB_1, collections.users);
  res.status(200).json(result);
};

exports.postUsers = async (req, res) => {
  let data = req.body;
  data["password"] = await authentication.hash(data.password);
  let result = await mongo.insertOne(DB_1, collections.users, data);
  res.status(200).json(result);
};

exports.getUserDetails = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.findOne(DB_1, collections.users, query);
  res.status(200).json(result);
};

exports.updateUsers = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let data = req.body;
  const result = await mongo.update(DB_1, collections.users, query, data);
  res.status(200).json(result);
};

exports.deleteUser = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  const result = await mongo.deleteOne(DB_1, collections.users, query);
  res.status(200).json(result);
};
