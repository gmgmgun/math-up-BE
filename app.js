const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./api/routes");
const bodyParser = require("body-parser");
const {globalErrorHandler} = require("./api/utils/error");

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(bodyParser.json()); // JSON 파싱을 위한 미들웨어 등록
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    })
  );
  app.use(morgan("dev"));
  app.use(routes);
  app.use(globalErrorHandler);

  return app;
};

module.exports = {createApp};
