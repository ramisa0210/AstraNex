const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// @route POST /api/auth/register
router.post('/register', register);

// @route POST /api/auth/login
router.post('/login', login);

module.exports = router;
