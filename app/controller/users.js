const _ = require("lodash");
const log4js = require("log4js");

const db = require("../../config/mongo");
const commonUtils = require("../utils/commonUtils");
const collections = require("../../data/collections");
const authentication = require("../utils/authentication");

const log_info = log4js.getLogger("info")

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
exports.post_register_user = async (req, res, next) => {
  try {
    var { name, email, password, role_code, manager, phone, dob } = req.body

    //check if a user already exists with the email
    let userExists = await db.getDb().db().collection(collections.users).findOne({ email });
    if (!_.isEmpty(userExists)) {
      var error = new Error("User already exists! Please try Logging in");
      error.status = 409;
      throw error;
    }

    //check if the role_code is valid
    let valid_role = await db.getDb().db().collection(collections.roles).findOne({ role_code });
    if (_.isEmpty(valid_role)) {
      var error = new Error("Invalid Role. Please enter a valid role code");
      error.status = 400;
      throw error;
    }

    //check if the manger is valid
    if (!_.isEmpty(manager)) {
      let valid_manager = await db.getDb().db().collection(collections.users).findOne({ user_code: manager });
      if (_.isEmpty(valid_manager)) {
        var error = new Error("Invalid Manager. PLease enter a valid manager data");
        error.status = 400;
        throw error;
      }
    } else {
      manager = null
    }


    let user_code = await commonUtils.makeId(10, email);
    let salt = await authentication.genSalt(15);
    let hashed_password = await authentication.hash(salt, password);
    let created_on = new Date();

    //insert the data into database
    let data = { user_code, name, email, phone, dob, manager, role_code, salt, hashed_password, created_on, last_login: created_on, last_updated_on: created_on }
    let result = await db.getDb().db().collection(collections.users).insertOne(data);

    if (!_.isEmpty(JSON.json_stringify(result.insertedId))) {
      let token = await authentication.generateSessionToken(password, hashed_password, { user_code, email })
      log_info.info({ success: true, token })
      return res.status(201).json({ success: true, token });
    } else {
      throw new Error("Nothing Inserted. Please try again later");
    }
  } catch (err) {
    next(err);
  }
};

/*
{
  "email":"user.mail@email.com",
  "password":"password"
}
*/
exports.post_login_user = async (req, res, next) => {
  try {
    let { email, password } = req.body
    const user = await db.getDb().db().collection(collections.users).findOne({ email });
    if (!_.isEmpty(user)) {
      let { user_code, hashed_password } = user;
      let token = await authentication.generateSessionToken(password, hashed_password, { user_code, email });

      await db.getDb().db().collection(collections.users).updateOne({ user_code }, { $set: { last_login: new Date() } })
      await req.flash("token", token);
      log_info.info({ success: true, token })
      return res.status(200).json({ success: true, token });
    }
    var error = new Error("Authentication Failed! Please check you email and password.");
    error.status = 401
    throw error;
  } catch (err) {
    next(err);
  }
};

exports.post_logout_user = async (req, res, next) => {
  try {
    await db.getDb().db().collection(collections.users).updateOne({ user_code: req.user.user_code }, { $set: { last_logout: new Date() } })

    //remove the token from session
    req.flash("token");

    log_info.info({ success: true, message: "logged out successfully" });
    return res.status(200).json({ success: true, message: "logged out successfully" });
  } catch (err) {
    next(err);
  }
};

exports.get_users_list = async (req, res, next) => {
  try {
    let result = await db.getDb().db().collection(collections.users).find({}).toArray();
    log_info.info({ success: true, result })
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.get_user_profile = async (req, res, next) => {
  try {
    let profile = req.user;
    log_info.info({ success: true, profile })
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};


/*
{
  "name": "user name",    ==> required
  "email": "user.mail@email.com", ==> required
  "phone": "+919876543210",
  "dob": "01-01-2000",
}
*/
exports.update_user_profile = async (req, res, next) => {
  try {
    let user_code = req.user.user_code;
    let data = { name, email, phone, dob } = req.body

    //check if a user already exists with the email
    if (req.user.email !== email) {
      let userExists = await db.getDb().db().collection(collections.users).findOne({ email });
      if (!_.isEmpty(userExists)) {
        var error = new Error("User already exists! Please try Logging in");
        error.status = 409;
        throw error;
      }
    }

    let updation_result = await db.getDb().db().collection(collections.users).updateOne({ user_code }, { $set: data })

    if (updation_result.modifiedCount) {
      await db.getDb().db().collection(collections.users).updateOne({ user_code }, { $set: { last_updated_on: new Date() } })
      log_info.info({ success: true, data: "Data Updated" })
      return res.status(200).json({ success: true, data: "Data Updated" });
    }

    if (updation_result.matchedCount) {
      var error = new Error("Nothing Modified")
      error.status = 304;
      throw error
    } else {
      throw new Error("Please re-login and retry")
    }
  } catch (err) {
    next(err);
  }
};
