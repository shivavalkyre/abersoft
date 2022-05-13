const express = require('express');
const router = express.Router();

// PATH FOLDER
// AUTH
const auth = require('./auth');
const customer = require('./customer');

router.use(`/auth`, auth);



// region CUSTOMER API
router.use(`/customer`, customer);


module.exports = router;