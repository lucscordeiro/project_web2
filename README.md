# 🎓 Plataforma DigitalMente

Bem-vindo ao repositório da **DigitalMente**, um sistema web para gestão de cursos online. Este projeto foi desenvolvido para a disciplina de Desenvolvimento Web 2, focando na implementação de uma arquitetura MVC e boas práticas de programação.

> **Status do Projeto:** 🚧 Versão Professor (Concluída) | Versão Aluno (Funcional)| Infraestrutura (MySQL/Sequelize Concluída)

---

## 👥 Integrantes do Grupo
* **Denise Moura**
* **Lucas Cordeiro**

---

## 🛠️ Tecnologias Utilizadas
O projeto utiliza **Node.js** e **Express** no Backend, com **Sequelize** para o mapeamento objeto-relacional e gerenciamento do banco de dados **MySQL/MariaDB**. O Frontend é renderizado por **EJS** (Embedded JavaScript), utilizando **Bootstrap** para responsividade e design. A segurança é garantida pelo **Bcryptjs** (criptografia de senhas) e a gestão de estado por **Express-Session** e **Connect-Flash**.

---

## ⚙️ Funcionalidades do Sistema
O sistema implementa o CRUD (Create, Read, Update, Delete) seguindo o padrão de arquitetura MVC (Model-View-Controller) com múltiplos perfis:

### 🔐 Autenticação e Segurança
A plataforma oferece autenticação segura separada para Professor e Aluno. As senhas são criptografadas com Hash Bcrypt no banco de dados, e a segurança das rotas é mantida via authMiddleware. Mensagens de sucesso e erro são exibidas dinamicamente (Flash Messages).

### 📚 Gestão de Cursos (Área do Professor)
O Professor pode Criar novos cursos, visualizá-los em uma Listagem filtrada (apenas seus cursos ativos), Editar informações e gerenciar conteúdos internos. A Exclusão de cursos é feita via Soft Delete (.destroy()), garantindo que os dados históricos sejam mantidos.

### 📝 Gestão de Conteúdos (Aulas e Avaliações)
É possível adicionar múltiplos conteúdos dentro de um curso (relacionamento 1:N). A interface é dinâmica, permitindo escolher entre tipos Aula ou Avaliação com formatos específicos, e o Título é preenchido automaticamente com o número sequencial correto (e.g., "Aula 1 - Variáveis"). O conteúdo removido via Soft Delete é imediatamente ocultado das listagens ativas.

### 🧑‍🎓 Fluxo do Aluno
O aluno tem um Dashboard que mostra apenas cursos com status 'Inscrições Abertas' ou cursos nos quais ele já está matriculado (mesmo que o status do curso não seja mais 'Aberto'). O aluno pode Matricular-se, Desmatricular-se (Soft Delete rastreado) e Re-matricular-se em cursos arquivados.

## 🚀 Como Rodar o Projeto Localmente
### 1. Pré-requisitos
Certifique-se de ter o **Node.js** instalado e o servidor **MySQL/MariaDB (XAMPP)** rodando e configurado.

### 2. Instalação
Abra o terminal na pasta do projeto e instale as dependências listadas no **package.json**:
*npm install*

### 3. Configuração
Crie o banco de dados no **phpMyAdmin** com o nome **projeto_final_ead**.
Preencha seu arquivo **.env** com as credenciais do banco.

### 4. Execução
Execute o comando para iniciar o servidor, que também criará todas as tabelas via Sequelize:
*npm start*
Acesse a aplicação em: **http://localhost:3003/login**