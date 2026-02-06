const express = require('express');
const identityController = require('../controllers/identityController');

const router = express.Router();

router.post('/register', identityController.register);
router.post('/login', identityController.login);

module.exports = router;
