const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
    
global.dbName = "GotRpg";

async function testingDb() {
    try {
      await client.connect();
      await createDb(client, dbName);
      //await createCollection(client, dbName, "Characters");
  
      //Character JSON objects
      /*     let character_1 = {
        _id: 1,
        id: 1,
        name: "Jon Snow",
        treat: "Knows nothing",
        relations: "Bastard and a Targaryen",
      };
  
      await createDoc(client, dbName, "Characters", character_1); */
      /*
      let character_2 = {
          "_id" : "Ch1",
          "id" : 2,
          "name" : "Jon Snow",
          "treat" : "Knows nothing",
          "relations" : "Bastard and a Targaryen",
      }
  
      let character_3 = {
          "id" : 5,
          "name" : "Jon Snow",
          "treat" : "Knows nothing",
          "relations" : "Bastard and a Targaryen",
      } */
  
      // Create exactly ONE document
      // await createDoc (client, dbName, "Characters", character_2);
  
      //Create many documents
      /* await createDocs (client, dbName, "Characters", [
           character_1, character_3
      ]); */
  
      /* QUERY and FIND data */
      //List all document Data
      /*const characters = await listAll(client, dbName, "Characters");
      console.log(characters[0].name);*/
  
      //Find a SPECIFIC document
      /* const Tyrion = await findOne(client, dbName, "Characters", "name", "Jon Snow");
      console.log(Tyrion); */
  
      //Mass data for testing query builder
      /* await createDocs(client, dbName, "Weapons", [
          {"name": "Sword", "damage": "1d8", "price": 200},
          {"name": "Great Sword", "damage": "1d12", "price": 400 },
          {"name": "Bow", "damage": "1d10", "price": 300}
      ]); */
  
      /* Query builder (=, >, <, stb.) */
      const weapons = await QueryBuilder(
        client,
        dbName,
        "Weapons",
        "price",
        "$gt",
        [100, 231, 1210, 12, 200]
      );
      console.log("Teszt QUERY");
      console.log(weapons);
  
      //Query builder with regex
      const weapons2 = await QueryBuilder(
        client,
        dbName,
        "Weapons",
        "name",
        "$regex",
        "Swo"
      );
      console.log("Teszt REGEX");
      console.log(weapons2);
  
      //Sort results
      const sortByPrice = await SortBy(client, dbName, "Weapons", "name", 1);
      console.log("TESZT SORT");
      console.log(sortByPrice);
  
      //Drop collection
  
      await deleteOne(client, dbName, "Weapons", "name", "Sword");
  
      await deleteMany(client, dbName, "Weapons", "price", "$gt", 200);
  
      await deleteCollection(client, dbName, "Weapons");
  
      //Update
      //await updateOne(client, dbName, "Characters", {"id": 1}, {"id": 2, "name": "Aryia"});
  
      await updateMany(
        client,
        dbName,
        "Characters",
        { id: 1 },
        { id: 2, name: "Aryia" }
      );
  
      await deleteCollection(client, dbName, "Inventory");
      await deleteCollection(client, dbName, "Shopkeeper");
      await deleteCollection(client, dbName, "Shop");
  
      await createDocs(client, dbName, "Inventory", [
        { itemId: 1, name: "Potion", price: 100, qty: 20 },
        { itemId: 2, name: "High-Potion", price: 200, qty: 10 },
        { itemId: 3, name: "Mega-Potion", price: 300, qty: 5 },
        { itemId: 4, name: "Phoenix Down", price: 400, qty: 1 },
      ]);
  
      await createDocs(client, dbName, "Shopkeeper", [
        { shopKeeperId: 1, name: "Potion Polter Sr.", shop_id: 1 },
        { shopKeeperId: 2, name: "High-Potion Polter Jr.", shop_id: 1},
        { shopKeeperId: 1, name: "Potion Paulo Sr.", shop_id: 2 },
        { shopKeeperId: 2, name: "High-Potion Paulo Jr.", shop_id: 2},
      ]);
  
      await createDocs(client, dbName, "Shop", [
        { shopId: 1, name: "Polter and Son Inc." },
        { shopId: 2, name: "Paulo Junior Ltd." },
      ]);
  
  
      //JOIN DOCUMENTS
      const joinedResult = await joinDocuments(client, dbName, "Shop", "Shopkeeper", "shopId", "shop_id", "ShopWorkers"  );
      console.log(joinedResult[1]);
  
    } catch (error) {
      console.log(error);
    } finally {
      await client.close();
    }
}
  
  
async function createDb(client, dbName) 
{
    const dbObject = await client.db(dbName);
    console.log(`${dbName} was created successfully.`);
}
  
  async function createCollection(client, dbName, collectionName) 
  {
    const dbObject = await client.db(dbName);
    const collection = await dbObject.createCollection(collectionName);
    console.log(`${collection} was created successfully`);
  }
  
  async function createDoc(client, dbName, collectionName, doc) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    const result = await collection.insertOne(doc);
    console.log(
      `The new document was created with the following id: ${result.insertedId}`
    );
  }
  
  async function createDocs(client, dbName, collectionName, docs) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    const result = await collection.insertMany(docs);
    console.log(`The new document was created with the following ids:`);
    console.log(result.insertedIds);
  }
  
  async function listAll(client, dbName, collectionName) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    const result = await collection.find({}).toArray();
    return result;
  }
  
  async function findOne(client, dbName, collectionName, key, value) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    const result = await collection.find({ [key]: value }).toArray();
    return result[0];
  }
  
  //$eq (==), $gt (>), $gte (>=), lt (<), lte  (<=), $ne (!=), $nin (!= with any value (NOT IN)), $in (= with any value (IN))
  async function QueryBuilder(client,dbName,collectionName,key,operator,conditionValue)
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    const result = collection
      .find({ [key]: { [operator]: conditionValue } })
      .toArray();
    return result;
  }
  
  async function SortBy(client, dbName, collectionName, sortByKey, direction) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    const result = collection
      .find({})
      .sort({ [sortByKey]: direction })
      .toArray();
    return result;
  }
  
  async function deleteOne(client, dbName, collectionName, key, value) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    const result = await collection.deleteOne({ [key]: value });
    console.log(`${value} was deleted successfully!`);
  }

  async function deleteMany(client,dbName,collectionName,key,condition,conditionValue) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    await collection.deleteMany({ [key]: { [condition]: conditionValue } });
    console.log(`The items was deleted successfully!`);
  }
  
  async function deleteCollection(client, dbName, collectionName) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    await collection.drop();
    console.log(`The collection was deleted successfully!`);
  }
  
  async function updateOne(client, dbName, collectionName, filter, set) 
  {
    const updateTo = { $set: set };
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    await collection.updateOne(filter, updateTo);
    console.log("The collection's data was updated successfully.");
  }
  
  async function updateMany(client, dbName, collectionName, filter, set) 
  {
    const updateTo = { $set: set };
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName);
    await collection.updateMany(filter, updateTo);
    console.log("The collection's data was updated successfully.");
  }

  async function joinDocuments(client,dbName,collectionName_1,collectionName_2,localKey,foreignKey,nameAs) 
  {
    const dbObject = await client.db(dbName);
    const collection = dbObject.collection(collectionName_1);
  
    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: collectionName_2,
            localField: localKey,
            foreignField: foreignKey,
            as: nameAs,
          },
        },
      ])
      .toArray();
  
      return result;
  }

module.exports = {
    createDb : createDb,
    createCollection : createCollection,
    createDoc : createDoc,
    createDocs : createDocs,
    listAll : listAll,
    findOne : findOne,
    QueryBuilder : QueryBuilder,
    SortBy : SortBy,
    deleteOne : deleteOne,
    deleteMany: deleteMany,
    deleteCollection : deleteCollection,
    updateOne : updateOne,
    updateMany : updateMany,
    joinDocuments : joinDocuments
}