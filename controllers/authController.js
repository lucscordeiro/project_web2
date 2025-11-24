const bcrypt = require('bcryptjs'); 
const User = require('../models/User'); 
const Student = require('../models/Student');

const authController = {
    // FUNÇÃO SIMPLIFICADA SEM LÓGICA DE ADMIN
    redirectDashboard: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        if (req.session.user.tipo === 'professor') {
            return res.redirect('/home');
        }
        if (req.session.user.tipo === 'aluno') {
            return res.redirect('/aluno/dashboard');
        }
        res.redirect('/login');
    },

    loginForm: (req, res) => {
        res.render('auth/login', { title: 'Login' });
    },

    // Processa o Login (Professor ou Aluno)
    login: async (req, res) => {
        const { email, password } = req.body;
        
        // Tenta achar em User (Professor)
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Tenta achar em Student (Aluno)
            user = await Student.findOne({ where: { email } });
        }

        if (!user) {
            req.flash('error', 'Login falhou: Email não cadastrado.');
            return res.redirect('/login');
        }

        if (bcrypt.compareSync(password, user.password)) {
            // Salvar na sessão
            req.session.user = { 
                id: user.id, 
                nome: user.nome, 
                email: user.email, 
                tipo: user.tipo 
            };
            req.flash('success', `Bem-vindo, ${user.nome}! Você logou como ${user.tipo.toUpperCase()}.`);
            return authController.redirectDashboard(req, res);
        }
        
        req.flash('error', 'Login falhou: Senha incorreta.');
        res.redirect('/login');
    },

    // Cadastro de Professor
    registerForm: (req, res) => { res.render('auth/register', { title: 'Cadastro Professor' }); },
    register: async (req, res) => { 
        const { nome, email, password } = req.body;
        if (await User.findOne({ where: { email } })) {
            req.flash('error', 'Erro: Email já cadastrado como Professor.');
            return res.redirect('/cadastro');
        }
        await User.create({ nome, email, password: bcrypt.hashSync(password, 10), tipo: 'professor' });
        req.flash('success', 'Professor cadastrado com sucesso! Faça login.');
        res.redirect('/login');
    },

    // Cadastro de Aluno
    registerStudentForm: (req, res) => { res.render('auth/register_student', { title: 'Cadastro Aluno' }); },
    registerStudent: async (req, res) => { 
        const { nome, email, password } = req.body;
        if (await Student.findOne({ where: { email } })) {
            req.flash('error', 'Erro: Email já cadastrado como Aluno.');
            return res.redirect('/aluno/cadastro');
        }
        await Student.create({ nome, email, password: bcrypt.hashSync(password, 10), tipo: 'aluno' });
        req.flash('success', 'Aluno cadastrado com sucesso! Faça login.');
        res.redirect('/login');
    },

    // CORREÇÃO PARA EVITAR CRASH NO LOGOUT
    logout: (req, res) => {
        req.flash('success', 'Sessão encerrada com sucesso.');
        
        req.session.destroy(err => {
            if (err) {
                console.error("Erro ao fazer logout:", err);
            }
            
            res.clearCookie('connect.sid'); 
            
            res.redirect('/login');
        });
    }
};

module.exports = authController;