const express = require("express");
const router = express.Router();

const uploadRouter = require("./uploadRouter");
const userRouter = require("./userRouter");

router.use("/files", uploadRouter.router);
router.use("/users", userRouter.router);

module.exports = router;
