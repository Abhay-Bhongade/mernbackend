const express = require('express');
const { check } = require('express-validator');
const usersControllers = require('../controllers/users/users-controllers');
const { decrypt } = require('../utility/middleware/crypto');

const router = express.Router();

router.post('/signup', decrypt, usersControllers.signup);

router.post('/login', decrypt, usersControllers.login);

module.exports = router;