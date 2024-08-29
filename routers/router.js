const express = require("express");
const { getProcode } = require("../controllers/controller");

const router = express.Router();

router.post("/procode", async (req, res, next) => {
  try {
    getProcode(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
