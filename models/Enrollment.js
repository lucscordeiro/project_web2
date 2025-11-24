const { DataTypes } = require('sequelize');
const sequelize = require('../database/index');

const Enrollment = sequelize.define('Enrollment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    status: {
        type: DataTypes.ENUM('matriculado', 'desmatriculado'), 
        defaultValue: 'matriculado',
        allowNull: false
    }
}, {
    // ESSENCIAL para rastrear o momento da desmatrícula
    paranoid: true, 
    timestamps: true,
    underscored: true,
});

module.exports = Enrollment;