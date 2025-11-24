const { DataTypes } = require('sequelize');
const sequelize = require('../database/index');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    tipo: { 
        type: DataTypes.ENUM('gestao', 'professor'), 
        defaultValue: 'professor', 
        allowNull: false
    }
}, {
    paranoid: true // Soft Delete
});

module.exports = User;