const { MongoClient, ObjectID } = require("mongodb");
const { MONGODB_URL, DB_1 } = require("../../config/mongoConfig");

const client = new MongoClient(MONGODB_URL);
const db = client.db(DB_1);

exports.ObjectId = ObjectID;

exports.findOne = async (collection, query) => {
  try {
    if (!query) {
      query = {};
    }
    await client.connect();
    const result = await db.collection(collection).findOne(query);
    if (result) {
      console.log(result);
      return result;
    } else {
      console.log("Nothing Found", query);
      return null;
    }
  } catch (e) {
    console.log(e.message);
    return null;
  } finally {
    client.close();
  }
};

exports.find = async (collection, query, projection) => {
  try {
    if (!query) {
      query = {};
    }
    if (!projection) {
      projection = {};
    }
    await client.connect();
    const result = await db
      .collection(collection)
      .find(query)
      .project(projection)
      .toArray();
    if (result) {
      console.log(result);
      return result;
    } else {
      console.log("Nothing Found", query);
      return [];
    }
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.findOneAndUpdate = async (collection, filterQuery, data) => {
  try {
    if (!filterQuery) {
      console.log("Nothing Updated");
      return null;
    }
    await client.connect();
    const result = await db
      .collection(collection)
      .findOneAndUpdate(filterQuery, data, { upsert: true });
    if (result) {
      console.log(result);
      return result;
    } else {
      console.log("Nothing Updated");
      return null;
    }
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.insertOne = async (collection, data) => {
  try {
    if (!data) {
      console.log("Nothing inserted");
      return [];
    }
    await client.connect();
    const result = await db.collection(collection).insertOne(data);
    if (result) {
      console.log(result);
      return result;
    } else {
      console.log("Nothing Found", query);
      return [];
    }
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.insertMany = async (collection, data) => {
  try {
    if (!data) {
      console.log("Nothing inserted");
      return [];
    }
    await client.connect();
    const insertData = await db.collection(collection).insertMany(data);
    if (insertData.insertedCount > 0) {
      console.log(insertData);
      return insertData;
    } else {
      console.log("Nothing inserted");
      return [];
    }
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.update = async (collection, query, data) => {
  try {
    if (!query || !data) {
      console.log("Nothing Updated");
      return [];
    }
    await client.connect();
    const result = await db
      .collection(collection)
      .updateOne(query, { $set: data });
    if (result) {
      console.log(result);
      return result;
    } else {
      console.log("Nothing Updated");
      return [];
    }
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.deleteOne = async (collection, query) => {
  try {
    if (!query) {
      query = {};
    }
    await client.connect();
    const result = await db.collection(collection).deleteOne(query);
    if (result) {
      console.log(result);
      return result;
    } else {
      console.log("Nothing deleted");
      return [];
    }
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};

exports.deleteMany = async (collection, query) => {
  try {
    if (!query) {
      query = {};
    }
    await client.connect();
    const result = await db.collection(collection).deleteMany(query);
    if (result) {
      console.log(result);
      return result;
    } else {
      console.log("Nothing deleted");
      return [];
    }
  } catch (e) {
    console.log(e.message);
    return [];
  } finally {
    client.close();
  }
};
