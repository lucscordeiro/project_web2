const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Course = require('../models/Course'); 
const Content = require('../models/Content'); 
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

const courseController = {

    // FUNÇÃO SIMPLIFICADA: APENAS RENDERIZA A VIEW HOME
    home: (req, res) => {
        res.render('home', { title: 'Dashboard Professor' });
    },

    // R - READ (INDEX) - APENAS CURSOS ATIVOS DO PROFESSOR LOGADO
    index: async (req, res) => { 
        const professorId = req.session.user.id;
        const courses = await Course.findAll({
             // CORRIGIDO: Filtra por deletado E pelo dono (UserId)
             where: { deletedAt: null, UserId: professorId }, 
             include: [{ model: Content, as: 'conteudos', attributes: ['id'] }]
        });
        const formattedCourses = courses.map(course => ({
            ...course.toJSON(), 
            conteudosCount: course.conteudos ? course.conteudos.length : 0 
        }));
        res.render('courses/index', { courses: formattedCourses, title: 'Meus Cursos' });
    },

    create: (req, res) => { res.render('courses/create', { title: 'Novo Curso' }); },
    
    // C - CREATE (STORE)
    store: async (req, res) => { 
        const { nome, descricao, status } = req.body;
        try {
            const newCourse = await Course.create({ 
                nome, 
                descricao, 
                status,
                UserId: req.session.user.id // Associa o curso ao ID do professor na sessão
            });
            req.flash('success', `Curso "${nome}" criado! Adicione os conteúdos.`);
            res.redirect(`/cursos/editar/${newCourse.id}`);
        } catch (error) {
            console.error("Erro ao criar curso:", error);
            req.flash('error', 'Erro ao criar curso. Verifique os dados.');
            res.redirect('/cursos/novo');
        }
    },

    // R - READ (EDIT FORM) - APENAS CONTEÚDO ATIVO
    edit: async (req, res) => {
        const { id } = req.params;
        
        const course = await Course.findByPk(id, {
            include: [
                // CORRIGIDO: Filtra APENAS conteúdo ATIVO (deletedAt: null)
                { model: Content, as: 'conteudos', where: { deletedAt: null }, required: false }, 
                { 
                    model: Student, 
                    as: 'students', 
                    attributes: ['id', 'nome', 'email'],
                    through: { where: { deletedAt: null }, attributes: [] } 
                }
            ]
        });
        
        // Verificação de Propriedade (Requisito de Segurança)
        if (!course || (course.UserId !== req.session.user.id && req.session.user.tipo !== 'gestao')) {
             req.flash('error', 'Acesso negado. Você não é o proprietário deste curso.');
             return res.redirect('/cursos');
        }

        res.render('courses/edit', { course: course.toJSON(), title: 'Gerenciar Curso' });
    },

    // U - UPDATE
    update: async (req, res) => { 
        const { id } = req.params;
        const { nome, descricao, status } = req.body;

        // Adicionar verificação de propriedade aqui também
        const course = await Course.findByPk(id);
        if (!course || (course.UserId !== req.session.user.id && req.session.user.tipo !== 'gestao')) {
             req.flash('error', 'Acesso negado. Você não é o proprietário deste curso.');
             return res.redirect('/cursos');
        }

        try {
            await Course.update({ nome, descricao, status }, { where: { id: id } });
            req.flash('success', `Curso "${nome}" atualizado com sucesso.`);
            res.redirect('/cursos');
        } catch (error) {
            req.flash('error', 'Erro ao atualizar curso.');
            res.redirect(`/cursos/editar/${id}`);
        }
    },

    // D - DELETE (SOFT DELETE)
    delete: async (req, res) => { 
        const { id } = req.params;
        await Course.destroy({ where: { id: id } });
        req.flash('success', 'Curso excluído com sucesso! (Movido para o histórico)');
        res.redirect('/cursos');
    },

    // Conteúdo (Soft Delete)
    storeContent: async (req, res) => { 
        const { id: courseId } = req.params;
        const { titulo, categoria, formato, link } = req.body; 
        
        await Content.create({ titulo, categoria, formato, link, courseId });
        req.flash('success', `Conteúdo "${titulo}" adicionado ao curso.`);
        res.redirect(`/cursos/editar/${courseId}`);
    },

    deleteContent: async (req, res) => { 
        const { id: courseId, contentId } = req.params;
        await Content.destroy({ where: { id: contentId } });
        req.flash('success', 'Conteúdo removido com sucesso.');
        res.redirect(`/cursos/editar/${courseId}`);
    }
};

module.exports = courseController;