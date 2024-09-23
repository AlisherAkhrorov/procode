const express = require("express");
const { getProcode } = require("../controllers/controller");
const errorHandler = require("../middlewares/errorHandler");

const router = express.Router();

router.post("/procode", async (req, res, next) => {
  try {
    getProcode(req, res, next);
  } catch (err) {
    next(err);
  }
}, errorHandler);

module.exports = router;
