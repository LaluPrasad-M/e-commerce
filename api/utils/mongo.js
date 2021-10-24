const { MongoClient, ObjectID } = require("mongodb");

const { MONGODB_URL } = require("../../resources/mongoConfig");
const client = new MongoClient(MONGODB_URL);

exports.ObjectId = ObjectID;

exports.findOne = async (db, collection, query) => {
  try {
    if (!query) {
      query = {};
    }
    await client.connect();
    const result = await client.db(db).collection(collection).findOne(query);
    if (result) {
      return result;
    } else {
      console.log("Nothing Found", query);
      return undefined;
    }
  } catch (e) {
    console.log(e.message);
    return undefined;
  } finally {
    client.close();
  }
};

exports.find = async (db, collection, query) => {
  try {
    if (!query) {
      query = {};
    }
    await client.connect();
    const result = await client
      .db(db)
      .collection(collection)
      .find(query)
      .toArray();
    if (result) {
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

exports.insertOne = async (db, collection, data) => {
  try {
    if (!data) {
      console.log("Nothing inserted");
      return [];
    }
    await client.connect();
    const result = await client.db(db).collection(collection).insertOne(data);
    if (result) {
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

exports.insertMany = async (db, collection, data) => {
  try {
    if (!data) {
      console.log("Nothing inserted");
      return [];
    }
    await client.connect();
    const insertData = await client
      .db(db)
      .collection(collection)
      .insertMany(data);
    if (insertData.insertedCount > 0) {
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

exports.update = async (db, collection, query, data) => {
  try {
    if (!query || !data) {
      console.log("Nothing Updated");
      return [];
    }
    await client.connect();
    const result = await client
      .db(db)
      .collection(collection)
      .updateOne(query, { $set: data });
    if (result) {
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

exports.deleteOne = async (db, collection, query) => {
  try {
    if (!query) {
      query = {};
    }
    await client.connect();
    const result = await client.db(db).collection(collection).deleteOne(query);
    if (result) {
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

exports.deleteMany = async (db, collection, query) => {
  try {
    if (!query) {
      query = {};
    }
    await client.connect();
    const result = await client.db(db).collection(collection).deleteMany(query);
    if (result) {
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
