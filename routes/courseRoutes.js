const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');

// O Middleware de autenticação se aplica a TUDO que não é login/cadastro
router.use(authMiddleware);

// Middleware para verificar se o usuário é PROFESSOR
const professorAuth = (req, res, next) => {
    if (req.session.user.tipo === 'professor') {
        return next();
    }
    req.flash('error', 'Acesso negado. Apenas professores.'); // Adiciona feedback
    res.redirect('/aluno/dashboard'); 
};

// Middleware para verificar se o usuário é ALUNO
const alunoAuth = (req, res, next) => {
    if (req.session.user.tipo === 'aluno') {
        return next();
    }
    req.flash('error', 'Acesso negado. Apenas alunos.'); // Adiciona feedback
    res.redirect('/home'); 
};

// ===================================
// ROTAS DE PROFESSOR
// ===================================
router.get('/home', professorAuth, courseController.home);
router.get('/cursos', professorAuth, courseController.index);
router.get('/cursos/novo', professorAuth, courseController.create);
router.post('/cursos/novo', professorAuth, courseController.store);
router.get('/cursos/editar/:id', professorAuth, courseController.edit);
router.post('/cursos/editar/:id', professorAuth, courseController.update);
router.post('/cursos/excluir/:id', professorAuth, courseController.delete); // Soft Delete

// Rotas de Conteúdo
router.post('/cursos/:id/conteudos', professorAuth, courseController.storeContent);
router.post('/cursos/:id/conteudos/:contentId/delete', professorAuth, courseController.deleteContent);


// ===================================
// ROTAS DE ALUNO
// ===================================
router.get('/aluno/dashboard', alunoAuth, studentController.dashboard);
router.post('/aluno/matricular/:courseId', alunoAuth, studentController.enroll);
router.post('/aluno/desmatricular/:courseId', alunoAuth, studentController.unenroll);
router.get('/aluno/curso/:courseId', alunoAuth, studentController.viewCourse);

module.exports = router;