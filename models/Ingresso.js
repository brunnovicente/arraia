import banco from '../config/banco.js';
import Aluno from "./Aluno.js";

const Ingresso = banco.sequelize.define('ingressos', {
    id: {
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: banco.Sequelize.STRING(250),
        allowNull: false
    },
    qrcode: {
        type: banco.Sequelize.STRING(500),
        allowNull: false
    },
    status: {
        type: banco.Sequelize.INTEGER,
        allowNull: false
    },
    descricao: {
        type: banco.Sequelize.STRING(100),
        allowNull: true
    },
});

Ingresso.belongsTo(Aluno, {
    foreignKey: 'alunos_id',
    constraint: true,
    onDelete: 'CASCADE'
});

export default Ingresso;
