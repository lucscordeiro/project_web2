# Plataforma DigitalMente 🎓

Sistema de gestão de cursos online (Versão Professor; versão Aluno a desenvolver) desenvolvido para a disciplina de Desenvolvimento Web. O projeto segue a arquitetura MVC e utiliza persistência de dados em arquivos JSON.

## 👥 Integrantes
* **Denise Moura**
* **Lucas Cordeiro**

## 🛠️ Tecnologias e Dependências
* Node.js
* Express (Servidor Web)
* EJS e Express-EJS-Layouts (Frontend/Templates)
* Bcryptjs (Segurança/Criptografia de senhas)
* UUID (Geração de IDs únicos - Versão 9.0.1)
* Bootstrap (Estilização via CDN)

## ⚙️ Funcionalidades Implementadas
* Autenticação: Cadastro e Login de professores com senhas criptografadas (Hash).
* Gestão de Cursos (CRUD):
  * Criar novos cursos.
  * Listar cursos cadastrados.
  * Atualizar (Editar) informações.
  * Excluir cursos.
* Arquitetura MVC Separação clara entre Rotas, Controllers e Views.

---

## 🚀 Como Rodar o Projeto
* Módulos instalados: 
    * express, 
    * ejs, 
    * express-ejs-layouts
* Instalar: npm install uuid@9.0.1
* npm start