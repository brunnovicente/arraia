import banco from '../config/banco.js';

const Membro = banco.sequelize.define('membros', {
    id: {
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: banco.Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: banco.Sequelize.STRING(100),
        allowNull: false
    },
    siape: {
        type: banco.Sequelize.STRING(100),
        allowNull: false
    }
});

export default Membro;
