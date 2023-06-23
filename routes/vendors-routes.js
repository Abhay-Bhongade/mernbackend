const express = require('express');
const vendorsControllers = require('../controllers/vendors/vendors-controllers');
const { decrypt } = require('../utility/middleware/crypto');

const router = express.Router();

router.post('/signup', decrypt, vendorsControllers.signup);
router.post('/2faEmail', decrypt, vendorsControllers.twofa);

module.exports = router;