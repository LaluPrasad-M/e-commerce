const _ = require("lodash");
const log4js = require("log4js");

const db = require("../../config/mongo");
const commonUtils = require("../utils/commonUtils");
const collections = require("../../data/collections");

const log_info = log4js.getLogger("info")

/*
{
  "role_name":"Role Name", ==> required
  "company_name":"Company Name",  ==> required
  "user_type":"admin" | "manager" | "employee" | "customer", ==> default: "customer"
  "requires_login":true | false ==> default: true
}
*/
exports.postRoles = async function (req, res, next) {
  try {
    let data = {
      ...req.body,
      role_code: await commonUtils.makeId(10, req.body.role_name),
      created_on: new Date(),
      last_updated_on: new Date()
    }

    let result = await db.getDb().db().collection(collections.roles).insertOne(data);

    if (!_.isEmpty(JSON.json_stringify(result.insertedId))) {
      log_info.info({ success: true, data: { ...result, role_code: data.role_code } })
      return res.status(201).json({ success: true, data: { ...result, role_code: data.role_code } });
    } else {
      throw new Error("Nothing Inserted. Please try again later");
    }
  } catch (err) {
    next(err)
  }
}

exports.getRoles = async function (req, res, next) {
  try {
    let result = await db.getDb().db().collection(collections.roles).find({}).toArray();
    log_info.info({ success: true, data: result })
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
