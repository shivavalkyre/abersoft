const express = require('express');
const router = express.Router();
// const checkAuthEmployee = require('../../middleware/check-auth-employees');
// const checkAuthAdmin = require('../../middleware/check-auth-admin');
const url1 = '/admin';

// region WEB
// --- -------------------------------------------- WEB -----------------------------------------------
// PATH FOLDER
// AUTH
const web_auth = require('./web/auth');

// PATH URL / API
// region AUTH
router.use(`${url1}/auth`, web_auth);

// endregion

module.exports = router;