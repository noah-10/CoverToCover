const models = require("../models");
const db = require("../config/connection");

module.exports = async (modelName, collectionName) => {
    try {
        // get the collection with the name collectionName
        let modelExists = await models[modelName].db.db.listCollections({
            name: collectionName
        }).toArray();

        // if it exists, drop it
        if (modelExists.length) {
            await db.dropCollection(collectionName);
        }
    } catch (error) {
        throw error;
    }
}