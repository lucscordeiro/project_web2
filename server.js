require('dotenv').config();
const express = require("express");
const app = express();
const ejsLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require('express-session');
const flash = require('connect-flash');
const port = 3003;

// Inicializa a conexão com o banco de dados e cria as tabelas
require('./database'); 

// Frontend
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayouts);
app.set("layout", "layout");

// Configuração da Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'chave-secreta-padrao-fraca',
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid', 
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash());

// Middleware para locals e flash messages
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error'); 
    next();
});

// Estáticos e Leitura de Dados
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas MVC
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

app.use('/', authRoutes);
app.use('/', courseRoutes); 

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});