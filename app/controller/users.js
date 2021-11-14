const _ = require("lodash");

const mongo = require("../utils/mongo");
const commonUtils = require("../utils/commonUtils");
const collections = require("../../data/collections");
const authentication = require("../utils/authentication");

/*
{
  "name": "user name",    ==> required
  "email": "user.mail@email.com", ==> required
  "phone": "+919876543210",
  "password": "password",   ==> required
  "dob": "01-01-2000",
  "manager": "Manager's user_code",  ==> required
  "role_code": "role_code"    ==> required
}
*/
exports.postSignup = async (req, res) => {
  let data = req.body;
  //check if a user already exists with the email

  let userExists = await mongo.findOne(collections.users, { email: data.email });
  if (!_.isEmpty(userExists)) {
    console.log("User already exists! Please try Logging in");
    return res.status(403).json({ message: "User already exists! Please try Logging in" });
  }

  //check if the role_code is valid
  let valid_role = await mongo.findOne(collections.roles, { role_code: data.role_code });
  if (_.isEmpty(valid_role)) {
    console.log("Invalid Role. Please enter a valid role code");
    return res.status(403).json({ message: "Invalid Role. Please enter a valid role code" });
  }

  data["user_code"] = await commonUtils.makeId(10, data.email);
  data["password"] = await authentication.hash(data.password);

  //insert the data into database
  let result = await mongo.insertOne(collections.users, data);
  if (!_.isEmpty(result)) {
    console.log({ ...result, user_code: data.user_code });
    return res.status(200).json({ ...result, user_code: data.user_code });
  } else {
    console.log("Nothing Inserted. Please try again later");
    return res.status(500).json({ message: "Nothing Inserted. Please try again later" });
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
    let { email, password } = req.body;
    if (!_.isEmpty(email) && !_.isEmpty(password)) {
      //get the user with the given email
      const user = await mongo.findOne(collections.users, { email: email });
      if (!_.isEmpty(user)) {
        //tokenQuery stores the userData into token to utilise it later
        let tokenQuery = {
          user_code: user.user_code,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          role_code: user.role_code,
          manager: user.manager,
        };

        //validate the password and get the token
        let token = await authentication.generateSessionToken(password, user.password, tokenQuery);
        if (!_.isEmpty(token)) {
          //store the token in the session
          await req.flash("token", token);

          console.log(tokenQuery)
          return res.status(200).json({ token });
        }
      }
    }
    console.log("Authentication Failed! Please check you email and password.");
    return res.status(401).json({ message: "Authentication Failed! Please check you email and password.", });
  } catch (e) {
    console.log("Session Expired. Please login again");
    return res.status(401).json({ message: "Session Expired. Please login again" });
  }
};

exports.postLogout = async (req, res) => {
  //remove the token from session
  req.flash("token");

  console.log("logged out successfully");
  return res.status(200).json({ message: "logged out successfully" });
};

exports.getUsers = async (req, res) => {
  let result = await mongo.find(collections.users);
  res.status(200).json(result);
};

exports.getUserDetails = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let result = await mongo.findOne(collections.users, query);
  res.status(200).json(result);
};

exports.updateUsers = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let data = req.body;
  let result = await mongo.update(collections.users, query, data);
  res.status(200).json(result);
};

exports.deleteUser = async (req, res) => {
  let query = { _id: mongo.ObjectId(req.params.id) };
  let result = await mongo.deleteOne(collections.users, query);
  res.status(200).json(result);
};
