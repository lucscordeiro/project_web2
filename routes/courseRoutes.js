const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// --- Rotas Principais ---
router.get('/home', courseController.home);
router.get('/cursos', courseController.index);

// --- Criar Curso ---
router.get('/cursos/novo', courseController.create);
router.post('/cursos/novo', courseController.store);

// --- Editar e Excluir Curso ---
router.get('/cursos/editar/:id', courseController.edit);
router.post('/cursos/editar/:id', courseController.update);
router.post('/cursos/excluir/:id', courseController.delete);

// --- NOVO: Rotas para Gerenciar Conteúdos (Aulas) ---
// Esta é a rota que estava faltando ou dando erro
router.post('/cursos/:id/conteudos', courseController.storeContent);

// Rota para remover uma aula específica
router.post('/cursos/:id/conteudos/:contentId/delete', courseController.deleteContent);

module.exports = router;