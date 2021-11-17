const _ = require("lodash");
const { MongoClient, ObjectID } = require("mongodb");
const { MONGODB_URL, DB_1 } = require("../../config/mongoConfig");

const client = new MongoClient(MONGODB_URL);
const db = client.db(DB_1);

exports.ObjectId = ObjectID;

exports.findOne = async (collection, query, options) => {
  try {
    if (_.isEmpty(query)) {
      query = {};
    }
    if (_.isEmpty(options)) {
      options = {}
    }
    await client.connect();
    let result = await db.collection(collection).findOne(query, options);
    console.log(result);
    return result;
  } catch (e) {
    console.log(e.message);
    return null;
  } finally {
    client.close();
  }
};

exports.find = async (collection, query, options) => {
  try {
    if (_.isEmpty(query)) {
      query = {};
    }
    if (_.isEmpty(options)) {
      options = {}
    }
    await client.connect();
    let result = await db.collection(collection).find(query, options).toArray();
    console.log(result);
    return result;
  } catch (e) {
    console.log(e.message);
    return null;
  } finally {
    client.close();
  }
};

exports.findOneAndUpdate = async (collection, filterQuery, data, callback) => {
  try {
    if (_.isEmpty(filterQuery)) {
      console.log("Nothing Updated");
      return null;
    }
    if (_.isEmpty(callback)) {
      callback = {};
    }
    await client.connect();
    let result = await db.collection(collection).findOneAndUpdate(filterQuery, data, callback);
    return result.lastErrorObject.updatedExisting;
  } catch (e) {
    console.log(e.message);
    return null;
  } finally {
    client.close();
  }
};

exports.insertOne = async (collection, data) => {
  try {
    if (_.isEmpty(data)) {
      console.log("Nothing inserted");
      return null;
    }
    await client.connect();
    let result = await db.collection(collection).insertOne(data);
    console.log(result);
    return result;
  } catch (e) {
    console.log(e.message);
    return null;
  } finally {
    client.close();
  }
};

exports.insertMany = async (collection, data) => {
  try {
    if (_.isEmpty(data)) {
      console.log("Nothing inserted");
      return [];
    }
    await client.connect();
    const result = await db.collection(collection).insertMany(data);
    console.log(result);
    return result;
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.update = async (collection, query, data) => {
  try {
    if (_.isEmpty(query) || _.isEmpty(data)) {
      console.log("Nothing Updated");
      return [];
    }
    await client.connect();
    let result = await db.collection(collection).updateOne(query, { $set: data });
    console.log(result);
    return result;
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.deleteOne = async (collection, query) => {
  try {
    if (_.isEmpty(data)) {
      query = {};
    }
    await client.connect();
    let result = await db.collection(collection).deleteOne(query);
    console.log(result);
    return result;
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.deleteMany = async (collection, query) => {
  try {
    if (_.isEmpty(query)) {
      query = {};
    }
    await client.connect();
    let result = await db.collection(collection).deleteMany(query);
    console.log(result);
    return result;
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};
