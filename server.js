const express = require("express");
const app = express();
const ejsLayouts = require("express-ejs-layouts");
const path = require("path");
const port = 3000;

// Frontend
app.set("view engine", "ejs"); // renderizador EJS
app.set("views", path.join(__dirname, "views")); // HTMLs
app.use(ejsLayouts); // layout mestre
app.set("layout", "layout"); // layout.ejs padrão

// Estáticos e Leitura de Dados
app.use(express.static(path.join(__dirname, "public"))); // CSS/Imagens
app.use(express.json()); // JSON
app.use(express.urlencoded({ extended: true })); // formulários HTML

// Rotas MVC
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

app.use('/', authRoutes);   // Login/Cadastro
app.use('/', courseRoutes); // Cursos

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});