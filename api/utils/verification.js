const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017/mydb");
const database = client.db("mydb");
const verification = database.collection("verification");

const verificationCode = async (phoneNumber, number, userName) => {
  return verification.findOne({
    verifyCode: number,
    phoneNumber: phoneNumber,
    name: userName,
  });
};

module.exports = { verificationCode };
