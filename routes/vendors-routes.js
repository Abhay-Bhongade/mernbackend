const express = require('express');
const vendorsControllers = require('../controllers/vendors/vendors-controllers');
const { decrypt } = require('../utility/middleware/crypto');

const router = express.Router();

router.post('/signup', decrypt, vendorsControllers.signup);

module.exports = router;