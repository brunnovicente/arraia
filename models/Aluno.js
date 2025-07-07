import banco from '../config/banco.js';

const Aluno = banco.sequelize.define('alunos', {
    id: {
        type: banco.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    matricula: {
        type: banco.Sequelize.STRING(45),
        allowNull: false
    },
    nome: {
        type: banco.Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: banco.Sequelize.STRING(100),
        allowNull: false
    },
    status: {
        type: banco.Sequelize.INTEGER,
        allowNull: false
    },
    codigo: {
        type: banco.Sequelize.STRING(100),
    },
    curso:{
        type: banco.Sequelize.STRING(20),
    }
});

// Aluno.hasMany(Ingresso, {
//     foreignKey: 'alunos_id',
//     constraint: true,
//     onDelete: 'CASCADE'
// })

export default Aluno
