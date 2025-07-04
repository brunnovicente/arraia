import banco from '../config/banco.js';
import Membro from './Membro.js';

const Usuario = banco.sequelize.define('usuarios', {
    id: {
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: banco.Sequelize.STRING(100),
        allowNull: false
    },
    password: {
        type: banco.Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: banco.Sequelize.STRING(100),
        allowNull: false
    },
    tipo: {
        type: banco.Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: banco.Sequelize.INTEGER,
        allowNull: false
    },
    membros_id: {
        type: banco.Sequelize.INTEGER,
        allowNull: false
    }
});

Usuario.belongsTo(Membro, {
    foreignKey: 'membros_id',
    constraint: true,
    onDelete: 'CASCADE'
});

export default Usuario;
