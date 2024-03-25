const express = require("express");
const { upload } = require("../utils/upload");
const router = express.Router();
const { validateToken } = require("../utils/auth");
const uploadController = require("../controllers/uploadController");

router.post("/dragndrop", upload, uploadController.upload);
router.get("/checkname", validateToken, uploadController.duplicateCheck);
router.get("/checklist", validateToken, uploadController.checkUploadList);

module.exports = { router };
