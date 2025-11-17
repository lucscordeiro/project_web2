const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const coursesPath = path.join(__dirname, '../database/courses.json');

const getCourses = () => {
    if (!fs.existsSync(coursesPath)) return [];
    return JSON.parse(fs.readFileSync(coursesPath, 'utf-8') || '[]');
};

const saveCourses = (data) => {
    fs.writeFileSync(coursesPath, JSON.stringify(data, null, 2));
};

const courseController = {
    home: (req, res) => {
        res.render('home', { title: 'Tela Inicial' });
    },

    index: (req, res) => {
        const courses = getCourses();
        res.render('courses/index', { courses, title: 'Meus Cursos' });
    },

    create: (req, res) => {
        res.render('courses/create', { title: 'Novo Curso' });
    },

    // Criar Curso (Container)
    store: (req, res) => {
        const { nome, descricao, status } = req.body;
        const courses = getCourses();

        const newCourse = {
            id: uuidv4(),
            nome,
            descricao,
            status,
            conteudos: [] // Array vazio obrigatório
        };

        courses.push(newCourse);
        saveCourses(courses);
        // Vai direto para a edição para adicionar aulas
        res.redirect(`/cursos/editar/${newCourse.id}`);
    },

    // Editar Curso
    edit: (req, res) => {
        const { id } = req.params;
        const courses = getCourses();
        // CORREÇÃO: Converte para String para achar tanto ID "1" quanto UUID
        const course = courses.find(c => String(c.id) === String(id));
        
        if (!course) return res.redirect('/cursos');

        // Garante que o array existe
        if (!course.conteudos) course.conteudos = [];
        
        res.render('courses/edit', { course, title: 'Gerenciar Curso' });
    },

    update: (req, res) => {
        const { id } = req.params;
        const { nome, descricao, status } = req.body;
        let courses = getCourses();

        const index = courses.findIndex(c => String(c.id) === String(id));
        if (index !== -1) {
            const existingContents = courses[index].conteudos || [];
            courses[index] = { 
                id: courses[index].id, // Mantém o ID original (número ou string)
                nome, 
                descricao, 
                status, 
                conteudos: existingContents 
            };
            saveCourses(courses);
        }
        res.redirect('/cursos');
    },

    delete: (req, res) => {
        const { id } = req.params;
        let courses = getCourses();
        courses = courses.filter(c => String(c.id) !== String(id));
        saveCourses(courses);
        res.redirect('/cursos');
    },

    // --- LÓGICA DE CONTEÚDO ---

    storeContent: (req, res) => {
        const { id } = req.params;
        const { titulo, categoria, formato, link } = req.body;
        let courses = getCourses();
        
        // CORREÇÃO: Busca robusta de ID
        const courseIndex = courses.findIndex(c => String(c.id) === String(id));

        if (courseIndex !== -1) {
            const newContent = {
                id: uuidv4(),
                titulo,
                categoria,
                formato,
                link
            };
            
            if (!courses[courseIndex].conteudos) courses[courseIndex].conteudos = [];
            
            courses[courseIndex].conteudos.push(newContent);
            saveCourses(courses);
            
            // Sucesso: volta para a página
            return res.redirect(`/cursos/editar/${id}`);
        } 
        
        console.log("Erro: Curso não encontrado para ID", id);
        res.redirect('/cursos');
    },

    deleteContent: (req, res) => {
        const { id, contentId } = req.params;
        let courses = getCourses();
        const courseIndex = courses.findIndex(c => String(c.id) === String(id));

        if (courseIndex !== -1 && courses[courseIndex].conteudos) {
            courses[courseIndex].conteudos = courses[courseIndex].conteudos.filter(item => item.id !== contentId);
            saveCourses(courses);
        }
        res.redirect(`/cursos/editar/${id}`);
    }
};

module.exports = courseController;