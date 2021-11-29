const db = require("../../config/mongo");
const collections = require("../../data/collections");

exports.postAdd = async (req, res) => {
  let userData = req.user || req.body;
  if (!userData.role || !userData.companyId) {
    return res.status(403).json({ message: "Invalid User Login." });
  }
  let data = req.body;
  let filterQuery = { role: userData.role, companyId: userData.companyId };

  let updationData = { $set: {} };
  if (data.modulesEnabled) {
    updationData["$addToSet"] = {
      modulesEnabled: { $each: data.modulesEnabled },
    };
  }
  if (data.canCreateUser === true || data.canCreateUser === false) {
    updationData["$set"].canCreateUser = data.canCreateUser;
  }
  if (data.canCreateCustomer === true || data.canCreateCustomer === false) {
    updationData["$set"].canCreateCustomer = data.canCreateCustomer;
  }

  let result = await db.getDb().db().collection(collections.permissions).findOneAndUpdate(
    filterQuery,
    updationData,
    { upsert: true }
  );
  if (result.lastErrorObject.updatedExisting) {
    return res.status(200).json({ message: "Data Updated Successfully." });
  } else {
    return res
      .status(500)
      .json({ message: "Data not updated. Please try again later." });
  }
};

exports.postRevoke = async (req, res) => {
  let userData = req.user || req.body;
  if (!userData.role || !userData.companyId) {
    return res.status(403).json({ message: "Invalid User Login." });
  }
  let data = req.body;
  let filterQuery = { role: userData.role, companyId: userData.companyId };

  let updationData = {
    $set: {},
  };
  if (data.modulesEnabled) {
    updationData["$pullAll"] = { modulesEnabled: data.modulesEnabled };
  }
  if (data.canCreateUser === true || data.canCreateUser === false) {
    updationData["$set"].canCreateUser = data.canCreateUser;
  }
  if (data.canCreateCustomer === true || data.canCreateCustomer === false) {
    updationData["$set"].canCreateCustomer = data.canCreateCustomer;
  }

  let result = await db.getDb().db().collection(collections.permissions).findOneAndUpdate(
    filterQuery,
    updationData
  );
  if (result) {
    return res.status(200).json({ message: "Data Updated Successfully." });
  } else {
    return res
      .status(500)
      .json({ message: "Data not updated. Please try again later." });
  }
};

exports.getPermission = async (req, res) => {
  let userData = req.user || req.body;
  if (!userData.role || !userData.companyId) {
    return res.status(403).json({ message: "Invalid User Login." });
  }
  let query = { role: userData.role, companyId: userData.companyId };
  let result = await db.getDb().db().collection(collections.permissions).findOne(query);
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json({ message: "No data found." });
  }
};

exports.getAllPermissions = async (req, res) => {
  let result = await db.getDb().db().collection(collections.permissions).find({}).toArray();
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json({ message: "No data found." });
  }
};
