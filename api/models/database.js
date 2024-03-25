const { MongoClient } = require("mongodb");
const dbName = "pdfUploaderDB";
const url = `mongodb://localhost:27017/${dbName}`;
const client = new MongoClient(url);

module.exports = client;