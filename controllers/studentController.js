const bcrypt = require('bcryptjs'); 
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Content = require('../models/Content');
const Enrollment = require('../models/Enrollment');

const studentController = {
    // FUNÇÕES DE CADASTRO
    registerForm: (req, res) => {
        res.render('auth/register_student', { title: 'Cadastro Aluno' });
    },
    register: async (req, res) => { 
        const { nome, email, password } = req.body;
        if (await Student.findOne({ where: { email } })) {
            req.flash('error', 'Erro: Email já cadastrado como Aluno.');
            return res.redirect('/aluno/cadastro');
        }
        await Student.create({ nome, email, password: bcrypt.hashSync(password, 10), tipo: 'aluno' });
        req.flash('success', 'Aluno cadastrado com sucesso! Faça login.');
        res.redirect('/login');
    },
    
    // Desmatrícula (USA SOFT DELETE)
    unenroll: async (req, res) => {
        const { courseId } = req.params;
        const studentId = req.session.user.id; 
        
        // Usa .destroy() para ativar o campo deletedAt (Soft Delete)
        const result = await Enrollment.destroy({ 
            where: { studentId, courseId } 
        });

        if (result === 1) {
            req.flash('success', 'Aluno desmatriculado com sucesso! Matrícula arquivada.');
        } else {
            req.flash('error', 'Erro: Matrícula não encontrada ou já arquivada.');
        }
        
        res.redirect('/aluno/dashboard');
    },

    // Matrícula (USA RESTORE SE JÁ EXISTIA)
    enroll: async (req, res) => {
        const { courseId } = req.params;
        const studentId = req.session.user.id; 
        
        // 1. Tenta restaurar se o registro foi deletado (paranoid: true)
        const restored = await Enrollment.restore({ where: { studentId, courseId } });

        if (restored > 0) {
            // Se restaurado (estava desmatriculado)
            req.flash('success', 'Aluno re-matriculado com sucesso!');
        } else {
            // 2. Se não existia, cria um novo.
            const student = await Student.findByPk(studentId);
            const course = await Course.findByPk(courseId);

            if (student && course) {
                 await Enrollment.create({ 
                    studentId: studentId, 
                    courseId: courseId, 
                    status: 'matriculado'
                }); 
                req.flash('success', 'Aluno matriculado com sucesso!');
            } else {
                req.flash('error', 'Erro ao matricular: Curso ou aluno não encontrado.');
            }
        }
        res.redirect('/aluno/dashboard');
    },

    // Dashboard: Lista Cursos Ativos e status de Matrícula - ATUALIZADO
    dashboard: async (req, res) => {
        const studentId = req.session.user.id; 

        // Busca todos os cursos ativos E finalizados (para histórico)
        const allCourses = await Course.findAll({ 
            where: { 
                deletedAt: null 
            }, 
            include: [{
                model: Student, 
                as: 'students',
                where: { id: studentId },
                required: false,
                through: { attributes: ['deletedAt', 'createdAt', 'updatedAt'] } 
            }] 
        });

        // Separa os cursos por status
        const cursosComStatus = allCourses.map(c => {
            const enrollmentRecord = c.students && c.students.length > 0 ? c.students[0].Enrollment : null;
            const isMatriculated = enrollmentRecord && enrollmentRecord.deletedAt === null;
            const isUnenrolled = enrollmentRecord && enrollmentRecord.deletedAt !== null; 
            
            return {
                ...c.toJSON(),
                isMatriculated: isMatriculated,
                isUnenrolled: isUnenrolled,
                // Adiciona data de matrícula para ordenação
                enrollmentDate: enrollmentRecord ? enrollmentRecord.createdAt : null
            };
        });

        // Filtra cursos para diferentes seções
        const inscricoesAbertas = cursosComStatus.filter(c => 
            !c.isMatriculated && !c.isUnenrolled && c.status === 'Inscrições Abertas'
        );

        const matriculados = cursosComStatus.filter(c => 
            c.isMatriculated && c.status !== 'Finalizado'
        );

        const emAndamento = cursosComStatus.filter(c => 
            c.isMatriculated && c.status === 'Em Andamento'
        );

        // HISTÓRICO CORRIGIDO: apenas cursos finalizados ou que o aluno participou e foram encerrados
        const historico = cursosComStatus.filter(c => 
            // Curso finalizado E aluno estava matriculado
            (c.status === 'Finalizado' && c.isMatriculated) ||
            // Ou curso com status diferente mas aluno participou (matriculado) e curso foi "encerrado" (não está ativo)
            (c.isMatriculated && !['Inscrições Abertas', 'Em Andamento', 'Pausado'].includes(c.status))
        );

        res.render('student/dashboard', { 
            inscricoesAbertas,
            matriculados, 
            emAndamento,
            historico,
            title: 'Dashboard Aluno' 
        });
    },
    
    // Visualização de Conteúdo (Protegido por Matrícula)
    viewCourse: async (req, res) => {
        const { courseId } = req.params;
        const studentId = req.session.user.id;
        
        // 1. Checa se há uma matrícula ATIVA (deletedAt é NULL)
        const enrollment = await Enrollment.findOne({ 
            where: { 
                studentId, 
                courseId, 
                deletedAt: null // Garante que a matrícula não foi removida
            } 
        });

        if (!enrollment) {
            req.flash('error', 'Acesso negado. Você não está matriculado neste curso.');
            return res.redirect('/aluno/dashboard');
        }

        // 2. Busca o curso e seus conteúdos
        const course = await Course.findByPk(courseId, {
            // Filtra o conteúdo para mostrar APENAS itens ativos
            include: [{ model: Content, as: 'conteudos', where: { deletedAt: null }, required: false }]
        });
        
        res.render('student/viewCourse', { course: course.toJSON(), title: course.nome });
    }
};

module.exports = studentController;