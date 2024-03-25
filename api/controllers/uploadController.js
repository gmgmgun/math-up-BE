const uploadService = require("../services/uploadService");
const { catchAsync } = require("../utils/error");

const upload = catchAsync(async (req, res) => {
  const [file] = req.files;

  if (!file) return res.status(400).json({ message: "NO_INPUT_FILES" });

  file.contact = req.body.contact;
  file.deleteCode = req.body.deleteCode;

  await uploadService.upload(file);
  return res.status(201).json({ message: "UPLOAD SUCCESS" });
});

const duplicateCheck = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { fileName } = req.query;
  const duplicate = await uploadService.duplicateCheck(userId, fileName);
  const result = duplicate
    ? res.status(200).json({ message: `${fileName}은 중복된 파일입니다.` })
    : res.status(200).json({ message: `중복된 파일이 없습니다.` });
  return result;
});

const checkUploadList = catchAsync(async (req, res) => {
  const userId = req.userId;
  const uploadList = await uploadService.checkUploadList(userId);
  return res.status(200).json({ data: uploadList });
});

module.exports = { upload, duplicateCheck, checkUploadList };
