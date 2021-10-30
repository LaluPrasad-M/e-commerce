const mongo = require("../utils/mongo");
const collections = require("../../data/collections");

exports.postAdd = async (req, res) => {
  let userData = req.userData || req.body;
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
  if (data.canCreateUser) {
    updationData["$set"].canCreateUser = data.canCreateUser;
  }
  if (data.canCreateCustomer) {
    updationData["$set"].canCreateCustomer = data.canCreateCustomer;
  }

  const result = await mongo.findOneAndUpdate(
    collections.permissions,
    filterQuery,
    updationData
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
  let userData = req.userData || req.body;
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
  if (data.canCreateUser) {
    updationData["$set"].canCreateUser = data.canCreateUser;
  }
  if (data.canCreateCustomer) {
    updationData["$set"].canCreateCustomer = data.canCreateCustomer;
  }

  const result = await mongo.findOneAndUpdate(
    collections.permissions,
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
  let userData = req.userData || req.body;
  if (!userData.role || !userData.companyId) {
    return res.status(403).json({ message: "Invalid User Login." });
  }
  let query = { role: userData.role, companyId: userData.companyId };
  const result = await mongo.findOne(collections.permissions, query);
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json({ message: "No data found." });
  }
};

exports.getAllPermissions = async (req, res) => {
  const result = await mongo.find(collections.permissions);
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json({ message: "No data found." });
  }
};
