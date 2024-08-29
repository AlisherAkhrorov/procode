const express = require('express');
const { getProcode } = require('./controller');

const router = express.Router();

console.log('hererouter');

router.post('/procode', getProcode);

module.exports = router;
