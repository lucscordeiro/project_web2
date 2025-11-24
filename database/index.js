require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
        }
    }
);

// Conexão e sincronização das tabelas
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
        
        // Sincroniza todas as models e cria as tabelas
        await sequelize.sync({ alter: true }); 
        console.log('✅ Tabelas sincronizadas.');

        // Usuário de GESTÃO padrão (se não existir)
        const User = require('../models/User');
        const defaultAdmin = await User.findOne({ where: { email: 'gestao@gestao.com' } });
        if (!defaultAdmin) {
            const bcrypt = require('bcryptjs');
            await User.create({
                nome: 'Administrador Geral',
                email: 'gestao@gestao.com',
                password: bcrypt.hashSync('gestao', 10),
                tipo: 'gestao'
            });
            console.log("🛠️ Usuário 'gestao@gestao.com' criado com senha 'gestao'.");
        }


    } catch (error) {
        console.error('❌ Não foi possível conectar ao banco de dados:', error.message);
        process.exit(1);
    }
}

connectDB();

module.exports = sequelize;