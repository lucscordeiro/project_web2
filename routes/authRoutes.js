const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota raiz ('/') e Logout levam ao fluxo de login/dashboard
router.get('/', authController.redirectDashboard);
router.get('/login', authController.loginForm);
router.post('/login', authController.login);

router.get('/cadastro', authController.registerForm);
router.post('/cadastro', authController.register);

router.get('/aluno/cadastro', authController.registerStudentForm);
router.post('/aluno/cadastro', authController.registerStudent);

// ROTA DE LOGOUT: Deve redirecionar para /login após destruir a sessão.
router.get('/logout', authController.logout);

module.exports = router;