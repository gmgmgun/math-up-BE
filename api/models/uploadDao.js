const client = require("./database");
const files = client.db().collection("files");
const { throwCustomError } = require("../utils/error");

const insertFile = async (
  fileName,
  mimeType,
  date,
  size,
  contact,
  deleteCode
) => {
  const { acknowledged } = await files.insertOne({
    fileName: fileName,
    mimeType: mimeType,
    date: date,
    size: size,
    contact: contact,
    deleteCode: deleteCode,
  });

  if (!acknowledged) {
    throwCustomError("FAILED_TO_INSERT_DATA_TO_DB", 500);
  }

  return;
};

const duplicateCheck = async (userId, name) => {
  return fileUpload.findOne({ fileName: name, userId: userId });
};

const checkUploadList = async (userId) => {
  return fileUpload.find({ userId: userId }).toArray();
};

module.exports = { insertFile, duplicateCheck, checkUploadList };
