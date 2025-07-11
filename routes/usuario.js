import express from 'express'
import UsuarioController from "../controllers/UsuarioController.js";
const router = express.Router()

router.get('/login', (req, res) => {res.render('usuario/login')})
router.post('/login', UsuarioController.login)
router.get('/logout', UsuarioController.logout)
router.get('/senha/:senha', UsuarioController.senha)

export default router