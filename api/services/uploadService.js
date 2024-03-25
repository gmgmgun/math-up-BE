const moment = require("moment");
const path = require("path");
const stream = require("stream");
const {google} = require("googleapis");
const uploadDao = require("../models/uploadDao");
const {throwCustomError} = require("../utils/error");
const credentials = path.resolve(
  path.join(__dirname, "../../", "google-api", "credentials.json")
);

const upload = async (file) => {
  await writeFileInfoToGoogleSheet(file, (range = "Sheet1!A2"));

  changeFileNameEncoding(file);
  if (!(await uploadFileToGoogleDrive(file))) {
    return false;
  }

  const [fileName, mimeType, date, size, contact, deleteCode] =
    getFileInfo(file);

  await uploadDao.insertFile(
    fileName,
    mimeType,
    date,
    size,
    contact,
    deleteCode
  );

  return true;
};

const writeFileInfoToGoogleSheet = async (file, range) => {
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
  const googleSheetsID = process.env.GOOGLE_SHEETS_SHEETS_ID;

  const auth = new google.auth.GoogleAuth({
    keyFile: credentials,
    scopes: scopes,
  });

  const sheets = google.sheets({version: "v4", auth});
  const valueInputOption = "raw";

  const values = [[file.originalname, file.mimetype, file.size]];

  const resource = {values};
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: googleSheetsID,
    range,
    valueInputOption,
    insertDataOption: "INSERT_ROWS",
    resource: resource,
  });

  console.log(`${response.data.updates.updatedCells} cells updated.`);
};

const changeFileNameEncoding = (file) => {
  file.originalname = new Buffer.from(file.originalname, "latin1").toString(
    "utf8"
  );
};

const getFileInfo = (file) => {
  const fileName = file.originalname;

  const mimeType = file.mimetype;
  const date = moment().format("YYYY-MM-DD HH:mm:ss");
  const size = (file.size / 1048576).toFixed(2) + "MB";
  return [fileName, mimeType, date, size, file.contact, file.deleteCode];
};

const uploadFileToGoogleDrive = async (file) => {
  const googleDriveFolderID = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const scopes = ["https://www.googleapis.com/auth/drive"];
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(
      path.join(__dirname, "../../", "google-api", "credentials.json")
    ),
    scopes: scopes,
  });

  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    const {data} = await google
      .drive({
        version: "v3",
        auth: auth,
      })
      .files.create({
        media: {
          mimeType: file.mimeType,
          body: bufferStream,
        },
        requestBody: {
          name: file.originalname,
          parents: [googleDriveFolderID],
        },
        fields: "id, name",
      });
    return data ? true : false;
  } catch (err) {
    throwCustomError("FAILED_TO_UPLOAD_GOOGLE_DRIVE", 400);
  }
};

const duplicateCheck = async (userId, fileName) => {
  return uploadDao.duplicateCheck(userId, fileName);
};

const checkUploadList = async (userId) => {
  return uploadDao.checkUploadList(userId);
};
module.exports = {upload, duplicateCheck, checkUploadList};
