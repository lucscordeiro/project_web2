const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs'); // criptografia
const { v4: uuidv4 } = require('uuid'); // IDs únicos

const usersPath = path.join(__dirname, '../database/users.json');

// ler JSON
const getUsers = () => {
    if (!fs.existsSync(usersPath)) return [];
    return JSON.parse(fs.readFileSync(usersPath, 'utf-8') || '[]');
};

const authController = {
    // tela de Login (GET)
    loginForm: (req, res) => {
        // Enviamos error: null para garantir que a variável exista na view
        res.render('auth/login', { title: 'Login', error: null });
    },

    // Cadastro (GET)
    registerForm: (req, res) => {
        res.render('auth/register', { title: 'Criar Conta' });
    },

    // Processa o Cadastro (POST)
    register: (req, res) => {
        const { nome, email, password } = req.body;
        const users = getUsers();

        // duplicidade
        if (users.find(u => u.email === email)) {
            return res.send('Erro: Email já cadastrado.');
        }

        // CRIPTOGRAFIA
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = {
            id: uuidv4(),
            nome,
            email,
            password: hashPassword, 
            tipo: 'professor'
        };

        users.push(newUser);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        res.redirect('/login');
    },

    // Processa o Login (POST)
    login: (req, res) => {
        const { email, password } = req.body;
        const users = getUsers();
        const user = users.find(u => u.email === email);

        // Verifica se usuário existe E se a senha bate
        if (user && bcrypt.compareSync(password, user.password)) {
            return res.redirect('/home');
        }
        
        // SE FALHAR: Não redireciona, renderiza a página novamente com aviso
        res.render('auth/login', { 
            title: 'Login', 
            error: 'Usuário ou senha incorretos!' 
        });
    }
};

module.exports = authController;