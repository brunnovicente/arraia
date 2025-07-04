import express from 'express';
const router = express.Router();
import principalController from '../controllers/PrincipalController.js';

router.get('/', principalController.index)

export default router;