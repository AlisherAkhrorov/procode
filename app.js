require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const routerRouter = require("./router.js");
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use("/", routerRouter);


const start = async (req, res) => {
  try {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();