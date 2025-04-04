const { MongoClient } = require('mongodb');
const { MONGO_URI, DB_NAME } = require('./config');

const client = new MongoClient(MONGO_URI);

async function connectToDB() {
    if (!client.isConnected) await client.connect();
    return client.db(DB_NAME);
}

async function closeConnection() {
    await client.close();
}

module.exports = { connectToDB, closeConnection };
