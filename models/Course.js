const { DataTypes } = require('sequelize');
const sequelize = require('../database/index');
const Content = require('./Content'); 
const Student = require('./Student'); 
const Enrollment = require('./Enrollment'); 
const User = require('./User'); // Novo: Importa User

const Course = sequelize.define('Course', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    status: {
        type: DataTypes.ENUM('Inscrições Abertas', 'Em Andamento', 'Finalizado', 'Pausado'),
        defaultValue: 'Inscrições Abertas',
        allowNull: false
    }
}, {
    paranoid: true 
});

// 1:N com Conteúdo
Course.hasMany(Content, { foreignKey: 'courseId', as: 'conteudos', onDelete: 'CASCADE' });
Content.belongsTo(Course, { foreignKey: 'courseId', as: 'curso' });

// 1:N com Professor (Um Professor tem muitos Cursos)
Course.belongsTo(User, { foreignKey: 'UserId', as: 'professor' });
User.hasMany(Course, { foreignKey: 'UserId', as: 'cursos' });

// N:M com Aluno (via Enrollment)
Course.belongsToMany(Student, { 
    through: Enrollment, 
    as: 'students', 
    foreignKey: 'courseId' 
});
Student.belongsToMany(Course, { 
    through: Enrollment, 
    as: 'courses', 
    foreignKey: 'studentId' 
});

// Associações de Enrollment para INCLUDE: Matrícula pertence a Curso e Aluno
Enrollment.belongsTo(Course, { foreignKey: 'CourseId', as: 'Course' });
Enrollment.belongsTo(Student, { foreignKey: 'StudentId', as: 'Student' });

module.exports = Course;