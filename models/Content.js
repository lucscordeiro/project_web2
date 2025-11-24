const { DataTypes } = require('sequelize');
const sequelize = require('../database/index');

const Content = sequelize.define('Content', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    titulo: { type: DataTypes.STRING(100), allowNull: false },
    categoria: { type: DataTypes.STRING(50), allowNull: false },
    formato: { type: DataTypes.STRING(50), allowNull: false },
    link: { type: DataTypes.STRING, allowNull: true },
}, {
    paranoid: true
});

module.exports = Content;