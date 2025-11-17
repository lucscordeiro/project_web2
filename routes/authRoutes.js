const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.loginForm); // Login
router.get('/login', authController.loginForm);
router.post('/login', authController.login);
router.get('/cadastro', authController.registerForm);
router.post('/cadastro', authController.register);

module.exports = router;