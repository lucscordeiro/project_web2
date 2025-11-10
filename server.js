const express = require("express");
const ejsLayouts = require("express-ejs-layouts"); 
const app = express();
const port = 3000;

// JSON
let users = [];

try {
  users = require("./users.json");
} catch (e) {
  console.warn("Não foi possível carregar ./users.json. Iniciando com array vazio.");
}

// Express
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(ejsLayouts); 
app.set("layout", "layout"); // layout padrão

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota principal - index.ejs
app.get("/", (req, res) => {
  res.render("index", {
    title: "Página Inicial",
  });
});

// login - index.ejs
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

// login.ejs
app.post("/login", (req, res) => {
  const user = users.find(
    (u) => u.email === req.body.email && u.password === req.body.password
  );
  if (user) {
    // sessions - usuário logado
    res.redirect("/home");
  } else {
    res.redirect("/login?erro=1");
  }
});

// Página Home após login
app.get("/home", (req, res) => {
  res.render("home", {
    title: "Página Inicial",
  });
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});