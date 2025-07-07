import express from 'express';
const router = express.Router();
import IngressoController from '../controllers/IngressoController.js';
import {isLogado} from "../helpers/permissao.js";

router.get('/validar/:codigo', isLogado, IngressoController.validar)
router.get('/listar/:aluno', IngressoController.listar)
router.get('/todos/:curso', IngressoController.todos)

export default router;