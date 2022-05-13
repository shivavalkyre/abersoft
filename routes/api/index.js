const express = require('express');
const router = express.Router();

// PATH FOLDER
// AUTH
const auth = require('./auth');

router.use(`/auth`, auth);



module.exports = router;