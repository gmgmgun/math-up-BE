require("dotenv").config();
const PORT = process.env.PORT;
const { createApp } = require("./app");
const app = createApp();
const client = require('./api/models/database');

const startServer = async () => {
  try {
    await client.connect();
    app.listen(PORT, () => {
      console.log(`Server is Listening on ${PORT}`);
    });
  } catch (e) {
    console.error(e);
    client.close();
  }
};

startServer();
