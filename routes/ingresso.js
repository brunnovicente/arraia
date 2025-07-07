import express from 'express';
const router = express.Router();
import IngressoController from '../controllers/IngressoController.js';

router.get('/validar/:codigo', IngressoController.validar)
router.get('/listar/:aluno', IngressoController.listar)

export default router;