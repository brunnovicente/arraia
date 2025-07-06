import express from 'express';
const router = express.Router();
import AlunoController from '../controllers/AlunoController.js';

router.get('/confirmar', AlunoController.confirmar)
router.post('/presenca', AlunoController.presenca)
router.get('/buscar/:matricula', AlunoController.buscar)
router.get('/ingresso/:aluno', AlunoController.ingresso)
router.get('/curso', AlunoController.curso)
router.get('/lista/:curso', AlunoController.lista)

export default router;