const multer = require("multer");

const upload = multer({
  fileFilter: function (req, file, done) {
    let typeArray = file.mimetype.split("/");
    let fileType = typeArray[1];
    if (
      fileType == "pdf" ||
      fileType == "hwp" ||
      fileType == "haansoftpdf" ||
      fileType == "haansofthwp"
    ) {
      done(null, true);
    } else {
      req.fileValidationError = "pdf or hwp 파일만 업로드 가능합니다.";
      done(null, false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 10,
  },
}).any();

module.exports = { upload };
