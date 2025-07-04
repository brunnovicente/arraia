import express from 'express';
const router = express.Router();
import IngressoController from '../controllers/IngressoController.js';

router.get('/validar/:codigo', IngressoController.validar)

export default router;