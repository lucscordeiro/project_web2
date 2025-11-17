# 🎓 Plataforma DigitalMente

Bem-vindo ao repositório da **DigitalMente**, um sistema web para gestão de cursos online. Este projeto foi desenvolvido para a disciplina de Desenvolvimento Web 2, focando na implementação de uma arquitetura MVC e boas práticas de programação.

> **Status do Projeto:** 🚧 Versão Professor (Concluída) | Versão Aluno (Em desenvolvimento)

---

## 👥 Integrantes do Grupo
* **Denise Moura**
* **Lucas Cordeiro**

---

## 🛠️ Tecnologias Utilizadas
* **Backend:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* **Frontend:** [EJS](https://ejs.co/) (Embedded JavaScript) com [Express-EJS-Layouts](https://www.npmjs.com/package/express-ejs-layouts)
* **Estilização:** [Bootstrap](https://getbootstrap.com/) (via CDN para responsividade e design limpo)
* **Segurança:** [Bcryptjs](https://www.npmjs.com/package/bcryptjs) (Criptografia de senhas)
* **Gerenciamento de Dados:** JSON (Persistência de dados leve via sistema de arquivos)
* **Utilitários:** [UUID v9.0.1](https://www.npmjs.com/package/uuid) (Geração de identificadores únicos)

---

## ⚙️ Funcionalidades do Sistema
O sistema implementa um **CRUD** (Create, Read, Update, Delete) seguindo o padrão de arquitetura **MVC** (Model-View-Controller):

### 🔐 Autenticação e Segurança
* Cadastro de novos professores.
* Login seguro com verificação de credenciais.
* Criptografia de senhas no banco de dados (Hash).

### 📚 Gestão de Cursos (Área do Professor)
* **Criar:** Adicionar novos cursos com título, descrição e status.
* **Listar:** Visualização de todos os cursos com status colorido (Em andamento, Inscrições abertas, etc.).
* **Editar:** Alterar informações do curso e gerenciar o conteúdo interno.
* **Excluir:** Remoção segura de cursos.

### 📝 Gestão de Conteúdos (Aulas e Avaliações)
* Adicionar múltiplos conteúdos dentro de um curso (Relacionamento 1:N).
* Tipos de conteúdo dinâmicos: **Aula** (Vídeo, PDF, Link) ou **Avaliação** (Formulário, Texto).
* Interface dinâmica que adapta os campos conforme o tipo escolhido.

---

## 🚀 Como Rodar o Projeto Localmente
Siga os passos abaixo para executar a aplicação na sua máquina:

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** instalado.

### 2. Instalação
Abra o terminal na pasta do projeto e instale as dependências listadas no `package.json`:

```bash npm install