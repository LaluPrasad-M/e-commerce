const mongo = require("../utils/mongo");
const collections = require("../../data/collections");
const authentication = require("../utils/authentication");
const commonUtils = require("../utils/commonUtils");

/*
{
  "name": "user name",
  "email": "user.mail@email.com",
  "phone": "+919876543210",
  "password": "password",
  "dob": "01-01-2000",
  "manager": "Manager Name",
  "role_code": "role_code"
}
*/
exports.postSignup = async (req, res) => {
  let data = req.body;
  let userExists = await mongo.findOne(collections.users, {
    email: data.email,
  });
  if (userExists) {
    return res
      .status(403)
      .json({ message: "User already exists! Please try Logging in" });
  }
  let valid_role = await mongo.findOne(collections.roles, {
    role_code: data.role_code,
  });
  if (valid_role) {
    console.log("Invalid Role id. Please enter a valid role code");
    return res
      .status(403)
      .json({ message: "Invalid Role id. Please enter a valid role code" });
  }
  data["user_code"] = await commonUtils.makeId(10, data.email);
  data["password"] = await authentication.hash(data.password);
  let result = await mongo.insertOne(collections.users, data);
  if (result) {
    return res.status(200).json(result);
  } else {
    console.log("Nothing Inserted. Please try again later");
    res
      .status(500)
      .json({ message: "Nothing Inserted. Please try again later" });
  }
};

/*
{
  "email":"user.mail@email.com",
  "password":"password"
}
*/
exports.postLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let reqBodyPassword = req.body.password;
    if (email && reqBodyPassword) {
      const user = await mongo.findOne(collections.users, { email: email });
      if (user) {
        let tokenQuery = {
          user_code: user.user_code,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          role_code: user.role_code,
          manager: user.manager,
        };
        let token = await authentication.generateSessionToken(
          reqBodyPassword,
          user.password,
          tokenQuery
        );
        if (token) {
          await req.flash("token", token);
          return res.status(200).json({ token });
        }
      }
    }
    console.log("Authentication Failed! Please check you email and password.");
    res.status(401).json({
      message: "Authentication Failed! Please check you email and password.",
    });
  } catch (e) {
    console.log(e.message);
    res.status(401).json({ message: e.message });
  }
};

exports.postLogout = async (req, res) => {
  req.flash("token");
  console.log("logged out successfully");
  res.status(200).json({ message: "logged out successfully" });
};

exports.getUsers = async (req, res) => {
  const result = await mongo.find(collections.users);
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
